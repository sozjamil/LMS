# Generated by Django 4.2.5 on 2025-04-14 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_profile_profile_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='course_thumbnails/'),
        ),
    ]
