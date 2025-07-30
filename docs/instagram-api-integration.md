# Instagram Business API Integration - Complete Documentation

## 🎯 Overview

The Kairos Instagram API integration provides comprehensive access to Instagram Business data through a robust, production-ready API. This integration enables real-time data collection, analytics, and automated content management for Instagram Business accounts.

## 🏗️ Architecture

### Core Components
- **InstagramClient**: Main client class handling all Instagram API interactions
- **OAuth Flow**: Secure authentication with Instagram Business API
- **Webhook System**: Real-time notifications for comments, messages, and media changes
- **Insights Engine**: Comprehensive analytics for posts, accounts, and audiences
- **Kairos Integration**: Seamless data forwarding to Kairos callback system

### Technology Stack
- **Backend**: FastAPI (Python)
- **Authentication**: Instagram Business OAuth 2.0
- **API Version**: Instagram Graph API v18.0
- **Security**: HMAC-SHA256 webhook signature verification
- **Database**: MySQL (via Kairos integration)

## 🔐 Authentication & Setup

### Environment Variables
```env
# Instagram App Configuration
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://api.dbsweb.com.br/instagram/auth/callback
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Kairos Integration
CONTENT_CALLBACK_URL=https://kairos.dbsweb.com.br/api/briefings/callback
API_SECRET=your_api_secret
```

### OAuth Scopes
- `instagram_business_basic` - Basic profile access
- `instagram_business_manage_messages` - Message management
- `instagram_business_manage_comments` - Comment management
- `instagram_business_content_publish` - Content publishing
- `instagram_business_manage_insights` - Analytics access

### Meta Developer Configuration
1. **App Type**: Business
2. **Products**: Instagram Basic Display + Instagram Graph API
3. **Webhook URL**: `https://api.dbsweb.com.br/instagram/webhook`
4. **Redirect URI**: `https://api.dbsweb.com.br/instagram/auth/callback`

## 📡 API Endpoints

### Authentication Endpoints

#### GET `/instagram/auth/url`
Generate Instagram OAuth authorization URL.

**Query Parameters:**
- `state` (optional): Security state parameter

**Response:**
```json
{
  "auth_url": "https://api.instagram.com/oauth/authorize?...",
  "message": "Redirect user to this URL for Instagram authorization"
}
```

#### POST `/instagram/auth/callback`
Handle OAuth callback and exchange code for access token.

**Request:**
```json
{
  "code": "authorization_code_from_instagram",
  "state": "optional_state_parameter"
}
```

**Response:**
```json
{
  "access_token": "IGAAdNMXnAIY5BZAE5...",
  "token_type": "bearer",
  "expires_in": 5183944,
  "user_profile": {
    "id": "23945278568488807",
    "username": "business_account",
    "account_type": "BUSINESS",
    "media_count": 42
  },
  "message": "Instagram authentication successful"
}
```

### User Data Endpoints

#### POST `/instagram/user/profile`
Get Instagram Business account profile information.

**Request:**
```json
{
  "access_token": "user_access_token",
  "user_id": "optional_user_id"
}
```

**Response:**
```json
{
  "profile": {
    "id": "23945278568488807",
    "username": "business_account",
    "account_type": "BUSINESS",
    "media_count": 156
  },
  "message": "Profile retrieved successfully"
}
```

#### POST `/instagram/user/media`
Get user's Instagram media posts.

**Query Parameters:**
- `limit` (optional): Number of posts (1-100, default: 25)

**Request:**
```json
{
  "access_token": "user_access_token"
}
```

**Response:**
```json
{
  "media": {
    "data": [
      {
        "id": "17895695668004550",
        "caption": "Amazing sunset! #photography",
        "media_type": "IMAGE",
        "media_url": "https://scontent.cdninstagram.com/...",
        "permalink": "https://www.instagram.com/p/ABC123/",
        "timestamp": "2024-01-15T10:30:00+0000"
      }
    ],
    "paging": {
      "cursors": {
        "before": "QVFIUmx1WTBpMGpP",
        "after": "QVFIUjNEaVhBNzNP"
      }
    }
  },
  "message": "Media retrieved successfully"
}
```

### Analytics Endpoints

#### POST `/instagram/media/{media_id}/insights`
Get insights for a specific Instagram media post.

**Request:**
```json
{
  "access_token": "user_access_token"
}
```

**Available Metrics:**
- `impressions` - Total number of times media was displayed
- `reach` - Number of unique accounts that saw the media
- `likes` - Number of likes
- `comments` - Number of comments
- `shares` - Number of shares
- `saves` - Number of saves

**Response:**
```json
{
  "insights": {
    "data": [
      {
        "name": "impressions",
        "period": "lifetime",
        "values": [{"value": 1250}],
        "title": "Impressions",
        "description": "Total number of times the media object has been seen"
      },
      {
        "name": "reach",
        "period": "lifetime", 
        "values": [{"value": 987}],
        "title": "Reach",
        "description": "Total number of unique accounts that have seen the media object"
      }
    ]
  },
  "message": "Insights retrieved successfully"
}
```

#### POST `/instagram/account/insights`
Get Instagram Business account-level insights.

**Query Parameters:**
- `period`: Time period (`day`, `week`, `days_28`)
- `since` (optional): Start date (YYYY-MM-DD)
- `until` (optional): End date (YYYY-MM-DD)

**Request:**
```json
{
  "access_token": "user_access_token"
}
```

**Available Metrics:**
- `reach` - Unique accounts reached
- `follower_count` - Total followers
- `website_clicks` - Website link clicks
- `profile_views` - Profile page views
- `accounts_engaged` - Accounts that engaged with content
- `total_interactions` - Total interactions (likes, comments, shares)
- `likes`, `comments`, `shares`, `saves` - Individual engagement metrics

**Response:**
```json
{
  "insights": {
    "data": [
      {
        "name": "reach",
        "period": "day",
        "values": [
          {"value": 1250, "end_time": "2024-01-15T07:00:00+0000"},
          {"value": 1180, "end_time": "2024-01-16T07:00:00+0000"}
        ],
        "title": "Reach",
        "description": "Total number of unique accounts reached"
      }
    ]
  },
  "period": "day",
  "message": "Account insights retrieved successfully"
}
```

#### POST `/instagram/audience/insights`
Get Instagram Business audience demographics.

**Query Parameters:**
- `period`: Time period (`lifetime`, `day`, `week`, `days_28`)

**Request:**
```json
{
  "access_token": "user_access_token"
}
```

**Available Metrics:**
- `engaged_audience_demographics` - Demographics of users who engaged
- `reached_audience_demographics` - Demographics of users reached
- `follower_demographics` - Follower demographics breakdown

**Response:**
```json
{
  "insights": {
    "data": [
      {
        "name": "follower_demographics",
        "period": "lifetime",
        "values": [
          {
            "value": {
              "age": {
                "13-17": 5,
                "18-24": 35,
                "25-34": 40,
                "35-44": 15,
                "45-54": 5
              },
              "gender": {
                "M": 45,
                "F": 55
              },
              "country": {
                "BR": 70,
                "US": 15,
                "AR": 10,
                "MX": 5
              }
            }
          }
        ]
      }
    ]
  },
  "message": "Audience insights retrieved successfully"
}
```

## 🔔 Webhook System

### Webhook Configuration
- **URL**: `https://api.dbsweb.com.br/instagram/webhook`
- **Method**: POST
- **Verification**: HMAC-SHA256 signature
- **Subscribed Events**: comments, messages, media changes

### Webhook Events

#### Comment Events
Triggered when users comment on your posts.

```json
{
  "object": "instagram",
  "entry": [
    {
      "id": "instagram_business_account_id",
      "time": 1234567890,
      "changes": [
        {
          "field": "comments",
          "value": {
            "from": {
              "id": "user_id",
              "username": "commenter_username"
            },
            "media": {
              "id": "media_id",
              "media_product_type": "FEED"
            },
            "id": "comment_id",
            "text": "Great post! 👍",
            "parent_id": "parent_comment_id"
          }
        }
      ]
    }
  ]
}
```

#### Message Events
Triggered when users send direct messages.

```json
{
  "object": "instagram", 
  "entry": [
    {
      "id": "instagram_business_account_id",
      "time": 1234567890,
      "messaging": [
        {
          "sender": {"id": "user_id"},
          "recipient": {"id": "page_id"},
          "timestamp": 1234567890,
          "message": {
            "mid": "message_id",
            "text": "Hello! I have a question about your product."
          }
        }
      ]
    }
  ]
}
```

### Kairos Integration
All webhook events are automatically forwarded to the Kairos callback endpoint:
- **URL**: `https://kairos.dbsweb.com.br/api/briefings/callback`
- **Headers**: `x-api-key: your_api_secret`
- **Format**: Structured JSON with event metadata

## 🎯 Use Cases & Examples

### 1. Social Media Dashboard
Monitor Instagram performance with real-time analytics.

```python
# Get account performance for last 7 days
import requests
from datetime import datetime, timedelta

end_date = datetime.now()
start_date = end_date - timedelta(days=7)

response = requests.post(
    "https://api.dbsweb.com.br/instagram/account/insights",
    params={
        "period": "day",
        "since": start_date.strftime("%Y-%m-%d"),
        "until": end_date.strftime("%Y-%m-%d")
    },
    json={"access_token": "your_token"}
)

insights = response.json()["insights"]["data"]
for metric in insights:
    print(f"{metric['title']}: {metric['values']}")
```

### 2. Content Performance Analysis
Analyze which posts perform best.

```python
# Get all recent posts and their insights
media_response = requests.post(
    "https://api.dbsweb.com.br/instagram/user/media",
    params={"limit": 50},
    json={"access_token": "your_token"}
)

posts = media_response.json()["media"]["data"]
performance_data = []

for post in posts:
    insights_response = requests.post(
        f"https://api.dbsweb.com.br/instagram/media/{post['id']}/insights",
        json={"access_token": "your_token"}
    )
    
    insights = insights_response.json()["insights"]["data"]
    performance_data.append({
        "post_id": post["id"],
        "caption": post["caption"][:50] + "...",
        "impressions": next(i["values"][0]["value"] for i in insights if i["name"] == "impressions"),
        "reach": next(i["values"][0]["value"] for i in insights if i["name"] == "reach"),
        "engagement": next(i["values"][0]["value"] for i in insights if i["name"] == "likes")
    })

# Sort by engagement
top_posts = sorted(performance_data, key=lambda x: x["engagement"], reverse=True)
print("Top performing posts:")
for post in top_posts[:5]:
    print(f"- {post['caption']}: {post['engagement']} likes, {post['reach']} reach")
```

### 3. Automated Comment Monitoring
Respond to comments automatically via webhooks.

```python
# Webhook handler example (FastAPI)
from fastapi import FastAPI, Request
import hmac
import hashlib

app = FastAPI()

@app.post("/instagram/webhook")
async def handle_instagram_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get("X-Hub-Signature-256")
    
    # Verify signature
    if verify_signature(payload, signature):
        data = await request.json()
        
        for entry in data.get("entry", []):
            for change in entry.get("changes", []):
                if change["field"] == "comments":
                    comment_data = change["value"]
                    
                    # Process comment
                    await process_comment(
                        comment_id=comment_data["id"],
                        text=comment_data["text"],
                        user_id=comment_data["from"]["id"],
                        media_id=comment_data["media"]["id"]
                    )
    
    return {"status": "ok"}

async def process_comment(comment_id, text, user_id, media_id):
    # Custom logic: sentiment analysis, auto-reply, etc.
    if "question" in text.lower():
        # Flag for manual review
        await flag_for_review(comment_id, text)
    elif "complaint" in text.lower():
        # Escalate to customer service
        await escalate_to_support(comment_id, user_id)
```

### 4. Audience Analysis
Understand your audience demographics.

```python
# Get comprehensive audience insights
audience_response = requests.post(
    "https://api.dbsweb.com.br/instagram/audience/insights",
    params={"period": "lifetime"},
    json={"access_token": "your_token"}
)

audience_data = audience_response.json()["insights"]["data"]

for metric in audience_data:
    if metric["name"] == "follower_demographics":
        demographics = metric["values"][0]["value"]
        
        print("Age Distribution:")
        for age_range, percentage in demographics["age"].items():
            print(f"  {age_range}: {percentage}%")
        
        print("\nGender Distribution:")
        for gender, percentage in demographics["gender"].items():
            print(f"  {gender}: {percentage}%")
        
        print("\nTop Countries:")
        for country, percentage in demographics["country"].items():
            print(f"  {country}: {percentage}%")
```

## 🔧 Technical Implementation

### Error Handling
All endpoints include comprehensive error handling:

```python
try:
    response = requests.post(endpoint, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        # Handle API errors
        error_detail = response.json().get("detail", "Unknown error")
        print(f"API Error: {error_detail}")
except requests.exceptions.RequestException as e:
    print(f"Network Error: {e}")
```

### Rate Limiting
Instagram API has rate limits:
- **200 calls per hour** per access token
- **4800 calls per hour** per app
- Implement exponential backoff for rate limit handling

### Token Management
- **Access tokens expire after 60 days**
- Implement token refresh logic
- Store tokens securely in database
- Monitor token expiration

### Security Best Practices
- **Webhook signature verification** prevents unauthorized requests
- **HTTPS only** for all communications
- **Environment variables** for sensitive credentials
- **Input validation** on all endpoints
- **Rate limiting** to prevent abuse

## 🚀 Production Deployment

### Server Requirements
- **Python 3.8+** with FastAPI
- **SSL Certificate** for HTTPS
- **Reverse Proxy** (Nginx recommended)
- **Process Manager** (systemd, PM2, or similar)

### Monitoring & Logging
- **Application logs** for debugging
- **API response monitoring** for performance
- **Webhook delivery tracking** for reliability
- **Error alerting** for critical issues

### Scaling Considerations
- **Database connection pooling** for high traffic
- **Async processing** for webhook handling
- **Caching** for frequently accessed data
- **Load balancing** for multiple instances

## 📊 Data Flow Architecture

```
Instagram Business Account
         ↓
Instagram Graph API (v18.0)
         ↓
Kairos Instagram API Server
         ↓
Kairos Application Database
         ↓
Kairos Frontend Dashboard
```

### Real-time Data Flow
1. **User Action** (comment, like, follow) on Instagram
2. **Instagram Webhook** sends notification to API server
3. **Signature Verification** ensures authenticity
4. **Data Processing** extracts relevant information
5. **Kairos Callback** forwards data to main application
6. **Database Storage** persists data for analysis
7. **Real-time Updates** push to frontend dashboard

## 🎯 Future Enhancements

### Planned Features
- **Story Insights** - Analytics for Instagram Stories
- **Reels Analytics** - Performance metrics for Reels
- **Competitor Analysis** - Benchmarking against similar accounts
- **Automated Reporting** - Scheduled analytics reports
- **AI Content Suggestions** - ML-powered content recommendations

### Integration Opportunities
- **CRM Systems** - Customer relationship management
- **Email Marketing** - Audience segmentation and targeting
- **E-commerce** - Product catalog integration
- **Analytics Platforms** - Google Analytics, Adobe Analytics
- **Social Media Management** - Hootsuite, Buffer integration

This comprehensive Instagram Business API integration provides a solid foundation for social media analytics, automated engagement, and data-driven content strategy within the Kairos ecosystem.
