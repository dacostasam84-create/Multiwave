from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services.traduction_service import translate_text

traduction_router = APIRouter()

@traduction_router.post("/")
async def translate(text: str):
    try:
        result = translate_text(text)
        return JSONResponse(content={"translated": result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)