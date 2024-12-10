import traceback
from django.shortcuts import render

from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
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

class LessonCreateView(generics.CreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated, IsInstructor] 

from django.db import IntegrityError

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
    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            lessons = Lesson.objects.filter(course=course)  # Fetch all lessons for the course
            lesson_data = [{'id': lesson.id, 'title': lesson.title} for lesson in lessons]

            course_data = {
                'id': course.id,
                'title': course.title,
                'description': course.description,
                'lessons': lesson_data,
            }
            return JsonResponse(course_data)  # or render in a template if using Django templates
        except Course.DoesNotExist:
            return JsonResponse({'error': 'Course not found'}, status=404)


# class RegisterUserView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response({'id': user.id, 'username': user.username}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)from django.shortcuts import render

