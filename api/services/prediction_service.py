from pathlib import Path
import gc

import joblib
import pandas as pd

from src.risk_engine.risk_engine import generate_risk_report
from api.services.investigation_service import investigation_service


class PredictionService:

    def __init__(self):

        project_root = Path(__file__).resolve().parents[2]
        models_dir = project_root / "models"

        self.model = joblib.load(
            models_dir / "xgboost_tuned.pkl"
        )

        self.preprocessor = joblib.load(
            models_dir / "preprocessor.pkl"
        )

        self.fraud_threshold = 0.39

        print("✅ XGBoost model loaded")
        print("✅ Preprocessor loaded")
        print(
            f"✅ Fraud decision threshold: "
            f"{self.fraud_threshold}"
        )

    def predict(self, features: dict):

        df = pd.DataFrame([features])

        processed = self.preprocessor.transform(df)

        probability = float(
            self.model.predict_proba(processed)[0][1]
        )

        prediction = (
            "Fraud"
            if probability >= self.fraud_threshold
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
            "recommended_action":
                risk_report.recommended_action,
            "reasons": risk_report.reasons,
        }

    def predict_csv(
        self,
        dataframe: pd.DataFrame,
        chunk_size: int = 250,
    ):
        """
        Memory-bounded batch prediction.

        The original dataframe remains available through
        DatasetStore for later investigation. Only compact
        prediction results are accumulated here.
        """

        if "Unnamed: 0" in dataframe.columns:
            dataframe = dataframe.drop(
                columns=["Unnamed: 0"]
            )

        total_rows = len(dataframe)

        transaction_ids = []
        predictions = []
        probabilities_all = []

        risk_scores = []
        confidences = []
        risk_levels = []
        colors = []
        recommended_actions = []
        reasons_all = []
        investigation_reports = []

        for start in range(
            0,
            total_rows,
            chunk_size,
        ):

            end = min(
                start + chunk_size,
                total_rows,
            )

            chunk = dataframe.iloc[start:end]

            # Transform only this chunk.
            processed = self.preprocessor.transform(
                chunk
            )

            # Predict only this chunk.
            chunk_probabilities = (
                self.model.predict_proba(processed)
                [:, 1]
            )

            chunk_predictions = (
                chunk_probabilities
                >= self.fraud_threshold
            ).astype(int)

            # Free the large transformed matrix
            # before moving to the next chunk.
            del processed

            for offset, probability in enumerate(
                chunk_probabilities
            ):

                row_index = start + offset

                transaction_id = (
                    f"TXN_{row_index + 1:05d}"
                )

                risk_report = generate_risk_report(
                    probability=float(probability)
                )

                transaction_ids.append(
                    transaction_id
                )

                predictions.append(
                    int(chunk_predictions[offset])
                )

                probabilities_all.append(
                    float(probability)
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

                reasons_all.append(
                    ", ".join(risk_report.reasons)
                )

                # Investigation is generated on demand.
                investigation_reports.append(
                    None
                )

            # Release temporary references.
            del chunk
            del chunk_probabilities
            del chunk_predictions
            gc.collect()

        results = pd.DataFrame(
            {
                "transaction_id":
                    transaction_ids,

                "prediction":
                    predictions,

                "fraud_probability":
                    probabilities_all,

                "risk_score":
                    risk_scores,

                "confidence":
                    confidences,

                "risk_level":
                    risk_levels,

                "color":
                    colors,

                "recommended_action":
                    recommended_actions,

                "reasons":
                    reasons_all,

                "investigation_report":
                    investigation_reports,
            }
        )

        results["needs_investigation"] = (
            results["risk_level"].isin(
                ["High", "Critical"]
            )
        )

        return results


prediction_service = PredictionService()