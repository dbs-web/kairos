import os
import requests
from typing import Dict, Any, Optional
from fastapi import HTTPException


class InstagramClient:
    """
    A client for interacting with Instagram Basic Display API and Instagram Graph API
    """

    def __init__(self):
        """
        Initializes the InstagramClient by reading credentials from environment variables.
        """
        self.app_id = os.getenv('INSTAGRAM_APP_ID')
        self.app_secret = os.getenv('INSTAGRAM_APP_SECRET')
        self.redirect_uri = os.getenv('INSTAGRAM_REDIRECT_URI')
        self.webhook_verify_token = os.getenv('INSTAGRAM_WEBHOOK_VERIFY_TOKEN')
        
        if not all([self.app_id, self.app_secret, self.redirect_uri]):
            raise ValueError("Instagram credentials must be set in environment variables")

        # Instagram Graph API endpoints (Business/Creator accounts)
        self.graph_url = "https://graph.instagram.com"
        self.facebook_graph_url = "https://graph.facebook.com/v18.0"
        # Use Instagram OAuth for Instagram Business API
        self.auth_url = "https://www.instagram.com/oauth/authorize"
        # Use Instagram API for token exchange
        self.token_url = "https://api.instagram.com/oauth/access_token"
        
        # Kairos callback configuration
        self.kairos_callback_url = os.getenv("CONTENT_CALLBACK_URL")
        self.api_secret = os.getenv("API_SECRET")

    def get_authorization_url(self, state: Optional[str] = None) -> str:
        """
        Generate Instagram Business OAuth authorization URL

        Args:
            state: Optional state parameter for security

        Returns:
            Authorization URL for Instagram Business OAuth
        """
        params = {
            'client_id': self.app_id,
            'redirect_uri': self.redirect_uri,
            'scope': 'instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights',
            'response_type': 'code'
        }

        if state:
            params['state'] = state

        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        return f"{self.auth_url}?{query_string}"

    def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """
        Exchange authorization code for access token

        Args:
            code: Authorization code from Instagram OAuth callback

        Returns:
            Token response from Instagram API
        """
        data = {
            'client_id': self.app_id,
            'client_secret': self.app_secret,
            'grant_type': 'authorization_code',
            'redirect_uri': self.redirect_uri,
            'code': code
        }

        response = requests.post(self.token_url, data=data)

        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to exchange code for token: {response.text}"
            )

        token_data = response.json()
        print(f"Token exchange response: {token_data}")  # Debug log
        return token_data

    def get_long_lived_token(self, short_lived_token: str) -> Dict[str, Any]:
        """
        For Instagram Business API, the token from OAuth is already long-lived.
        This method just returns the token as-is with proper formatting.

        Args:
            short_lived_token: Access token from Instagram Business OAuth

        Returns:
            Token response formatted for consistency
        """
        # Instagram Business API tokens are already long-lived (60 days)
        # No need for token exchange like in Basic Display API
        return {
            'access_token': short_lived_token,
            'token_type': 'bearer',
            'expires_in': 5183944  # 60 days in seconds
        }

    def get_user_profile(self, access_token: str, user_id: str = None) -> Dict[str, Any]:
        """
        Get Instagram Business account profile information

        Args:
            access_token: Instagram Business access token
            user_id: Instagram user ID (if available from token response)

        Returns:
            User profile data
        """
        try:
            # If we have a user_id, use it directly
            if user_id:
                url = f"{self.graph_url}/{user_id}"
                params = {
                    'fields': 'id,username,account_type,media_count',
                    'access_token': access_token
                }

                response = requests.get(url, params=params)
                print(f"Instagram API response for user {user_id}: {response.text}")

                if response.status_code == 200:
                    return response.json()

            # Try to get user info directly from Instagram Graph API (fallback)
            url = f"{self.graph_url}/me"
            params = {
                'fields': 'id,username,account_type,media_count',
                'access_token': access_token
            }

            response = requests.get(url, params=params)
            print(f"Direct Instagram API failed: {response.text}")

            # Try to get user ID from token introspection or debug
            debug_url = f"{self.facebook_graph_url}/debug_token"
            debug_params = {
                'input_token': access_token,
                'access_token': access_token
            }

            debug_response = requests.get(debug_url, params=debug_params)

            if debug_response.status_code == 200:
                debug_data = debug_response.json()
                print(f"Token debug info: {debug_data}")

                # Extract user ID from debug info
                token_data = debug_data.get('data', {})
                extracted_user_id = token_data.get('user_id')

                if extracted_user_id:
                    # Try to get profile with specific user ID
                    profile_url = f"{self.graph_url}/{extracted_user_id}"
                    profile_params = {
                        'fields': 'id,username,account_type,media_count',
                        'access_token': access_token
                    }

                    profile_response = requests.get(profile_url, params=profile_params)
                    print(f"Profile response for extracted user {extracted_user_id}: {profile_response.text}")

                    if profile_response.status_code == 200:
                        return profile_response.json()

            # Final fallback - return minimal info
            return {
                'id': user_id or 'unknown',
                'username': 'instagram_user',
                'account_type': 'BUSINESS',
                'media_count': 0,
                'note': 'Limited profile info available'
            }

        except Exception as e:
            print(f"Error in get_user_profile: {str(e)}")
            # Return minimal info instead of failing
            return {
                'id': user_id or 'unknown',
                'username': 'instagram_user',
                'account_type': 'BUSINESS',
                'media_count': 0,
                'error': str(e)
            }

    def get_user_media(self, access_token: str, limit: int = 25, user_id: str = None) -> Dict[str, Any]:
        """
        Get user's media posts

        Args:
            access_token: Instagram access token
            limit: Number of media items to retrieve
            user_id: Instagram user ID (optional)

        Returns:
            User media data
        """
        try:
            # Try with specific user ID first if provided
            if user_id:
                url = f"{self.graph_url}/{user_id}/media"
                params = {
                    'fields': 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
                    'limit': limit,
                    'access_token': access_token
                }

                response = requests.get(url, params=params)
                print(f"Instagram media API response for user {user_id}: {response.status_code} - {response.text}")

                if response.status_code == 200:
                    return response.json()

            # Fallback to /me/media endpoint
            url = f"{self.graph_url}/me/media"
            params = {
                'fields': 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
                'limit': limit,
                'access_token': access_token
            }

            response = requests.get(url, params=params)
            print(f"Instagram media API fallback response: {response.status_code} - {response.text}")

            if response.status_code != 200:
                # Return empty media list instead of failing
                print(f"Failed to get user media: {response.text}")
                return {
                    'data': [],
                    'paging': {},
                    'note': 'No media available or access restricted'
                }

            return response.json()

        except Exception as e:
            print(f"Error in get_user_media: {str(e)}")
            # Return empty media list instead of failing
            return {
                'data': [],
                'paging': {},
                'error': str(e)
            }

    def get_media_insights(self, media_id: str, access_token: str) -> Dict[str, Any]:
        """
        Get insights for a specific media post

        Args:
            media_id: Instagram media ID
            access_token: Instagram access token

        Returns:
            Media insights data
        """
        url = f"{self.graph_url}/{media_id}/insights"
        params = {
            'metric': 'impressions,reach,likes,comments,shares,saves',
            'access_token': access_token
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to get media insights: {response.text}"
            )

        return response.json()

    def get_account_insights(self, access_token: str, period: str = "day", since: str = None, until: str = None, user_id: str = None) -> Dict[str, Any]:
        """
        Get Instagram Business account insights

        Args:
            access_token: Instagram Business access token
            period: Time period for insights ('day', 'week', 'days_28')
            since: Start date (YYYY-MM-DD format)
            until: End date (YYYY-MM-DD format)
            user_id: Instagram user ID (optional)

        Returns:
            Account insights data
        """
        # Try with specific user ID first if provided
        if user_id:
            url = f"{self.graph_url}/{user_id}/insights"
        else:
            url = f"{self.graph_url}/me/insights"

        # Available account metrics (updated based on Instagram API response)
        metrics = [
            'reach',
            'follower_count',
            'website_clicks',
            'profile_views',
            'accounts_engaged',
            'total_interactions',
            'likes',
            'comments',
            'shares',
            'saves'
        ]

        params = {
            'metric': ','.join(metrics),
            'period': period,
            'access_token': access_token
        }

        # Add date range if provided
        if since:
            params['since'] = since
        if until:
            params['until'] = until

        response = requests.get(url, params=params)

        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to get account insights: {response.text}"
            )

        return response.json()

    def get_audience_insights(self, access_token: str, period: str = "lifetime", user_id: str = None) -> Dict[str, Any]:
        """
        Get Instagram Business audience insights

        Args:
            access_token: Instagram Business access token
            period: Time period for insights ('lifetime', 'day', 'week', 'days_28')
            user_id: Instagram user ID (optional)

        Returns:
            Audience insights data
        """
        # Try with specific user ID first if provided
        if user_id:
            url = f"{self.graph_url}/{user_id}/insights"
        else:
            url = f"{self.graph_url}/me/insights"

        # Audience demographic metrics (updated based on Instagram API response)
        metrics = [
            'engaged_audience_demographics',
            'reached_audience_demographics',
            'follower_demographics'
        ]

        params = {
            'metric': ','.join(metrics),
            'period': period,
            'access_token': access_token
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to get audience insights: {response.text}"
            )

        return response.json()

    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """
        Verify Instagram webhook signature
        
        Args:
            payload: Raw webhook payload
            signature: X-Hub-Signature-256 header value
            
        Returns:
            True if signature is valid, False otherwise
        """
        import hmac
        import hashlib
        
        if not self.app_secret:
            return False
            
        expected_signature = hmac.new(
            self.app_secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        # Remove 'sha256=' prefix if present
        if signature.startswith('sha256='):
            signature = signature[7:]
            
        return hmac.compare_digest(expected_signature, signature)

    def send_to_kairos_callback(self, data: Dict[str, Any]) -> bool:
        """
        Send Instagram data to Kairos callback endpoint

        Args:
            data: Instagram data to send

        Returns:
            True if successful, False otherwise
        """
        if not self.kairos_callback_url or not self.api_secret:
            print("Kairos callback URL or API secret not configured")
            return False

        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_secret,
        }

        try:
            response = requests.post(
                self.kairos_callback_url,
                headers=headers,
                json=data,
                timeout=30
            )

            return response.status_code == 200
        except Exception as e:
            print(f"Error sending to Kairos callback: {e}")
            return False
