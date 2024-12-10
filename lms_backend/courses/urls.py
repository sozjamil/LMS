from django.urls import path
from .views import CourseDetailView, CourseList, LessonList, CreateCourseView, LessonCreateView
from .views import RegisterUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('courses/', CourseList.as_view(), name='course-list'),
    path('courses/create/', CreateCourseView.as_view(), name='create-course'), 
    path('courses/<int:course_id>/', CourseDetailView.as_view(), name='course-detail'),
    path('courses/<int:course_id>/lessons/', LessonCreateView.as_view(), name='lesson-create'),


    path('lessons/', LessonList.as_view(), name='lesson-list'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   
]
