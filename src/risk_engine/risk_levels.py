from dataclasses import dataclass


@dataclass
class RiskLevel:
    level: str
    color: str
    action: str


def get_risk_level(risk_score: float) -> RiskLevel:
    """
    Convert a risk score (0–100) into a risk level.
    """

    if risk_score < 20:
        return RiskLevel(
            level="Safe",
            color="Green",
            action="Approve Transaction"
        )

    elif risk_score < 40:
        return RiskLevel(
            level="Low",
            color="Light Green",
            action="Approve and Monitor"
        )

    elif risk_score < 60:
        return RiskLevel(
            level="Medium",
            color="Yellow",
            action="Additional Verification"
        )

    elif risk_score < 80:
        return RiskLevel(
            level="High",
            color="Orange",
            action="Manual Review Required"
        )

    else:
        return RiskLevel(
            level="Critical",
            color="Red",
            action="Block Transaction Immediately"
        )


if __name__ == "__main__":

    scores = [12, 35, 58, 74, 96]

    for score in scores:

        risk = get_risk_level(score)

        print(f"""
Risk Score : {score}
Risk Level : {risk.level}
Color      : {risk.color}
Action     : {risk.action}
""")