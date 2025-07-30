#!/usr/bin/env python3
"""
Test script for Instagram API integration
Run this locally to test your deployed Instagram API
"""

import requests
import json

# Your deployed API URL
BASE_URL = "https://api.dbsweb.com.br"

def test_instagram_api():
    """Test Instagram API endpoints"""
    
    print("🧪 Testing Instagram API Integration")
    print("=" * 50)
    
    # Test 1: Basic configuration test
    print("\n1. Testing API configuration...")
    try:
        response = requests.get(f"{BASE_URL}/instagram/test")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Instagram API is working!")
            print(f"   App ID: {data.get('app_id', 'Not configured')}")
            print(f"   Redirect URI: {data.get('redirect_uri', 'Not configured')}")
            print(f"   Webhook configured: {data.get('webhook_configured', False)}")
        else:
            print(f"❌ API test failed")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False
    
    # Test 2: Get Instagram authorization URL
    print("\n2. Testing authorization URL generation...")
    try:
        response = requests.get(f"{BASE_URL}/instagram/auth/url?state=test123")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Authorization URL generated successfully!")
            auth_url = data['auth_url']
            print(f"   URL: {auth_url}")
            print(f"   You can use this URL to test Instagram OAuth")
        else:
            print(f"❌ Authorization URL generation failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Authorization URL error: {e}")
    
    # Test 3: Test webhook verification (simulate Instagram's verification)
    print("\n3. Testing webhook verification...")
    try:
        params = {
            'hub.mode': 'subscribe',
            'hub.challenge': 'test_challenge_12345',
            'hub.verify_token': 'your_webhook_verify_token'  # This should match your .env
        }
        
        response = requests.get(f"{BASE_URL}/instagram/webhook", params=params)
        
        if response.status_code == 200 and response.text == 'test_challenge_12345':
            print("✅ Webhook verification working!")
            print("   Instagram will be able to verify your webhook URL")
        elif response.status_code == 403:
            print("⚠️  Webhook verification failed - check your INSTAGRAM_WEBHOOK_VERIFY_TOKEN")
        else:
            print(f"❌ Webhook verification failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Webhook verification error: {e}")
    
    # Test 4: Test webhook data processing (simulate Instagram sending data)
    print("\n4. Testing webhook data processing...")
    try:
        webhook_data = {
            "object": "instagram",
            "entry": [
                {
                    "id": "test_user_123",
                    "changes": [
                        {
                            "field": "media",
                            "value": {
                                "media_id": "test_media_456",
                                "time": 1640995200
                            }
                        }
                    ]
                }
            ]
        }
        
        headers = {'Content-Type': 'application/json'}
        response = requests.post(f"{BASE_URL}/instagram/webhook", json=webhook_data, headers=headers)
        
        if response.status_code == 200:
            print("✅ Webhook data processing working!")
            print("   Instagram webhooks will be processed correctly")
        else:
            print(f"❌ Webhook processing failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Webhook processing error: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Instagram API tests completed!")
    
    print("\n📋 Next Steps:")
    print("1. ✅ API is deployed and working")
    print("2. 🔧 Configure your Instagram app in Meta Developer Dashboard:")
    print(f"   - Webhook URL: {BASE_URL}/instagram/webhook")
    print(f"   - Redirect URI: {BASE_URL}/instagram/auth/callback")
    print("3. 🔑 Set up environment variables on your server")
    print("4. 🧪 Test real Instagram OAuth flow")
    
    return True

def test_oauth_flow():
    """Guide user through testing OAuth flow"""
    print("\n" + "=" * 50)
    print("🔐 Testing Instagram OAuth Flow")
    print("=" * 50)
    
    # Get auth URL
    try:
        response = requests.get(f"{BASE_URL}/instagram/auth/url?state=manual_test")
        if response.status_code == 200:
            auth_url = response.json()['auth_url']
            print(f"\n1. Open this URL in your browser:")
            print(f"   {auth_url}")
            print("\n2. Authorize the app")
            print("3. Copy the 'code' parameter from the redirect URL")
            
            code = input("\n4. Paste the authorization code here (or press Enter to skip): ").strip()
            
            if code:
                # Test callback
                callback_data = {
                    "code": code,
                    "state": "manual_test"
                }
                
                print("\n5. Testing callback...")
                response = requests.post(f"{BASE_URL}/instagram/auth/callback", json=callback_data)
                
                if response.status_code == 200:
                    data = response.json()
                    print("✅ OAuth flow successful!")
                    print(f"   Access token received: {data['access_token'][:20]}...")
                    print(f"   User: {data['user_profile']['username']}")
                    
                    # Test with the token
                    test_with_token(data['access_token'])
                else:
                    print(f"❌ OAuth callback failed: {response.status_code}")
                    print(f"   Response: {response.text}")
            else:
                print("Skipping OAuth test...")
        else:
            print(f"❌ Could not get auth URL: {response.status_code}")
    except Exception as e:
        print(f"❌ OAuth test error: {e}")

def test_with_token(access_token):
    """Test endpoints that require an access token"""
    print(f"\n🔑 Testing with access token...")
    
    # Test user profile
    try:
        data = {"access_token": access_token}
        response = requests.post(f"{BASE_URL}/instagram/user/profile", json=data)
        
        if response.status_code == 200:
            profile = response.json()['profile']
            print("✅ User profile retrieved!")
            print(f"   Username: {profile.get('username')}")
            print(f"   Media count: {profile.get('media_count')}")
        else:
            print(f"❌ Profile test failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Profile test error: {e}")
    
    # Test user media
    try:
        data = {"access_token": access_token}
        response = requests.post(f"{BASE_URL}/instagram/user/media?limit=3", json=data)
        
        if response.status_code == 200:
            media = response.json()['media']
            print(f"✅ User media retrieved! Found {len(media.get('data', []))} posts")
        else:
            print(f"❌ Media test failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Media test error: {e}")

if __name__ == "__main__":
    if test_instagram_api():
        test_oauth_flow()
