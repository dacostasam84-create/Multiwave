import ffmpeg
import os
from services.stt_service import speech_to_text

def extract_audio(video_path: str) -> str:
    audio_path = video_path.replace(".mp4", ".wav").replace(".avi", ".wav").replace(".mov", ".wav")
    ffmpeg.input(video_path).output(audio_path, ac=1, ar=16000).run(overwrite_output=True)
    return audio_path

def process_video(file_path: str) -> str:
    audio_path = extract_audio(file_path)
    result = speech_to_text(audio_path)
    if os.path.exists(audio_path):
        os.remove(audio_path)
    return result