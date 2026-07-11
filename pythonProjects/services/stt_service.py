import whisper
from deep_translator import GoogleTranslator

_model = None

def get_model():
    global _model
    if _model is None:
        _model = whisper.load_model("base")
    return _model

def speech_to_text(file_path: str, target_lang: str = "fr") -> dict:
    model = get_model()
    result = model.transcribe(file_path)
    print(f"Whisper result: {result}")
    original_text = result["text"]
    detected_lang = result["language"]
    
    if detected_lang != target_lang:
        translated = GoogleTranslator(
            source=detected_lang,
            target=target_lang
        ).translate(original_text)
    else:
        translated = original_text
    
    return {
        "original": original_text,
        "detected_language": detected_lang,
        "translated": translated,
        "target_language": target_lang
    }