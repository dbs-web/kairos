#!/usr/bin/env python3
"""
Debug script to test the N8N callback processing
"""

import asyncio
import os
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_callback_processing():
    """Test the callback processing logic"""
    
    # Sample N8N data from your logs
    n8n_data = [{
        'cliente': '10', 
        'rede_social': 'instagram', 
        'post_url': 'https://www.instagram.com/reel/DMq9PVbOrCn/', 
        'briefingid': '1612', 
        'texto': 'Cliente: Lia Bastos\nFormato: Kairós\nFoco narrativo: Educar\nIntenção Comunicacional: Ensinar\nTom emocional: Didático\n\n1.\u2060 \u2060Conteúdo (Texto)\nO Brasil saiu do Mapa da Fome da FAO em 2025...'
    }]
    
    print("=== Testing N8N Callback Processing ===")
    print(f"Input data: {n8n_data}")
    
    # Extract data from N8N response format (same logic as in routes.py)
    if isinstance(n8n_data, list) and len(n8n_data) > 0:
        data = n8n_data[0]  # Get first item from array
    else:
        data = n8n_data
    
    print(f"Extracted data: {data}")
    
    try:
        briefing_id = int(data.get("briefingid"))
        text = data.get("texto")
        cliente = data.get("cliente")
        rede_social = data.get("rede_social", "")
        post_url = data.get("post_url", "")
        
        print(f"Parsed values:")
        print(f"  briefing_id: {briefing_id} (type: {type(briefing_id)})")
        print(f"  text length: {len(text) if text else 0}")
        print(f"  cliente: {cliente}")
        print(f"  rede_social: {rede_social}")
        print(f"  post_url: {post_url}")
        
        if not briefing_id or not text:
            print("ERROR: briefingid and texto are required")
            return
        
        # Transform to Kairos callback format
        kairos_payload = {
            "briefingId": briefing_id,
            "text": text,
            "sources": f"{rede_social}, {post_url}" if rede_social else ""
        }
        
        print(f"Kairos payload: {kairos_payload}")
        
        # Get environment variables
        kairos_callback_url = os.getenv("CONTENT_CALLBACK_URL")
        api_secret = os.getenv("API_SECRET")
        
        print(f"Environment variables:")
        print(f"  CONTENT_CALLBACK_URL: {kairos_callback_url}")
        print(f"  API_SECRET: {'***' + api_secret[-4:] if api_secret else 'None'}")
        
        if not kairos_callback_url or not api_secret:
            print("ERROR: Environment variables not set properly")
            return
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_secret,
        }
        
        print(f"Request headers: {headers}")
        print(f"Making request to: {kairos_callback_url}")
        
        # Test the actual HTTP request
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    kairos_callback_url,
                    headers=headers,
                    json=kairos_payload,
                    timeout=30
                )
                
                print(f"Response status: {response.status_code}")
                print(f"Response headers: {dict(response.headers)}")
                print(f"Response text: {response.text}")
                
                if response.status_code != 200:
                    print(f"ERROR: Kairos callback failed with status {response.status_code}")
                    print(f"Response: {response.text}")
                else:
                    print("SUCCESS: Callback sent successfully")
                    
            except Exception as e:
                print(f"ERROR: Exception during HTTP request: {e}")
                
    except Exception as e:
        print(f"ERROR: Exception during processing: {e}")

if __name__ == "__main__":
    asyncio.run(test_callback_processing())
