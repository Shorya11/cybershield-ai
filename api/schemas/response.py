from pydantic import BaseModel
from typing import List


class PredictionResponse(BaseModel):
    prediction: str
    probability: float
    risk_score: float
    risk_level: str
    reasons: List[str]