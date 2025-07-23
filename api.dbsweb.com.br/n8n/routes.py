import asyncio
import os
import httpx
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from .N8n import N8nClient

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(request: Request):
    try:
        body = await request.json()
        token = body.get("token")
        message = body.get("message")
        briefing_id = body.get("briefingId")
        args = body.get("args", {})  # Extrai os argumentos custom

        if not all([token, message]):
            raise HTTPException(
                status_code=400, 
                detail="Os campos obrigatórios são: token, message, briefingId"
            )

        n8n_client = N8nClient(token=token)

        if briefing_id:
            asyncio.create_task(
                n8n_client.send_message_and_wait_for_callback(message, briefing_id, args)
            )
        else:
            asyncio.create_task(
                n8n_client.send_message_without_callback(message, args)
            )

        return JSONResponse(content={"status": "success"}, media_type="application/json")
    except Exception as e:
        with open('error.log', 'a') as f:
            f.write(str(e) + "\n")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat-agent")
async def chat_agent(request: Request):
    try:
        body = await request.json()
        token = body.get("token")
        message = body.get("message")

        if not all([token, message]):
            raise HTTPException(status_code=400, detail="Os campos obrigatórios são: token e message")

        n8n_client = N8nClient(token=token)
        # Chama a função de chat_agent que trata o streaming e retorna a mensagem final
        final_message = await n8n_client.chat_agent(message)
        return JSONResponse(content={"message": final_message}, media_type="application/json")
    except Exception as e:
        with open('error.log', 'a') as f:
            f.write(str(e) + "\n")
        raise HTTPException(status_code=500, detail=str(e))
        
@router.post("/check")
async def check_content(request: Request):
    try:
        body = await request.json()
        message = body.get("message")
        print(f"Message: {message}")
        security_bot_token = os.getenv("CONTENT_SECURITY_BOT_TOKEN")
        if not message:
            raise HTTPException(status_code=400, detail="O campo message é obrigatório")
        
        n8n_client = N8nClient(token=security_bot_token)

        response = await n8n_client.send_message_without_callback(message)
        data = response.json()
        status = data["data"]["outputs"]["status"]
        justificativa = data["data"]["outputs"]["justificativa"]
    
        return JSONResponse(content={
            "status" : status != "REPROVADO",
            "justificativa" : justificativa
        }, media_type="application/json")
        
    except Exception as e:
        with open('error.log', 'a') as f:
            f.write(str(e) + "\n")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/n8n-callback")
async def n8n_callback(request: Request):
    """
    Receives N8N webhook responses and forwards them to Kairos callback
    """
    try:
        body = await request.json()
        print(f"Received N8N callback: {body}")

        # Extract data from N8N response format
        if isinstance(body, list) and len(body) > 0:
            data = body[0]  # Get first item from array
        else:
            data = body

        briefing_id = int(data.get("briefingid"))
        text = data.get("texto")
        cliente = data.get("cliente")
        rede_social = data.get("rede_social", "")
        post_url = data.get("post_url", "")

        if not briefing_id or not text:
            raise HTTPException(
                status_code=400,
                detail="briefingid and texto are required"
            )

        # Transform to Kairos callback format
        kairos_payload = {
            "briefingId": briefing_id,
            "text": text,
            "sources": f"{rede_social}, {post_url}" if rede_social else ""
        }

        # Send to Kairos callback
        kairos_callback_url = os.getenv("CONTENT_CALLBACK_URL")  # Should be https://kairos.dbsweb.com.br/api/briefings/callback
        api_secret = os.getenv("API_SECRET")

        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_secret,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                kairos_callback_url,
                headers=headers,
                json=kairos_payload,
                timeout=30
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Error calling Kairos callback: {response.text}"
            )

        return JSONResponse(content={"status": "success", "message": "Callback sent to Kairos"})

    except Exception as e:
        print(f"Error in N8N callback: {e}")
        raise HTTPException(status_code=500, detail=str(e))
