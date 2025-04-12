from django.urls import path
from .views import CourseDetailView, CourseList, CourseReviewListCreateView, EnrollInCourseView, InstructorCoursesView, LessonList, CreateCourseView, LessonCreateView, LessonUpdateView, UserProfileView
from .views import RegisterUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('courses/', CourseList.as_view(), name='course-list'),
    path('courses/create/', CreateCourseView.as_view(), name='create-course'), 
    path('courses/<int:course_id>/', CourseDetailView.as_view(), name='course-detail'),
    path('courses/<int:course_id>/lessons/', LessonCreateView.as_view(), name='lesson-create'),
    
    path('instructor/courses/', InstructorCoursesView.as_view(), name='instructor-courses'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),


    path('lessons/', LessonList.as_view(), name='lesson-list'),
    path('lessons/<int:lesson_id>/', LessonUpdateView.as_view(), name='lesson-update'),

    path('register/', RegisterUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # enrollment path
    path('courses/<int:course_id>/enroll/', EnrollInCourseView.as_view(), name='enroll-course'),
    # review path 
    path('courses/<int:course_id>/reviews/', CourseReviewListCreateView.as_view(), name='course-reviews'),
   
]
