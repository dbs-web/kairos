from fastapi import APIRouter, Request, HTTPException, Query, Header
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
import os

from .InstagramClient import InstagramClient

router = APIRouter()

# Pydantic models for request validation
class AuthCallbackRequest(BaseModel):
    code: str
    state: Optional[str] = None

class WebhookData(BaseModel):
    object: str
    entry: list

class UserTokenRequest(BaseModel):
    access_token: str
    user_id: Optional[str] = None

@router.get("/auth/url")
async def get_auth_url(state: Optional[str] = Query(None)):
    """
    Get Instagram OAuth authorization URL
    """
    try:
        instagram_client = InstagramClient()
        auth_url = instagram_client.get_authorization_url(state)
        
        return JSONResponse(content={
            "auth_url": auth_url,
            "message": "Redirect user to this URL for Instagram authorization"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/auth/callback")
async def auth_callback_get(
    code: str = Query(..., description="Authorization code from Instagram"),
    state: Optional[str] = Query(None, description="State parameter for security")
):
    """
    Handle Instagram OAuth callback (GET request) and exchange code for tokens
    """
    try:
        instagram_client = InstagramClient()

        # Exchange code for access token
        token_response = instagram_client.exchange_code_for_token(code)
        access_token = token_response.get('access_token')
        user_id = token_response.get('user_id')

        if not access_token:
            raise HTTPException(
                status_code=400,
                detail="Failed to get access token from Instagram"
            )

        # For Instagram Business API, the token is already long-lived
        long_lived_response = instagram_client.get_long_lived_token(access_token)

        # Get user profile using the access token and user_id
        user_profile = instagram_client.get_user_profile(access_token, str(user_id) if user_id else None)

        return JSONResponse(content={
            "access_token": long_lived_response['access_token'],
            "token_type": long_lived_response.get('token_type', 'bearer'),
            "expires_in": long_lived_response.get('expires_in'),
            "user_profile": user_profile,
            "message": "Instagram authentication successful"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/callback")
async def auth_callback_post(request: AuthCallbackRequest):
    """
    Handle Instagram OAuth callback (POST request) and exchange code for tokens
    """
    try:
        instagram_client = InstagramClient()

        # Exchange code for access token
        token_response = instagram_client.exchange_code_for_token(request.code)
        access_token = token_response.get('access_token')
        user_id = token_response.get('user_id')

        if not access_token:
            raise HTTPException(
                status_code=400,
                detail="Failed to get access token from Instagram"
            )

        # For Instagram Business API, the token is already long-lived
        long_lived_response = instagram_client.get_long_lived_token(access_token)

        # Get user profile using the access token and user_id
        user_profile = instagram_client.get_user_profile(access_token, str(user_id) if user_id else None)

        return JSONResponse(content={
            "access_token": long_lived_response['access_token'],
            "token_type": long_lived_response.get('token_type', 'bearer'),
            "expires_in": long_lived_response.get('expires_in'),
            "user_profile": user_profile,
            "message": "Instagram authentication successful"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/webhook")
async def webhook_verify(
    hub_mode: str = Query(alias="hub.mode"),
    hub_challenge: str = Query(alias="hub.challenge"),
    hub_verify_token: str = Query(alias="hub.verify_token")
):
    """
    Verify Instagram webhook subscription
    This endpoint is called by Instagram to verify the webhook URL
    """
    try:
        instagram_client = InstagramClient()
        
        # Verify the token matches what we set in Instagram app settings
        if hub_verify_token != instagram_client.webhook_verify_token:
            raise HTTPException(status_code=403, detail="Invalid verify token")
        
        # Instagram expects the challenge to be returned as plain text
        if hub_mode == "subscribe":
            print(f"Instagram webhook verified successfully with challenge: {hub_challenge}")
            return PlainTextResponse(content=hub_challenge)
        
        raise HTTPException(status_code=400, detail="Invalid hub mode")
        
    except Exception as e:
        print(f"Webhook verification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def webhook_receive(
    request: Request,
    x_hub_signature_256: Optional[str] = Header(None, alias="X-Hub-Signature-256")
):
    """
    Receive Instagram webhook notifications
    This endpoint receives real-time updates from Instagram
    """
    try:
        # Get raw body for signature verification
        body = await request.body()
        body_str = body.decode('utf-8')
        
        instagram_client = InstagramClient()
        
        # Verify webhook signature if provided
        if x_hub_signature_256:
            if not instagram_client.verify_webhook_signature(body_str, x_hub_signature_256):
                raise HTTPException(status_code=403, detail="Invalid signature")
        
        # Parse webhook data
        try:
            webhook_data = json.loads(body_str)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")
        
        print(f"Received Instagram webhook: {webhook_data}")
        
        # Process webhook data
        if webhook_data.get('object') == 'instagram':
            for entry in webhook_data.get('entry', []):
                await process_instagram_entry(entry, instagram_client)
        
        # Instagram expects a 200 response to acknowledge receipt
        return JSONResponse(content={"status": "received"})
        
    except Exception as e:
        print(f"Webhook processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/user/profile")
async def get_user_profile(request: UserTokenRequest):
    """
    Get Instagram user profile information
    """
    try:
        instagram_client = InstagramClient()
        profile = instagram_client.get_user_profile(request.access_token, request.user_id)

        return JSONResponse(content={
            "profile": profile,
            "message": "Profile retrieved successfully"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/user/media")
async def get_user_media(request: UserTokenRequest, limit: int = Query(25, ge=1, le=100)):
    """
    Get Instagram user media posts
    """
    try:
        instagram_client = InstagramClient()
        media = instagram_client.get_user_media(request.access_token, limit)
        
        return JSONResponse(content={
            "media": media,
            "message": "Media retrieved successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/media/{media_id}/insights")
async def get_media_insights(media_id: str, request: UserTokenRequest):
    """
    Get insights for a specific Instagram media post
    """
    try:
        instagram_client = InstagramClient()
        insights = instagram_client.get_media_insights(media_id, request.access_token)
        
        return JSONResponse(content={
            "insights": insights,
            "message": "Insights retrieved successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/account/insights")
async def get_account_insights(
    request: UserTokenRequest,
    period: str = Query("day", regex="^(day|week|days_28)$"),
    since: Optional[str] = Query(None, regex="^\\d{4}-\\d{2}-\\d{2}$"),
    until: Optional[str] = Query(None, regex="^\\d{4}-\\d{2}-\\d{2}$")
):
    """
    Get Instagram Business account insights

    Query Parameters:
    - period: Time period ('day', 'week', 'days_28')
    - since: Start date (YYYY-MM-DD format, optional)
    - until: End date (YYYY-MM-DD format, optional)
    """
    try:
        instagram_client = InstagramClient()
        insights = instagram_client.get_account_insights(
            request.access_token,
            period,
            since,
            until
        )

        return JSONResponse(content={
            "insights": insights,
            "period": period,
            "message": "Account insights retrieved successfully"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/audience/insights")
async def get_audience_insights(
    request: UserTokenRequest,
    period: str = Query("lifetime", regex="^(lifetime|day|week|days_28)$")
):
    """
    Get Instagram Business audience insights

    Query Parameters:
    - period: Time period ('lifetime', 'day', 'week', 'days_28')
    """
    try:
        instagram_client = InstagramClient()
        insights = instagram_client.get_audience_insights(request.access_token, period)

        return JSONResponse(content={
            "insights": insights,
            "period": period,
            "message": "Audience insights retrieved successfully"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test")
async def test_instagram_api():
    """
    Test endpoint to verify Instagram API integration is working
    """
    try:
        instagram_client = InstagramClient()
        
        return JSONResponse(content={
            "status": "ok",
            "message": "Instagram API integration is working",
            "app_id": instagram_client.app_id,
            "redirect_uri": instagram_client.redirect_uri,
            "webhook_configured": bool(instagram_client.webhook_verify_token)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_instagram_entry(entry: Dict[str, Any], instagram_client: InstagramClient):
    """
    Process a single Instagram webhook entry
    
    Args:
        entry: Instagram webhook entry data
        instagram_client: Instagram client instance
    """
    try:
        user_id = entry.get('id')
        changes = entry.get('changes', [])
        
        for change in changes:
            field = change.get('field')
            value = change.get('value')
            
            print(f"Processing Instagram change: field={field}, user_id={user_id}")
            
            # Process different types of changes
            if field == 'media':
                process_media_change(user_id, value, instagram_client)
            elif field == 'comments':
                process_comments_change(user_id, value, instagram_client)
            elif field == 'mentions':
                process_mentions_change(user_id, value, instagram_client)
            
    except Exception as e:
        print(f"Error processing Instagram entry: {e}")

def process_media_change(user_id: str, value: Dict[str, Any], instagram_client: InstagramClient):
    """Process media-related webhook changes"""
    try:
        media_id = value.get('media_id')

        # Prepare data for Kairos callback
        callback_data = {
            "type": "instagram_media",
            "user_id": user_id,
            "media_id": media_id,
            "change_value": value,
            "timestamp": value.get('time')
        }

        # Send to Kairos callback
        instagram_client.send_to_kairos_callback(callback_data)

    except Exception as e:
        print(f"Error processing media change: {e}")

def process_comments_change(user_id: str, value: Dict[str, Any], instagram_client: InstagramClient):
    """Process comments-related webhook changes"""
    try:
        # Prepare data for Kairos callback
        callback_data = {
            "type": "instagram_comments",
            "user_id": user_id,
            "change_value": value,
            "timestamp": value.get('time')
        }

        # Send to Kairos callback
        instagram_client.send_to_kairos_callback(callback_data)

    except Exception as e:
        print(f"Error processing comments change: {e}")

def process_mentions_change(user_id: str, value: Dict[str, Any], instagram_client: InstagramClient):
    """Process mentions-related webhook changes"""
    try:
        # Prepare data for Kairos callback
        callback_data = {
            "type": "instagram_mentions",
            "user_id": user_id,
            "change_value": value,
            "timestamp": value.get('time')
        }

        # Send to Kairos callback
        instagram_client.send_to_kairos_callback(callback_data)

    except Exception as e:
        print(f"Error processing mentions change: {e}")
