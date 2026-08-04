from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd

from api.services.prediction_service import prediction_service

router = APIRouter(
    prefix="/predict",
    tags=["CSV Prediction"]
)


@router.post("/file")
async def upload_csv(file: UploadFile = File(...)):

    # Check extension
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    # Read CSV
    dataframe = pd.read_csv(file.file)

    if "Unnamed: 0" in dataframe.columns:
        dataframe = dataframe.drop(columns=["Unnamed: 0"])

    results = prediction_service.predict_csv(dataframe)

    preview = results.head(20)

    investigations = (
        results[
            results["needs_investigation"]
        ]
        .sort_values(
            by="risk_score",
            ascending=False
        )
    )

    return {
        "success": True,
        "filename": file.filename,

        "summary": {
            "total_transactions": len(results),
            "fraud_detected": int(results["prediction"].sum()),
            "high_risk_cases": int(
                results["needs_investigation"].sum()
            )
        },

        "preview": preview[
            [
                "transaction_id",
                "prediction",
                "fraud_probability",
                "risk_score",
                "risk_level",
                "needs_investigation",
                "recommended_action",
                "reasons"
            ]
        ].to_dict(orient="records"),

        "investigations": investigations[
            [
                "transaction_id",
                "prediction",
                "fraud_probability",
                "risk_score",
                "risk_level",
                "recommended_action",
                "reasons",
                "investigation_report"
            ]
        ].to_dict(orient="records")
    }