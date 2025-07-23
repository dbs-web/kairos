from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
import requests

from .HeyGen import HeyGenClient

class HeyGenRequest(BaseModel):
    avatar_id: str
    text: str
    voice_id: str
    callback_url: HttpUrl
    width: int
    height: int

router = APIRouter()

@router.post("/generate-heygen-video")
async def generate_heygen_video(request: HeyGenRequest):
    """
    Endpoint to generate a video using HeyGen API.
    """
    try:
        heygen_client = HeyGenClient()
        response = heygen_client.generate_video(
            avatar_id=request.avatar_id,
            text=request.text,
            voice_id=request.voice_id,
            callback_url=str(request.callback_url),
            width=request.width,
            height=request.height
        )
        return response
    except requests.HTTPError as http_err:
        raise HTTPException(status_code=400, detail=str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
