import boto3
from botocore.client import Config
from typing import Optional

class MinioClient:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            endpoint_url="http://localhost:9000",  # Docker service name + port
            aws_access_key_id="minioadmin",
            aws_secret_access_key="minioadmin",
            config=Config(signature_version="s3v4"),
            region_name="us-east-1"
        )
        self.bucket_name = "supreme-court-cases-html"
        
        # Ensure bucket exists
        self._ensure_bucket_exists()
    
    def _ensure_bucket_exists(self):
        """Ensure the bucket exists, create if it doesn't"""
        try:
            buckets = self.s3.list_buckets()["Buckets"]
            if self.bucket_name not in [b["Name"] for b in buckets]:
                self.s3.create_bucket(Bucket=self.bucket_name)
                print(f"Bucket '{self.bucket_name}' created.")
            else:
                print(f"Bucket '{self.bucket_name}' already exists.")
        except Exception as e:
            print(f"Error ensuring bucket exists: {e}")
    
    def get_html_content(self, html_path: str) -> Optional[str]:
        """Get HTML content from MinIO bucket"""
        try:
            if not html_path:
                return None
                
            # Remove any leading slashes or local path prefixes
            clean_path = html_path.lstrip('/').replace('scrapping/supreme_court_cases_html/', '')
            
            response = self.s3.get_object(Bucket=self.bucket_name, Key=clean_path)
            html_content = response['Body'].read().decode('utf-8')
            return html_content
        except Exception as e:
            print(f"Error retrieving HTML content for {html_path}: {e}")
            return None
    
    def get_presigned_url(self, html_path: str, expires_in: int = 3600) -> Optional[str]:
        """Get a presigned URL for the HTML file"""
        try:
            if not html_path:
                return None
                
            # Remove any leading slashes or local path prefixes
            clean_path = html_path.lstrip('/').replace('scrapping/supreme_court_cases_html/', '')
            
            url = self.s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': clean_path},
                ExpiresIn=expires_in
            )
            return url
        except Exception as e:
            print(f"Error generating presigned URL for {html_path}: {e}")
            return None

def bootstrap_minio_client() -> MinioClient:
    """Bootstrap function to create MinIO client"""
    return MinioClient()
