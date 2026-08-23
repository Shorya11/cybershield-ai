from fastapi import APIRouter, HTTPException

from api.services.dataset_store import dataset_store
from api.services.investigation_service import investigation_service


router = APIRouter(
    prefix="/investigation",
    tags=["Investigation"],
)


@router.get("/{transaction_id}")
def get_investigation(transaction_id: str):

    row = dataset_store.get_row(transaction_id)
    result = dataset_store.get_result(transaction_id)

    if row is None or result is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Transaction '{transaction_id}' was not found "
                "in the currently uploaded dataset."
            ),
        )

    investigation = investigation_service.investigate_transaction(
        transaction_id=transaction_id,
        row=row,
        prediction=int(result["prediction"]),
        risk_score=float(result["risk_score"]),
        fraud_probability=float(result["fraud_probability"]),
        risk_level=result["risk_level"],
        recommended_action=result["recommended_action"],
        reasons=result["reasons"],
    )

    return {
        "success": True,
        "investigation": investigation,
    }