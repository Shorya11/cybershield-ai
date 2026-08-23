from fastapi import APIRouter

from api.services.analytics_service import analytics_service


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/model-drivers")
def get_model_risk_drivers():
    return analytics_service.get_model_risk_drivers(
        sample_size=20,
        top_k=10,
    )