from io import BytesIO
import traceback
from django.conf import settings
from django.shortcuts import render

from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
import urllib
from .models import Course, Lesson, Profile
from .serializers import CourseSerializer, LessonSerializer

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

class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        return request.user.profile.role == 'instructor'
    

# class TokenObtainPairView(APIView):
#     def post(self, request):
#         serializer = TokenSerializer(data=request.data)
#         if serializer.is_valid():
#             username = serializer.validated_data['username']
#             password = serializer.validated_data['password']
#             user = User.objects.filter(username=username).first()
#             if user and user.check_password(password):
#                 refresh = RefreshToken.for_user(user)
#                 return Response({
#                     'access': str(refresh.access_token),
#                     'refresh': str(refresh)
#                 })
#             return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseList(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class LessonList(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CreateCourseView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsInstructor]

    def perform_create(self, serializer):
        print(self.request.headers)  # Log headers to verify the Authorization header  
        # Automatically set the instructor to the authenticated user
        serializer.save(instructor=self.request.user)

# class LessonCreateView(generics.CreateAPIView):
#     queryset = Lesson.objects.all()
#     serializer_class = LessonSerializer
#     permission_classes = [IsAuthenticated, IsInstructor] 

class LessonCreateView(APIView):
    def post(self, request, course_id):
        title = request.data.get('title')
        content = request.data.get('content')
        video = request.FILES.get('video')

        if not video:
            return Response({"error": "Video file is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Upload video to S3
        file_name = f'{course_id}/{video.name}'
        video_url = upload_to_s3(video, settings.AWS_STORAGE_BUCKET_NAME, file_name)

        if not video_url:
            return Response({"error": "Failed to upload video."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        lesson = Lesson.objects.create(
            title=title,
            content=content,
            course_id=course_id,
            video_url=video_url,
        )

        serializer = LessonSerializer(lesson)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Request Data:", request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            print("Validated Data:", serializer.validated_data)
            try:
                user = serializer.save()
                print("User created successfully:", user)

                role = request.data.get('role', 'student')
                print("Role from request:", role)

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
                return Response({"error": "A profile already exists for this user."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print("Error during user/profile creation:", e)
                traceback.print_exc()
                return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # To handle file uploads

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            if course.instructor != request.user:
                return Response({'error': 'Unauthorized'}, status=403)

            serializer = CourseSerializer(course)
            return Response(serializer.data)

        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)

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

class LessonUpdateView(APIView): 
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, lesson_id):
        try:
            lesson = Lesson.objects.get(id=lesson_id)

            if lesson.course.instructor != request.user:
                return Response({'error': 'Unauthorized'}, status=403)

            # Update title and content
            lesson.title = request.data.get('title', lesson.title)
            lesson.content = request.data.get('content', lesson.content)

            # Handle video file upload
            video_file = request.FILES.get('video')
            if video_file:
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
            
            serializer = LessonSerializer(lesson)
            return Response(serializer.data)

        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=404)
        except Exception as e:
            print(f"Error updating lesson: {str(e)}")
            return Response({'error': 'An error occurred while updating the lesson.'}, status=500)
    
class InstructorCoursesView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def get(self, request):
        # Get all courses where the instructor is the current user
        courses = Course.objects.filter(instructor=request.user)
        course_data = [
            {'id': course.id, 'title': course.title, 'description': course.description}
            for course in courses
        ]
        return Response(course_data)


# class RegisterUserView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response({'id': user.id, 'username': user.username}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)from django.shortcuts import render

