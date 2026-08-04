from src.investigation.entities import InvestigationCaseGenerator
from src.investigation.graph_builder import InvestigationGraphBuilder
from src.investigation.analytics import InvestigationAnalytics
from src.investigation.mule_detector import MuleDetector


class InvestigationService:

    def __init__(self):
    
            self.generator = InvestigationCaseGenerator(seed=101)
    
            self.graph_builder = InvestigationGraphBuilder()
    
            self.analytics = InvestigationAnalytics()
    
            self.detector = MuleDetector()

    def investigate_transaction(
            self,
            transaction_id: str,
            risk_score: float
        ):
            """
            Generate an investigation report for a single
            high-risk transaction.
            """

            case = self.generator.generate_case(
                case_id=transaction_id,
                risk_score=risk_score
            )

            graph = self.graph_builder.build_graph(case)

            analytics = self.analytics.analyze(graph)

            detection = self.detector.detect(analytics)

            return {
                "case_id": case.case_id,
                "risk_score": case.risk_score,

                "graph_summary": {
                    "nodes": graph.number_of_nodes(),
                    "edges": graph.number_of_edges(),
                    "flagged_entities": detection.total_flagged,
                    "suspicious_accounts": len(detection.suspicious_entities)
                }
            }

investigation_service = InvestigationService()