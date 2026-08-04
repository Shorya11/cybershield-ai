from pathlib import Path

import joblib
import pandas as pd

from src.risk_engine.risk_engine import generate_risk_report
from api.services.investigation_service import investigation_service


class PredictionService:

    def __init__(self):

        project_root = Path(__file__).resolve().parents[2]
        models_dir = project_root / "models"

        self.model = joblib.load(models_dir / "xgboost_tuned.pkl")
        self.preprocessor = joblib.load(models_dir / "preprocessor.pkl")

        print("✅ XGBoost model loaded")
        print("✅ Preprocessor loaded")

    def predict(self, features: dict):

        df = pd.DataFrame([features])

        processed = self.preprocessor.transform(df)

        probability = float(
            self.model.predict_proba(processed)[0][1]
        )

        prediction = (
            "Fraud"
            if probability >= 0.5
            else "Legitimate"
        )

        risk_report = generate_risk_report(
            probability=probability
        )

        return {
            "prediction": prediction,
            "fraud_probability": probability,
            "risk_score": risk_report.risk_score,
            "confidence": risk_report.confidence,
            "risk_level": risk_report.risk_level,
            "color": risk_report.color,
            "recommended_action": risk_report.recommended_action,
            "reasons": risk_report.reasons
        }

    def predict_csv(
        self,
        dataframe: pd.DataFrame
    ):
        dataframe = dataframe.copy()

        if "Unnamed: 0" in dataframe.columns:
            dataframe = dataframe.drop(columns=["Unnamed: 0"])

        processed = self.preprocessor.transform(dataframe)

        probabilities = self.model.predict_proba(processed)[:, 1]

        predictions = self.model.predict(processed)

        results = dataframe.copy()

        results.insert(
            0,
            "transaction_id",
            [
                f"TXN_{i+1:05d}"
                for i in range(len(results))
            ]
        )

        risk_scores = []
        confidences = []
        risk_levels = []
        colors = []
        recommended_actions = []
        reasons_list = []
        investigation_reports = []

        results["prediction"] = predictions
        results["fraud_probability"] = probabilities

        for index, probability in enumerate(probabilities):

            transaction_id = results.loc[index, "transaction_id"]

            risk_report = generate_risk_report(
                probability=float(probability)
            )

            risk_scores.append(
                risk_report.risk_score
            )

            confidences.append(
                risk_report.confidence
            )

            risk_levels.append(
                risk_report.risk_level
            )

            colors.append(
                risk_report.color
            )

            recommended_actions.append(
                risk_report.recommended_action
            )

            reasons_list.append(
                ", ".join(risk_report.reasons)
            )

            if risk_report.risk_level in ["High", "Critical"]:

                investigation = investigation_service.investigate_transaction(
                    transaction_id=transaction_id,
                    risk_score=risk_report.risk_score
                )

            else:

                investigation = None

            investigation_reports.append(investigation)

        results["risk_score"] = risk_scores

        results["confidence"] = confidences

        results["risk_level"] = risk_levels
        results["needs_investigation"] = (
            results["risk_level"]
            .isin(["High", "Critical"])
        )

        results["color"] = colors

        results["recommended_action"] = recommended_actions

        results["reasons"] = reasons_list

        results["investigation_report"] = investigation_reports

        return results
        

prediction_service = PredictionService()
