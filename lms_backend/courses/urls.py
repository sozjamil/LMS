from django.urls import path
from .views import CourseDetailView, CourseList, CourseReviewListCreateView, EnrollInCourseView, EnrolledCoursesView, InstructorCourseDeleteView, InstructorCoursesView, LessonList, CreateCourseView, LessonCreateView, LessonUpdateView, ProfilePictureUploadView, ToggleCoursePublishView, UserProfileView
from .views import RegisterUserView
from rest_framework_simplejwt.views import  TokenRefreshView #, TokenObtainPairView
from .views import CustomTokenObtainPairView 

urlpatterns = [
    path('courses/', CourseList.as_view(), name='course-list'),
    path('courses/create/', CreateCourseView.as_view(), name='create-course'), 
    path('courses/<int:course_id>/', CourseDetailView.as_view(), name='course-detail'),
    path('courses/<int:course_id>/lessons/', LessonCreateView.as_view(), name='lesson-create'),
    # enrollment path
    path('courses/<int:course_id>/enroll/', EnrollInCourseView.as_view(), name='enroll-course'),
    # review path 
    path('courses/<int:course_id>/reviews/', CourseReviewListCreateView.as_view(), name='course-reviews'),
    # Adding “My Courses” path for students
    path('student/courses/', EnrolledCoursesView.as_view(), name='enrolled-courses'),
    
    # Adding “My Courses” path for instructors
    path('instructor/courses/', InstructorCoursesView.as_view(), name='instructor-courses'),
    path('instructor/courses/<int:course_id>/delete/', InstructorCourseDeleteView.as_view(), name='instructor-course-delete'),
    # Adding “Publish/Unpublish” path for instructors 
    path('instructor/courses/<int:course_id>/toggle-publish/', ToggleCoursePublishView.as_view()),
    
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/upload-picture/', ProfilePictureUploadView.as_view(), name='upload-profile-picture'),


    path('lessons/', LessonList.as_view(), name='lesson-list'),
    path('lessons/<int:lesson_id>/', LessonUpdateView.as_view(), name='lesson-update'),

    path('register/', RegisterUserView.as_view(), name='register'),
    # path('token/', TokenObtainPairView.as_view(), name='token-obtain'),
   
    path('token/', CustomTokenObtainPairView.as_view(), name='token-obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   
]
