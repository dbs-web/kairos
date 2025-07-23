import os
from fastapi import FastAPI
from dotenv import load_dotenv

# Routes
from heygen.routes import router as heygen_router
from n8n.routes import router as n8n_router
from news.routes import router as news_router
from videos.routes import router as videos_router
from heygen.HeyGen import HeyGenClient

# Load .env
load_dotenv()

app = FastAPI()

heygen_client = HeyGenClient()

app.include_router(videos_router, prefix="/video", tags=["videos"])
app.include_router(heygen_router)
app.include_router(n8n_router)
app.include_router(news_router)
