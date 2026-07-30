from dataclasses import dataclass
from typing import List

from .analytics import GraphAnalytics

DEGREE_WEIGHT = 40
BETWEENNESS_WEIGHT = 30
SHARED_DEVICE_WEIGHT = 20
SHARED_IP_WEIGHT = 20
COMPONENT_WEIGHT = 10

SUSPICION_THRESHOLD = 50

@dataclass
class SuspiciousEntity:

    entity_id: str

    entity_type: str

    suspicion_score: float

    reasons: List[str]


@dataclass
class MuleDetectionResult:

    suspicious_entities: List[SuspiciousEntity]

    total_flagged: int

class MuleDetector:

    def detect(
        self,
        analytics: GraphAnalytics
    ) -> MuleDetectionResult:
        flagged: List[SuspiciousEntity] = []

        largest_component = (
            max(analytics.connected_components, key=len)
            if analytics.connected_components
            else set()
        )

        for node in analytics.degree_centrality.keys():

            score = 0
            reasons = []

            degree = analytics.degree_centrality[node]

            if degree > 0.30:

                score += min(degree * 100, DEGREE_WEIGHT)

                reasons.append(
                    "High network connectivity"
                )

            betweenness = analytics.betweenness_centrality[node]

            if betweenness > 0.10:

                score += min(degree * 100, BETWEENNESS_WEIGHT)

                reasons.append(
                    "Acts as bridge between entities"
                )

            for device, accounts in analytics.shared_devices.items():

                if node in accounts:

                    score += SHARED_DEVICE_WEIGHT

                    reasons.append(
                        f"Shares device {device}"
                    )

            for ip, accounts in analytics.shared_ips.items():

                if node in accounts:

                    score += SHARED_IP_WEIGHT

                    reasons.append(
                        f"Shares IP {ip}"
                    )

            if node in largest_component:

                score += COMPONENT_WEIGHT

                reasons.append(
                    "Part of largest connected component"
                )

            if node.startswith("ACC"):
                entity_type = "Account"

            elif node.startswith("DEV"):
                entity_type = "Device"

            elif node.startswith("IP"):
                entity_type = "IP"

            elif node.startswith("MER"):
                entity_type = "Merchant"

            elif node.startswith("TXN"):
                entity_type = "Transaction"

            else:
                entity_type = "Unknown"

            if score >= SUSPICION_THRESHOLD:

                flagged.append(

                    SuspiciousEntity(

                        entity_id=node,

                        entity_type=entity_type,

                        suspicion_score=score,

                        reasons=reasons

                    )
                )

        flagged.sort(

            key=lambda entity: entity.suspicion_score,

            reverse=True
        )

        return MuleDetectionResult(

            suspicious_entities=flagged,

            total_flagged=len(flagged)

        )
    

if __name__ == "__main__":

    from .entities import InvestigationCaseGenerator
    from .graph_builder import InvestigationGraphBuilder
    from .analytics import InvestigationAnalytics

    generator = InvestigationCaseGenerator(seed=101)

    case = generator.generate_case(
        case_id="CASE001",
        risk_score=95
    )

    graph = InvestigationGraphBuilder().build_graph(case)

    analytics = InvestigationAnalytics().analyze(graph)

    detector = MuleDetector()

    results = detector.detect(analytics)

    print("\n========== MULE DETECTOR ==========\n")

    print("Flagged:", results.total_flagged)

    for entity in results.suspicious_entities:

        print()

        print(f"Entity : {entity.entity_id}")
        print(f"Type   : {entity.entity_type}")
        print(f"Score  : {entity.suspicion_score}")
        print("Reasons:")

        for reason in entity.reasons:
            print(f"  • {reason}")

        print("-" * 40)