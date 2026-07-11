from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from gtts import gTTS
import io

tts_router = APIRouter()

@tts_router.get("/")
def test_tts():
    return {"message": "TTS works"}

@tts_router.post("/synthesize")
async def synthesize(data: dict):
    text = data.get("text", "")
    language = data.get("language", "fr")

    if not text:
        return {"error": "Texte requis"}

    # Génération audio avec gTTS
    tts = gTTS(text=text, lang=language, slow=False)
    audio_buffer = io.BytesIO()
    tts.write_to_fp(audio_buffer)
    audio_buffer.seek(0)

    return StreamingResponse(
        audio_buffer,
        media_type="audio/mpeg",
        headers={"Content-Disposition": "attachment; filename=speech.mp3"}
    )
