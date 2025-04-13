from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from rest_framework import serializers
from .models import Course, Lesson, Profile, Enrollment, Review

# TokenObtainPairSerializer is the default serializer used by Django REST to handle login 
# and return: access token, refresh token
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom fields
        data['username'] = self.user.username
        data['id'] = self.user.id

        # Add role if profile exists
        if hasattr(self.user, 'profile'):
            data['role'] = self.user.profile.role
        return data
    
# User serializer
class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)
    profile_picture = serializers.ImageField(source='profile.profile_picture', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data): 
        role = validated_data.pop('role', 'student') # default to 'student' if not provided
        user = User.objects.create_user(**validated_data)
        print("User created with validated data:", validated_data) # testing

        # Check if a Profile already exists before creating one
        if not hasattr(user, 'profile'):
            Profile.objects.create(user=user, role=role)

        return user


# Token serializer
class TokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    
class LessonSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'video_url']
        read_only_fields = ['video_url']  # Problem solve Mark video_url as read-only 
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        enrolled = self.context.get('enrolled', False)  #Pass this from the view


         # Only show content if enrolled
        if not enrolled:
            data['content'] = None
            data['video_url'] = None

        return data
    
class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)  # Problem solve add `read_only=True`

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'price', 'published', 'lessons']
        read_only_fields = ['instructor']  # Instructor should not be editable.

    def update(self, instance, validated_data):
        lessons_data = validated_data.pop('lessons', [])
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
        instance.published = validated_data.get('published', instance.published)
        instance.save()

        # Update lessons
        existing_lessons = {lesson.id: lesson for lesson in instance.lessons.all()}
        new_lessons = []

        for lesson_data in lessons_data:
            if 'id' in lesson_data:
                # Update existing lesson
                lesson = existing_lessons.pop(lesson_data['id'], None)
                if lesson:
                    for attr, value in lesson_data.items():
                        setattr(lesson, attr, value)
                    lesson.save()
            else:
                # Create new lesson
                new_lessons.append(Lesson(course=instance, **lesson_data))

        Lesson.objects.bulk_create(new_lessons)
        # Delete lessons not included in the update
        for lesson in existing_lessons.values():
            lesson.delete()

        return instance
    
class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'student', 'enrolled_at']
        read_only_fields = ['student', 'enrolled_at']


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id','username', 'rating', 'comment', 'created_at']
        read_only_fields = ['student','username','course', 'created_at']