from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from services.video_service import process_video
import shutil, os

video_router = APIRouter()

@video_router.get("/")
def video_test():
    return {"message": "Video endpoint works"}

@video_router.post("/transcribe")
async def transcribe_video(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        result = process_video(temp_path)
        return JSONResponse(content={"transcription": result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)