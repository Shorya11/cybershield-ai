from dataclasses import dataclass
from typing import List

from .risk_score import calculate_risk_score
from .risk_levels import get_risk_level
from .reason_generator import generate_reasons


@dataclass
class RiskReport:
    fraud_probability: float
    risk_score: float
    confidence: float
    risk_level: str
    color: str
    recommended_action: str
    reasons: List[str]

def generate_risk_report(
    probability: float,
    shap_features: List[str] | None = None
) -> RiskReport:
    """
    Generate the complete fraud risk report.
    """

    score = calculate_risk_score(probability)

    level = get_risk_level(score.score)

    reasons = generate_reasons(
        probability=score.probability,
        risk_score=score.score,
        shap_features=shap_features
    )

    return RiskReport(
        fraud_probability=score.probability,
        risk_score=score.score,
        confidence=score.confidence,
        risk_level=level.level,
        color=level.color,
        recommended_action=level.action,
        reasons=reasons
    )

if __name__ == "__main__":

    report = generate_risk_report(
        probability=0.94,
        shap_features=[
            "High Transaction Velocity",
            "New Device",
            "Shared IP Address",
            "Recipient Diversity",
            "Behavioural Deviation"
        ]
    )

    print("\n========== FRAUD RISK REPORT ==========\n")

    print(f"Fraud Probability : {report.fraud_probability:.2f}")
    print(f"Risk Score        : {report.risk_score}")
    print(f"Confidence        : {report.confidence}%")
    print(f"Risk Level        : {report.risk_level}")
    print(f"Colour            : {report.color}")
    print(f"Recommended Action: {report.recommended_action}")

    print("\nReasons:")

    for reason in report.reasons:
        print(f"- {reason}")