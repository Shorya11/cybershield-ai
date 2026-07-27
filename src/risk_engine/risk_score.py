from dataclasses import dataclass


@dataclass
class RiskScore:
    probability: float
    score: float
    confidence: float


def calculate_risk_score(probability: float) -> RiskScore:
    """
    Convert model probability into
    a business-friendly risk score.
    """

    probability = max(0.0, min(1.0, probability))

    risk_score = round(probability * 100, 2)

    confidence = round(max(probability, 1 - probability) * 100, 2)

    return RiskScore(
        probability=probability,
        score=risk_score,
        confidence=confidence
    )

if __name__ == "__main__":

    probabilities = [0.08, 0.27, 0.51, 0.74, 0.96]

    for probability in probabilities:

        result = calculate_risk_score(probability)

        print(f"""
Probability : {result.probability:.2f}
Risk Score  : {result.score}
Confidence  : {result.confidence}%
""")