from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

# user: soz password:Soz12345678
# admin:Admin12345678

class Profile(models.Model):
    ROLE_CHOICES = [
        ('instructor', 'Instructor'),
        ('student', 'Student'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

# a model for managing courses   
class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    students = models.ManyToManyField(User, through='Enrollment', related_name='enrolled_courses')

    def __str__(self):
        return self.title

# a model for lessons 
class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField() 
    video_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title

# a model for enrollment where students can enroll in a class
class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
            unique_together = ['student', 'course']  # Prevent double-enrollment

# a model for review where users can leave a review 
class Review(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='reviews')
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()  # from 1 to 5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course', 'student')  # Prevent duplicate reviews

    def __str__(self):
        return f"{self.course.title} - {self.student.username} ({self.rating})"