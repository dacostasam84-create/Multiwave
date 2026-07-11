from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Server is running"}

def test_stt():
    import io
    file = io.BytesIO(b"audio test")
    response = client.post("/stt/", files={"file": ("test.wav", file, "audio/wav")})
    assert response.status_code == 200
    assert "text" in response.json()