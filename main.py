from fastapi import FastAPI

from api.routers.prediction import router as prediction_router
from api.routers.upload import router as upload_router

app = FastAPI(
    title="CyberShield AI",
    description="AI-powered Fraud & Mule Account Detection",
    version="1.0.0"
)

app.include_router(prediction_router)
app.include_router(upload_router)


@app.get("/")
def home():
    return {
        "status": "running"
    }