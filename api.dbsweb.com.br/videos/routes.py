import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from fastapi.responses import FileResponse
import subprocess
from typing import Optional
import requests
from pydantic import BaseModel

router = APIRouter()

# Modelo para receber URL do vídeo
class VideoURL(BaseModel):
    url: str

# Configurações e funções auxiliares permanecem as mesmas...
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = BASE_DIR / 'videos' / 'input'
OUTPUT_FOLDER = BASE_DIR / 'videos' / 'output'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}

def verify_token(api_token: str):
    if not api_token:
        raise HTTPException(status_code=401, detail="API token is required")
    if api_token != os.getenv('API_SECRET'):
        raise HTTPException(status_code=401, detail="Invalid API token")

def allowed_file(filename: str):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@router.get("/test")
async def test_route(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key")
):
    print("Test route accessed")
    verify_token(x_api_key)
    return {"message": "Video router is working"}

# Novo endpoint para URL
@router.post("/edit-video-url")
async def edit_video_from_url(
    video_data: VideoURL,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key")
):
    verify_token(x_api_key)
    
    try:
        # Download do vídeo
        response = requests.get(video_data.url, stream=True)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Could not download video from URL")
        
        # Extrair nome do arquivo da URL
        filename = video_data.url.split('/')[-1]
        if not allowed_file(filename):
            filename = "video.mp4"  # Nome padrão se não conseguir extrair
            
        input_path = UPLOAD_FOLDER / filename
        output_filename = f"{filename.rsplit('.', 1)[0]}_ALTERED.mp4"
        output_path = OUTPUT_FOLDER / output_filename
        
        # Criar diretórios se não existirem
        UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
        OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)
        
        # Salvar o vídeo baixado
        with open(input_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Processar com auto-editor
        cmd = ['auto-editor', str(input_path), '-o', str(output_path)]
        process = subprocess.run(cmd, capture_output=True, text=True)
        
        if process.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Processing failed: {process.stderr}")
        
        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type='video/mp4'
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
        
    finally:
        # Limpar arquivos temporários
        if 'input_path' in locals() and input_path.exists():
            input_path.unlink()
        if 'output_path' in locals() and output_path.exists() and 'process' in locals() and process.returncode == 0:
            output_path.unlink()
