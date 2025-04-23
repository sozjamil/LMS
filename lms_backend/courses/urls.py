from django.urls import path
from .views import CategoryChoicesView, CourseDetailView, CourseList, CourseReviewListCreateView, EnrollInCourseView, EnrolledCoursesView, InstructorCourseDeleteView, InstructorCoursesView, LessonList, CreateCourseView, LessonCreateView, LessonUpdateView, ProfilePictureUploadView, ToggleCoursePublishView, UserProfileView
from .views import RegisterUserView, instructor_stats
from rest_framework_simplejwt.views import  TokenRefreshView #, TokenObtainPairView
from .views import CustomTokenObtainPairView 

urlpatterns = [
    path('courses/', CourseList.as_view(), name='course-list'),
    path('courses/create/', CreateCourseView.as_view(), name='create-course'), 
    path('courses/<int:course_id>/', CourseDetailView.as_view(), name='course-detail'),
    # lesson create path
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
    
    # path for instructor stats
    path('instructor-stats/', instructor_stats, name='instructor-stats'),
    
    # Adding “Publish/Unpublish” path for instructors 
    path('instructor/courses/<int:course_id>/toggle-publish/', ToggleCoursePublishView.as_view()),
    
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/upload-picture/', ProfilePictureUploadView.as_view(), name='upload-profile-picture'),

    # adding lesson list and update path for instructors
    path('lessons/', LessonList.as_view(), name='lesson-list'),
    path('lessons/<int:pk>/', LessonUpdateView.as_view(), name='lesson-update'),
    # adding path for registering a new user
    path('register/', RegisterUserView.as_view(), name='register'),
    # Adding the path for the token obtain pair view   
    path('token/', CustomTokenObtainPairView.as_view(), name='token-obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path for the category choices API
    path('categories/', CategoryChoicesView.as_view(), name='category-choices'),
    
   
]
