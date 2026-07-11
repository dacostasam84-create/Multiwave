import whisper
from googletrans import Translator
from gtts import gTTS
import tempfile
import os

# Charger Whisper V3
model = whisper.load_model("large-v3")
translator = Translator()

def speech_to_speech(audio_path: str, target_lang: str = "fr") -> dict:
    """
    Convertit audio source → texte → traduction → audio cible
    Supporte 131 langues
    """
    # 1. Transcription avec Whisper V3
    result = model.transcribe(audio_path)
    source_text = result["text"]
    source_lang = result["language"]
    
    # 2. Traduction avec Google Translate
    translated = translator.translate(source_text, dest=target_lang)
    translated_text = translated.text
    
    # 3. Synthèse vocale avec gTTS
    tts = gTTS(text=translated_text, lang=target_lang)
    output_path = tempfile.mktemp(suffix=".mp3")
    tts.save(output_path)
    
    return {
        "source_lang": source_lang,
        "source_text": source_text,
        "target_lang": target_lang,
        "translated_text": translated_text,
        "audio_output": output_path
    }
