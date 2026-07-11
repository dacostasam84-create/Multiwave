# test_server.py
from fastapi import FastAPI

app = FastAPI(title="MultiWave Test API")

@app.get("/test")
def test():
    return {"message": "Server is working"}