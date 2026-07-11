import speech_recognition as sr
import requests

API_URL = "http://127.0.0.1:5000/stt"

def capture_and_send():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Parlez quelque chose …")
        audio = recognizer.listen(source)

    # sauvegarder temporairement
    with open("temp.wav", "wb") as f:
        f.write(audio.get_wav_data())

    # envoyer au serveur FastAPI
    with open("temp.wav", "rb") as f:
        files = {"file": f}
        response = requests.post(API_URL, files=files)
        print(response.json())

if __name__ == "__main__":
    capture_and_send()