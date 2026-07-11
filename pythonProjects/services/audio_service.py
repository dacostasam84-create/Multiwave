from services.stt_service import speech_to_text

def process_audio(file_path: str, target_lang: str = "fr") -> dict:
    return speech_to_text(file_path, target_lang)