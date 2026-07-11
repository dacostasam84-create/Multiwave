from fastapi import APIRouter, UploadFile, File
from services.stt_service import speech_to_text
import shutil, os

stt_router = APIRouter()

@stt_router.get("/")
def test_stt():
    return {"message": "STT works"}

@stt_router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    text = speech_to_text(temp_path)
    os.remove(temp_path)
    return {"transcription": text}