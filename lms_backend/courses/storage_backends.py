from storages.backends.s3boto3 import S3Boto3Storage

class PublicMediaStorage(S3Boto3Storage):
    location = 'media'  # or 'thumbnails' or whatever S3 subfolder you want
    default_acl = 'public-read'

    
class PublicProfilePicStorage(S3Boto3Storage):
    location = 'profile_pics'
    default_acl = 'public-read'
    file_overwrite = False

class PublicThumbnailStorage(S3Boto3Storage):
    location = 'course_thumbnails'
    default_acl = 'public-read'
    file_overwrite = False