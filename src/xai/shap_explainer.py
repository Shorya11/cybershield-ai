import re

import numpy as np
import shap


class SHAPExplainer:
    """
    Generates transaction-level SHAP explanations for the XGBoost model.

    The model receives preprocessed features such as:

        num__F3799
        cat__F3886_Agri Adv

    SHAP values are aggregated back to the original F-feature so that
    the investigation layer can present meaningful feature evidence.
    """

    def __init__(self, model, feature_mapper):
        self.model = model
        self.feature_mapper = feature_mapper

        self.explainer = shap.TreeExplainer(model)

    @staticmethod
    def _original_feature(transformed_name):
        """
        Convert a transformed preprocessor feature name back to
        its original F-feature.

        Examples:

            num__F3799
                -> F3799

            cat__F3886_Agri Adv
                -> F3886
        """

        name = str(transformed_name)

        # Numerical transformed feature
        if name.startswith("num__"):
            feature = name.replace("num__", "", 1)

            if feature.startswith("F"):
                return feature

        # One-hot categorical feature
        if name.startswith("cat__"):
            remainder = name.replace("cat__", "", 1)

            match = re.match(r"(F\d+)", remainder)

            if match:
                return match.group(1)

        return None

    def explain(self, processed_row, feature_names, original_row, top_k=8):
        """
        Generate transaction-level SHAP explanations.

        Parameters
        ----------
        processed_row:
            One already-preprocessed transaction row.

        feature_names:
            Names returned by preprocessor.get_feature_names_out().

        original_row:
            Original transaction row before preprocessing.

        top_k:
            Number of strongest positive contributors to return.

        Returns
        -------
        list[dict]
            Human-readable SHAP evidence.
        """

        shap_output = self.explainer(processed_row)

        shap_values = shap_output.values

        # Binary classification can sometimes return an additional
        # output dimension. We only need the fraud-class explanation.
        if shap_values.ndim == 3:
            shap_values = shap_values[:, :, 1]

        shap_values = np.asarray(shap_values)[0]

        aggregated = {}

        for transformed_name, shap_value in zip(
            feature_names,
            shap_values,
        ):
            original_feature = self._original_feature(
                transformed_name
            )

            if original_feature is None:
                continue

            if original_feature not in aggregated:
                aggregated[original_feature] = 0.0

            aggregated[original_feature] += float(shap_value)

        # Only positive contributors are useful for
        # explaining why the transaction moved toward fraud.
        positive = [
            (feature, value)
            for feature, value in aggregated.items()
            if value > 0
        ]

        positive.sort(
            key=lambda item: item[1],
            reverse=True,
        )

        evidence = []

        for feature, shap_value in positive[:top_k]:

            info = self.feature_mapper.get_feature_info(
                feature
            )

            observed_value = None

            if feature in original_row.index:
                observed_value = original_row[feature]

            if observed_value is not None:
                try:
                    if np.isnan(observed_value):
                        observed_value = None
                except TypeError:
                    pass

            evidence.append(
                {
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
                    "value": (
                        float(observed_value)
                        if isinstance(
                            observed_value,
                            (int, float, np.integer, np.floating),
                        )
                        else observed_value
                    ),
                    "shap_value": round(
                        float(shap_value),
                        6,
                    ),
                    "direction": "increases_risk",
                }
            )

        return evidence