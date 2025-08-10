#!/usr/bin/env python3
"""
Test script for the summarize functionality
"""

import requests
import json

def test_summarize_endpoint():
    """Test the summarize document endpoint"""
    
    # Test data - using a sample document ID
    test_data = {
        "doc_id": "test_document_123"
    }
    
    try:
        # Make request to the summarize endpoint
        response = requests.post(
            "http://localhost:8501/api/summarize_document",
            headers={"Content-Type": "application/json"},
            data=json.dumps(test_data)
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print("✅ Summarize endpoint working correctly!")
                print(f"Summary: {result.get('summary', 'No summary returned')}")
            else:
                print("❌ Summarize endpoint returned error:")
                print(f"Error: {result.get('error', 'Unknown error')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the backend is running on localhost:8501")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    print("Testing summarize document endpoint...")
    test_summarize_endpoint() 