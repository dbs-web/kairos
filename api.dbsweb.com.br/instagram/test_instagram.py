#!/usr/bin/env python3
"""
Test script for Instagram API integration
Run this script to test the Instagram endpoints
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_URL = "https://api.dbsweb.com.br"
# For local testing, use: BASE_URL = "http://localhost:8000"

def test_instagram_endpoints():
    """Test all Instagram API endpoints"""
    
    print("🧪 Testing Instagram API Integration")
    print("=" * 50)
    
    # Test 1: Test endpoint
    print("\n1. Testing configuration...")
    try:
        response = requests.get(f"{BASE_URL}/instagram/test")
        if response.status_code == 200:
            data = response.json()
            print("✅ Configuration test passed")
            print(f"   App ID: {data.get('app_id', 'Not configured')}")
            print(f"   Webhook configured: {data.get('webhook_configured', False)}")
        else:
            print(f"❌ Configuration test failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Configuration test error: {e}")
    
    # Test 2: Get authorization URL
    print("\n2. Testing authorization URL generation...")
    try:
        response = requests.get(f"{BASE_URL}/instagram/auth/url?state=test123")
        if response.status_code == 200:
            data = response.json()
            print("✅ Authorization URL generated successfully")
            print(f"   URL: {data['auth_url'][:100]}...")
        else:
            print(f"❌ Authorization URL test failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Authorization URL test error: {e}")
    
    # Test 3: Webhook verification simulation
    print("\n3. Testing webhook verification...")
    verify_token = os.getenv('INSTAGRAM_WEBHOOK_VERIFY_TOKEN', 'test_token')
    try:
        params = {
            'hub.mode': 'subscribe',
            'hub.challenge': 'test_challenge_123',
            'hub.verify_token': verify_token
        }
        response = requests.get(f"{BASE_URL}/instagram/webhook", params=params)
        if response.status_code == 200 and response.text == 'test_challenge_123':
            print("✅ Webhook verification test passed")
        else:
            print(f"❌ Webhook verification test failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Webhook verification test error: {e}")
    
    # Test 4: Webhook data processing simulation
    print("\n4. Testing webhook data processing...")
    try:
        webhook_data = {
            "object": "instagram",
            "entry": [
                {
                    "id": "test_user_id",
                    "changes": [
                        {
                            "field": "media",
                            "value": {
                                "media_id": "test_media_id",
                                "time": 1234567890
                            }
                        }
                    ]
                }
            ]
        }
        
        headers = {'Content-Type': 'application/json'}
        response = requests.post(
            f"{BASE_URL}/instagram/webhook", 
            json=webhook_data, 
            headers=headers
        )
        if response.status_code == 200:
            print("✅ Webhook data processing test passed")
        else:
            print(f"❌ Webhook data processing test failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Webhook data processing test error: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Instagram API tests completed!")
    print("\nNext steps:")
    print("1. Configure environment variables in .env file")
    print("2. Set up Instagram app in Meta Developer Dashboard")
    print("3. Configure webhook URL: https://api.dbsweb.com.br/instagram/webhook")
    print("4. Test with real Instagram OAuth flow")

def test_with_real_token():
    """Test endpoints that require a real Instagram access token"""
    
    access_token = input("\nEnter Instagram access token (or press Enter to skip): ").strip()
    if not access_token:
        print("Skipping real token tests...")
        return
    
    print("\n🔑 Testing with real access token...")
    
    # Test user profile
    print("\n5. Testing user profile retrieval...")
    try:
        data = {"access_token": access_token}
        response = requests.post(f"{BASE_URL}/instagram/user/profile", json=data)
        if response.status_code == 200:
            profile = response.json()['profile']
            print("✅ User profile retrieved successfully")
            print(f"   Username: {profile.get('username')}")
            print(f"   Account type: {profile.get('account_type')}")
            print(f"   Media count: {profile.get('media_count')}")
        else:
            print(f"❌ User profile test failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ User profile test error: {e}")
    
    # Test user media
    print("\n6. Testing user media retrieval...")
    try:
        data = {"access_token": access_token}
        response = requests.post(f"{BASE_URL}/instagram/user/media?limit=5", json=data)
        if response.status_code == 200:
            media = response.json()['media']
            print("✅ User media retrieved successfully")
            print(f"   Media count: {len(media.get('data', []))}")
            if media.get('data'):
                first_media = media['data'][0]
                print(f"   First media ID: {first_media.get('id')}")
                print(f"   Media type: {first_media.get('media_type')}")
        else:
            print(f"❌ User media test failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ User media test error: {e}")

if __name__ == "__main__":
    test_instagram_endpoints()
    test_with_real_token()
