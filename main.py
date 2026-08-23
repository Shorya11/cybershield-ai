from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers.prediction import router as prediction_router
from api.routers.upload import router as upload_router
from api.routers.investigation import router as investigation_router
from api.routers.analytics import router as analytics_router

app = FastAPI(
    title="CyberShield AI",
    description="AI-powered Fraud & Mule Account Detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)
app.include_router(upload_router)
app.include_router(investigation_router)
app.include_router(analytics_router)


@app.get("/")
def home():
    return {
        "status": "running"
    }