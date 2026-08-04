from fastapi import APIRouter

from api.schemas.request import PredictionRequest
from api.services.prediction_service import prediction_service

router = APIRouter()


@router.post("/predict")
def predict(request: PredictionRequest):

    result = prediction_service.predict(request.features)

    return result