import pandas as pd

from api.services.dataset_store import dataset_store
from api.services.investigation_service import investigation_service


class AnalyticsService:

    def __init__(self):
        self.preprocessor = investigation_service.preprocessor
        self.shap_explainer = investigation_service.shap_explainer
        self.mapper = investigation_service.mapper

    def get_model_risk_drivers(
        self,
        sample_size: int = 20,
        top_k: int = 10,
    ):
        dataframe = dataset_store.get_dataframe()
        results = dataset_store.get_results()

        if dataframe is None or results is None:
            return {
                "success": False,
                "message": "No dataset has been uploaded yet.",
                "transactions_analyzed": 0,
                "drivers": [],
            }

        # Focus on transactions already identified
        # as fraud or high/critical risk.
        risk_levels = (
            results["risk_level"]
            .astype(str)
            .str.lower()
        )

        candidates = results[
            (results["prediction"] == 1)
            | risk_levels.isin(["high", "critical"])
        ]

        if candidates.empty:
            return {
                "success": True,
                "method": "SHAP",
                "transactions_analyzed": 0,
                "candidate_transactions": 0,
                "drivers": [],
            }

        sample = candidates.head(sample_size)

        feature_names = (
            self.preprocessor
            .get_feature_names_out()
        )

        aggregated = {}
        analyzed = 0

        for transaction_id in sample["transaction_id"]:

            row = dataset_store.get_row(
                transaction_id
            )

            if row is None:
                continue

            try:
                processed_row = (
                    self.preprocessor.transform(
                        pd.DataFrame([row])
                    )
                )

                evidence = self.shap_explainer.explain(
                    processed_row=processed_row,
                    feature_names=feature_names,
                    original_row=row,
                    top_k=50,
                )

                for item in evidence:

                    feature = item["feature"]
                    contribution = abs(
                        float(item["shap_value"])
                    )

                    if feature not in aggregated:
                        aggregated[feature] = {
                            "total": 0.0,
                            "count": 0,
                            "info": item,
                        }

                    aggregated[feature]["total"] += (
                        contribution
                    )

                    aggregated[feature]["count"] += 1

                analyzed += 1

            except Exception as exc:
                print(
                    f"⚠️ SHAP analytics failed for "
                    f"{transaction_id}: {exc}"
                )

        drivers = []

        for feature, data in aggregated.items():

            if data["count"] == 0:
                continue

            info = data["info"]

            importance = (
                data["total"] /
                data["count"]
            )

            drivers.append({
                "feature": feature,
                "variable_name": info.get(
                    "variable_name"
                ),
                "business_name": info.get(
                    "business_name"
                ),
                "description": info.get(
                    "description"
                ),
                "importance": round(
                    float(importance),
                    6,
                ),
                "transactions_contributing": (
                    data["count"]
                ),
            })

        drivers.sort(
            key=lambda item: item["importance"],
            reverse=True,
        )

        return {
            "success": True,
            "method": "SHAP",
            "transactions_analyzed": analyzed,
            "candidate_transactions": int(
                len(candidates)
            ),
            "drivers": drivers[:top_k],
        }


analytics_service = AnalyticsService()