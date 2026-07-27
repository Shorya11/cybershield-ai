from typing import List


def generate_reasons(
    probability: float,
    risk_score: float,
    shap_features: List[str] | None = None
) -> List[str]:
    """
    Generate analyst-friendly reasons
    explaining the fraud prediction.
    """

    reasons = []

    # --------------------------
    # Probability based reasons
    # --------------------------

    if probability >= 0.90:
        reasons.append(
            "Fraud probability exceeds 90%."
        )

    elif probability >= 0.75:
        reasons.append(
            "Fraud probability is significantly high."
        )

    elif probability >= 0.50:
        reasons.append(
            "Moderate fraud probability detected."
        )

    # --------------------------
    # Risk score
    # --------------------------

    if risk_score >= 80:
        reasons.append(
            "Transaction classified as Critical Risk."
        )

    elif risk_score >= 60:
        reasons.append(
            "Transaction requires manual review."
        )

    # --------------------------
    # SHAP Features
    # --------------------------

    if shap_features:

        reasons.append(
            "Top contributing indicators:"
        )

        for feature in shap_features[:5]:

            reasons.append(
                f"• {feature}"
            )

    return reasons

if __name__ == "__main__":

    reasons = generate_reasons(
        probability=0.94,
        risk_score=94,
        shap_features=[
            "High Transaction Velocity",
            "New Device",
            "Shared IP Address",
            "Recipient Diversity",
            "Behavioural Deviation"
        ]
    )

    print()

    print("Reasons")

    print("-------------------")

    for reason in reasons:

        print(reason)