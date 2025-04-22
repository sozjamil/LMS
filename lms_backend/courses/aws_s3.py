import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings

def upload_to_s3(file, bucket_name, file_name):
    try:
        # Create an S3 client
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )

        # Upload the file to S3
        s3.upload_fileobj(file, bucket_name, file_name)
        
        # Generate the file URL after successful upload
        file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
        print(f"File uploaded successfully. URL: {file_url}")

        return file_url
    except NoCredentialsError:
        print("Error: AWS credentials are missing or incorrect.")
        return None
    except Exception as e:
        print(f"Error during S3 upload: {e}")
        return None
    finally:
        if hasattr(file, 'close'):
            file.close()