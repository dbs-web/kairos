# Instagram API Integration

This module provides Instagram Basic Display API and Instagram Graph API integration for the Kairos application.

## Features

- Instagram OAuth authentication
- User profile and media retrieval
- Media insights and analytics
- Real-time webhook notifications
- Secure signature verification

## Environment Variables

Add these variables to your `.env` file:

```env
# Instagram App Configuration
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://api.dbsweb.com.br/instagram/auth/callback
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Existing Kairos Configuration (already configured)
CONTENT_CALLBACK_URL=https://kairos.dbsweb.com.br/api/briefings/callback
API_SECRET=your_api_secret
```

## Instagram App Configuration

### 1. Meta Developer Dashboard Setup

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or use existing "Kairos_Insights" app
3. Add Instagram Basic Display product

### 2. Instagram Basic Display Settings

**OAuth Redirect URIs:**
```
https://api.dbsweb.com.br/instagram/auth/callback
```

**Deauthorize Callback URL:**
```
https://api.dbsweb.com.br/instagram/auth/deauthorize
```

**Data Deletion Request URL:**
```
https://api.dbsweb.com.br/instagram/auth/data-deletion
```

### 3. Webhook Configuration

**Webhook URL:**
```
https://api.dbsweb.com.br/instagram/webhook
```

**Verify Token:**
Use the same value as `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` in your environment variables.

**Subscribed Fields:**
- media
- comments
- mentions

## API Endpoints

### Authentication

#### GET `/instagram/auth/url`
Get Instagram OAuth authorization URL.

**Query Parameters:**
- `state` (optional): State parameter for security

**Response:**
```json
{
  "auth_url": "https://api.instagram.com/oauth/authorize?...",
  "message": "Redirect user to this URL for Instagram authorization"
}
```

#### POST `/instagram/auth/callback`
Handle OAuth callback and exchange code for tokens.

**Request Body:**
```json
{
  "code": "authorization_code_from_instagram",
  "state": "optional_state_parameter"
}
```

**Response:**
```json
{
  "access_token": "long_lived_access_token",
  "token_type": "bearer",
  "expires_in": 5183944,
  "user_profile": {
    "id": "user_id",
    "username": "username",
    "account_type": "PERSONAL",
    "media_count": 42
  },
  "message": "Instagram authentication successful"
}
```

### User Data

#### POST `/instagram/user/profile`
Get user profile information.

**Request Body:**
```json
{
  "access_token": "user_access_token",
  "user_id": "optional_user_id"
}
```

#### POST `/instagram/user/media`
Get user media posts.

**Query Parameters:**
- `limit` (optional): Number of posts to retrieve (1-100, default: 25)

**Request Body:**
```json
{
  "access_token": "user_access_token"
}
```

#### POST `/instagram/media/{media_id}/insights`
Get insights for a specific media post.

**Request Body:**
```json
{
  "access_token": "user_access_token"
}
```

### Webhooks

#### GET `/instagram/webhook`
Webhook verification endpoint (called by Instagram).

#### POST `/instagram/webhook`
Webhook notification receiver (called by Instagram).

### Testing

#### GET `/instagram/test`
Test endpoint to verify configuration.

## Usage Examples

### 1. User Authentication Flow

```python
# 1. Get authorization URL
response = requests.get("https://api.dbsweb.com.br/instagram/auth/url?state=user123")
auth_url = response.json()["auth_url"]

# 2. Redirect user to auth_url
# 3. User authorizes and is redirected back with code

# 4. Exchange code for token
callback_data = {
    "code": "received_authorization_code",
    "state": "user123"
}
response = requests.post("https://api.dbsweb.com.br/instagram/auth/callback", json=callback_data)
token_data = response.json()
access_token = token_data["access_token"]
```

### 2. Get User Media

```python
media_request = {
    "access_token": "user_access_token"
}
response = requests.post("https://api.dbsweb.com.br/instagram/user/media?limit=10", json=media_request)
media_data = response.json()
```

### 3. Get Media Insights

```python
insights_request = {
    "access_token": "user_access_token"
}
response = requests.post("https://api.dbsweb.com.br/instagram/media/MEDIA_ID/insights", json=insights_request)
insights_data = response.json()
```

## Webhook Events

The webhook endpoint receives real-time notifications for:

- **Media**: New posts, updates to existing posts
- **Comments**: New comments on user's posts
- **Mentions**: When user is mentioned in other posts

All webhook events are automatically forwarded to the Kairos callback endpoint for processing.

## Security

- Webhook signatures are verified using HMAC-SHA256
- All API endpoints use HTTPS
- Access tokens are handled securely
- Environment variables protect sensitive credentials

## Testing

Use the test endpoint to verify your configuration:

```bash
curl https://api.dbsweb.com.br/instagram/test
```

Expected response:
```json
{
  "status": "ok",
  "message": "Instagram API integration is working",
  "app_id": "your_app_id",
  "redirect_uri": "https://api.dbsweb.com.br/instagram/auth/callback",
  "webhook_configured": true
}
```

## Troubleshooting

### Common Issues

1. **Webhook verification fails**
   - Check that `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` matches the token in Meta Developer Dashboard
   - Ensure webhook URL is accessible and returns 200 status

2. **OAuth callback fails**
   - Verify redirect URI matches exactly in Meta Developer Dashboard
   - Check that all required environment variables are set

3. **API requests fail**
   - Ensure access token is valid and not expired
   - Check that required permissions are granted

### Debug Mode

Enable debug logging by setting environment variable:
```env
DEBUG=true
```

This will print detailed information about webhook events and API calls to the console.
