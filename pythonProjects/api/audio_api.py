from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from services.audio_service import process_audio
import shutil, os

audio_router = APIRouter()

@audio_router.get("/")
def audio_test():
    return {"message": "Audio endpoint works"}

@audio_router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), target_lang: str = "fr"):
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        result = process_audio(temp_path, target_lang)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)