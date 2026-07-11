from fastapi import APIRouter
from api.stt_api import stt_router
from api.traduction_api import traduction_router
from api.audio_api import audio_router
from api.video_api import video_router
from api.tts_api import tts_router

router = APIRouter()
router.include_router(stt_router, prefix="/stt", tags=["STT"])
router.include_router(traduction_router, prefix="/traduction", tags=["Traduction"])
router.include_router(audio_router, prefix="/audio", tags=["Audio"])
router.include_router(video_router, prefix="/video", tags=["Video"])
router.include_router(tts_router, prefix="/tts", tags=["TTS"])