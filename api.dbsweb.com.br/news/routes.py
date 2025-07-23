from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from .Scrapper import Scrapper

router = APIRouter()

@router.post("/news")
async def news(request: Request):
    try:
        body = await request.json()
        url = body.get('url')
        s = Scrapper()
        result = s.scrape(url)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))