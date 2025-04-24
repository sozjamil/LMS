from io import BytesIO
import traceback
from django.conf import settings
from django.shortcuts import render

from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
import urllib
from .models import Course, Lesson, Profile, Enrollment, Review
from .serializers import CourseSerializer, CustomTokenObtainPairSerializer, LessonSerializer, EnrollmentSerializer, ReviewSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, TokenSerializer
from django.contrib.auth.models import User

from rest_framework.permissions import IsAuthenticated, BasePermission
from .serializers import CourseSerializer
from rest_framework.permissions import AllowAny
from django.db import IntegrityError

from django.http import JsonResponse
from .aws_s3 import upload_to_s3
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from django.core.files.uploadedfile import TemporaryUploadedFile
from rest_framework.generics import RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.decorators import api_view, permission_classes
from rest_framework import serializers

class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and request.user.profile.role == 'instructor'

#view for showing categories so I don't have to rewrite them in the frontend
class CategoryChoicesView(APIView):
    def get(self, request):
        categories = [
            {'value': key, 'label': label}
            for key, label in Course.CATEGORY_CHOICES
        ]
        return Response(categories)
        
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# view for listing courses
class CourseList(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny] 
    
    def get_queryset(self):
            user = self.request.user
            return Course.objects.filter(published=True)  # Everyone else sees only published

# view for showing lessons in a course
class LessonList(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]

# view for creating a course only for instructors
class CreateCourseView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsInstructor]

    def perform_create(self, serializer):
        # Automatically set the instructor to the authenticated user
        serializer.save(instructor=self.request.user)

# view for registering users
class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Create a mutable copy of request.data
        # data = request.data.copy()
        # print("Processed data before serializer:", data)  # Debug print

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()

                role = request.data.get('role', 'student')

                # Check if a Profile already exists
                if not hasattr(user, 'profile'):
                    profile = Profile.objects.create(user=user, role=role)
                    print("Profile created successfully:", profile)
                else:
                    print("Profile already exists for user:", user)

                return Response({'id': user.id, 'username': user.username, 'role': role}, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                print("Database IntegrityError:", e)
                traceback.print_exc()
                return Response({"error": "A user with that username or email already exists"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print("Error during user/profile creation:", e)
                traceback.print_exc()
                return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# view for showing course details and allowing instructors to update their courses
class CourseDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]  # To handle file uploads

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            
            # Hide unpublished courses from everyone except the instructor
            if not course.published and course.instructor != request.user:
                return Response({'error': 'Course not found'}, status=404)
           
            # Only check enrollment if user is authenticated
            enrolled = False
            
            if request.user.is_authenticated:
               enrolled = Enrollment.objects.filter(course=course, student=request.user).exists()

            serializer = CourseSerializer(
                course,
                context={'request': request, 'enrolled': enrolled}
            )
        
            course_data = serializer.data
            course_data['is_enrolled'] = enrolled 


            # If not enrolled, hide content and videos
            if not enrolled and course.instructor != request.user:
                for lesson in course_data.get('lessons', []):
                    lesson['content'] = 'Enroll to see the content'
                    lesson['video_url'] = None

            return Response(course_data)
        
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)
   
    # managing courses update for instructors
    def put(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)

            if course.instructor != request.user:
                return Response({'error': 'Unauthorized'}, status=403)

            serializer = CourseSerializer(course, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)

        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)
        except Exception as e:
            print("Error updating course:", str(e))
            return Response({'error': 'An error occurred while updating the course.'}, status=500)

# view for instructors to create lessons for their courses
class LessonCreateView(APIView):
    def post(self, request, course_id):
        title = request.data.get('title')
        content = request.data.get('content')
        video = request.FILES.get('video')
        course = Course.objects.get(pk=course_id)
        is_enrolled = course.students.filter(id=request.user.id).exists()
       
        video_url = None
        # Upload video to S3
        if video:
            file_name = f'{course_id}/{video.name}'
            video_url = upload_to_s3(video, settings.AWS_STORAGE_BUCKET_NAME, file_name)
            if not video_url:
                return Response({"error": "Failed to upload video."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        lesson = Lesson.objects.create(
            title=title,
            content=content,
            course_id=course_id,
            video_url=video_url,# this will be None if no video
        )

        serializer = LessonSerializer(lesson, context={
            'request': request,
            'enrolled': is_enrolled,
        })
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# view for instructors to update their lessons
class LessonUpdateView(RetrieveUpdateDestroyAPIView): 
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    queryset = Lesson.objects.all()  
    serializer_class = LessonSerializer  

    # RetrieveUpdateDestroyAPIView expects the URL parameter to be named pk (because lookup_field = 'pk' by default
    def put(self, request, pk):
        try:
            lesson = Lesson.objects.get(id=pk)
            is_enrolled = Enrollment.objects.filter(student=request.user, course=lesson.course).exists()
            

            if lesson.course.instructor != request.user:
                return Response({'error': 'Unauthorized'}, status=403)

            # Update title and content
            lesson.title = request.data.get('title', lesson.title)
            lesson.content = request.data.get('content', lesson.content)

            # Handle video file upload
            video_file = request.FILES.get('video')
            remove_video = request.data.get('remove_video') == 'true'
            
            if remove_video:
                lesson.video_url = None  # just clear it
            elif video_file:
                file_name = f'{lesson.course.id}/{video_file.name}'
                try:
                    video_url = upload_to_s3(video_file, settings.AWS_STORAGE_BUCKET_NAME, file_name)
                    if not video_url:
                        raise ValueError("S3 returned an invalid URL")
                    lesson.video_url = video_url
                except Exception as e:
                    print(f"Error uploading video: {str(e)}")
                    return Response({'error': 'Video upload failed'}, status=500)

            # Save the updated lesson
            lesson.save()
            
            serializer = LessonSerializer(lesson, context={
                'request': request,
                'enrolled': is_enrolled,  # your logic
            })
            return Response(serializer.data)

        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=404)
        except Exception as e:
            print(f"Error updating lesson: {str(e)}")
            return Response({'error': 'An error occurred while updating the lesson.'}, status=500)

# view for instructors to see their courses "My courses"   
class InstructorCoursesView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def get(self, request):
        # Get all courses where the instructor is the current user
        courses = Course.objects.filter(instructor=request.user)
        course_data = [
            {'id': course.id, 'title': course.title, 'description': course.description,
              'thumbnail': course.thumbnail.url if course.thumbnail else None,'published': course.published,
            }
            for course in courses
        ]
        return Response(course_data)

# view for showing user profile and allowing users to update their profile
class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the authenticated user
        return self.request.user

# view for students to enroll in courses
class EnrollInCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        user = request.user
        course = Course.objects.get(id=course_id)
        enrollment, created = Enrollment.objects.get_or_create(student=request.user, course=course)    
        
        
        if user.profile.role == 'instructor': # Check if the user is an instructor
            return Response({'detail': 'Instructors cannot enroll in courses.'}, status=status.HTTP_403_FORBIDDEN)
                
        if created:
            return Response({'message': 'Enrolled successfully'})
        else:
            return Response({'message': 'Already enrolled'})
        
# view for showing reviews for a course and allowing students to leave reviews
class CourseReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Review.objects.filter(course__id=course_id)

    def perform_create(self, serializer):
        course_id = self.kwargs['course_id']
        user = self.request.user
        # Ensure user is enrolled
        if not Enrollment.objects.filter(course_id=course_id, student=user).exists():
            raise serializers.ValidationError("You must be enrolled to leave a review.")
        serializer.save(course_id=course_id, student=user)

# view for students to see their enrolled courses "My courses"
class EnrolledCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        enrolled_courses = Course.objects.filter(students=user, published=True)
        course_data = [
            {'id': course.id, 'title': course.title, 'description': course.description, 'thumbnail': course.thumbnail.url if course.thumbnail else None}
            for course in enrolled_courses
        ]
        return Response(course_data)
    
class ProfilePictureUploadView(APIView):

    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        profile = request.user.profile
        profile.profile_picture = request.FILES.get('profile_picture')
        profile.save()
        return Response({'profile_picture': profile.profile_picture.url})

# view for instructors to delete their courses   
class InstructorCourseDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def delete(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id, instructor=request.user)
            course.delete()
            return Response({'message': 'Course deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)
        
# view for instructors to toggle course publish status
class ToggleCoursePublishView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def post(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id, instructor=request.user)
            course.published = not course.published
            course.save()
            return Response({'published': course.published}, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def instructor_stats(request):
    user = request.user
    if user.profile.role != 'instructor':
        return Response({'detail': 'Not authorized'}, status=403)

    courses = Course.objects.filter(instructor=user)
    total_courses = courses.count()
    total_enrollments = Enrollment.objects.filter(course__in=courses).count()

    return Response({
        'total_courses': total_courses,
        'total_enrollments': total_enrollments,
    })