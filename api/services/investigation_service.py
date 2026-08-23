import joblib
import pandas as pd

from src.feature_mapper.mapper import FeatureMapper
from src.xai.shap_explainer import SHAPExplainer

from api.services.behavioral_intelligence import (
    behavioral_intelligence_service,
)

import hashlib

from src.investigation.entities import InvestigationCaseGenerator
from src.investigation.graph_builder import InvestigationGraphBuilder
from src.investigation.analytics import InvestigationAnalytics
from src.investigation.mule_detector import MuleDetector

class InvestigationService:

    def __init__(self):
        self.mapper = FeatureMapper()

        self.model = joblib.load(
            "models/xgboost_tuned.pkl"
        )

        self.preprocessor = joblib.load(
            "models/preprocessor.pkl"
        )

        self.shap_explainer = SHAPExplainer(
            model=self.model,
            feature_mapper=self.mapper,
        )

        self.graph_builder = InvestigationGraphBuilder()
        self.graph_analytics = InvestigationAnalytics()
        self.mule_detector = MuleDetector()

    def _network_seed(self, transaction_id: str) -> int:
        """
        Generate a deterministic seed from the transaction ID.

        The same transaction will therefore receive the same
        illustrative network every time it is investigated.
        """
        digest = hashlib.md5(
            transaction_id.encode("utf-8")
        ).hexdigest()

        return int(digest[:8], 16)


    def _build_network_simulation(
            self,
            transaction_id: str,
            risk_score: float,
        ):
            """
            Build an illustrative synthetic investigation network.

            IMPORTANT:
            This graph is NOT derived from the supplied transaction
            dataset. It exists only to demonstrate the network
            investigation workflow because the supplied dataset
            lacks persistent entity relationships.
            """

            seed = self._network_seed(transaction_id)

            generator = InvestigationCaseGenerator(
                seed=seed
            )

            case = generator.generate_case(
                case_id=transaction_id,
                risk_score=float(risk_score),
            )

            graph = self.graph_builder.build_graph(case)

            analytics = self.graph_analytics.analyze(graph)

            detection = self.mule_detector.detect(analytics)

            flagged_lookup = {
                entity.entity_id: {
                    "suspicion_score": float(
                        entity.suspicion_score
                    ),
                    "entity_type": entity.entity_type,
                    "reasons": entity.reasons,
                }
                for entity in detection.suspicious_entities
            }

            nodes = []

            for node_id, attributes in graph.nodes(data=True):
                flagged = flagged_lookup.get(node_id)

                nodes.append({
                    "id": str(node_id),
                    "label": attributes.get(
                        "label",
                        str(node_id),
                    ),
                    "type": attributes.get(
                        "node_type",
                        "Unknown",
                    ),
                    "flagged": flagged is not None,
                    "suspicion_score": (
                        flagged["suspicion_score"]
                        if flagged
                        else 0.0
                    ),
                    "reasons": (
                        flagged["reasons"]
                        if flagged
                        else []
                    ),
                })

            edges = []

            for source, target, attributes in graph.edges(
                data=True
            ):
                edges.append({
                    "source": str(source),
                    "target": str(target),
                    "relationship": attributes.get(
                        "relationship",
                        "connected_to",
                    ),
                    "edge_type": attributes.get(
                        "edge_type",
                        "UNKNOWN",
                    ),
                })

            return {
                "available": True,
                "type": "synthetic",
                "label": "Prototype Network Simulation",

                "disclaimer": (
                    "This network is illustrative and uses "
                    "synthetic entities. The supplied dataset "
                    "does not contain sufficient persistent "
                    "entity identifiers for reliable graph "
                    "reconstruction."
                ),

                "summary": {
                    "nodes": analytics.node_count,
                    "edges": analytics.edge_count,
                    "flagged_entities": detection.total_flagged,
                    "suspicious_accounts": len([
                        entity
                        for entity in detection.suspicious_entities
                        if entity.entity_type == "Account"
                    ]),
                },

                "nodes": nodes,
                "edges": edges,

                "analytics": {
                    "connected_components": len(
                        analytics.connected_components
                    ),
                    "component_sizes": analytics.component_sizes,
                    "top_nodes": [
                        {
                            "node": str(node),
                            "centrality": float(score),
                        }
                        for node, score
                        in analytics.top_nodes
                    ],
                    "shared_devices": analytics.shared_devices,
                    "shared_ips": analytics.shared_ips,
                },

                "flagged_entities": [
                    {
                        "entity_id": entity.entity_id,
                        "entity_type": entity.entity_type,
                        "suspicion_score": float(
                            entity.suspicion_score
                        ),
                        "reasons": entity.reasons,
                    }
                    for entity
                    in detection.suspicious_entities
                ],
            }

    def investigate_transaction(
        self,
        transaction_id: str,
        row: pd.Series,
        prediction: int,
        risk_score: float,
        fraud_probability: float,
        risk_level: str,
        recommended_action: str,
        reasons: list | str,
    ):
        """
        Build a real-data investigation report for one
        transaction from the uploaded dataset.
        """

        if isinstance(row, pd.Series):
            row_data = row.to_dict()
            behavioral_assessment = (behavioral_intelligence_service.analyze_transaction(row))
        else:
            row_data = dict(row)

        processed_row = self.preprocessor.transform(
            pd.DataFrame([row_data])
        )

        feature_names = (
            self.preprocessor.get_feature_names_out()
        )

        shap_evidence = self.shap_explainer.explain(
            processed_row=processed_row,
            feature_names=feature_names,
            original_row=row,
            top_k=8,
        )

        feature_evidence = []

        for feature, value in row_data.items():

            if not str(feature).startswith("F"):
                continue

            if pd.isna(value):
                continue

            try:
                numeric_value = float(value)
            except (TypeError, ValueError):
                continue

            # Only expose non-zero / active indicators
            if numeric_value == 0:
                continue

            info = self.mapper.get_feature_info(feature)

            feature_evidence.append({
                "feature": feature,
                "variable_name": info.get("variable_name"),
                "description": info.get("description"),
                "value": numeric_value,
            })

        # Keep the full count for transparency,
        # but expose only a compact set of evidence to the frontend.

        feature_evidence_count = len(feature_evidence)

        # For the first version, prioritize features with
        # useful human-readable metadata.

        feature_evidence.sort(
            key=lambda item: (
                bool(item.get("description")),
                bool(item.get("variable_name")),
            ),
            reverse=True,
        )

        top_evidence = feature_evidence[:8]

        network_simulation = self._build_network_simulation(
            transaction_id=transaction_id,
            risk_score=risk_score,
        )

        return {
            "case_id": transaction_id,
            "transaction_id": transaction_id,

            "prediction": int(prediction),
            "risk_score": float(risk_score),
            "fraud_probability": float(fraud_probability),
            "risk_level": risk_level,

            "recommended_action": recommended_action,

            "reasons": reasons,

            "explainability": {
                "method": "SHAP",
                "description": (
                    "Transaction-level model contributions showing "
                    "features that increased fraud risk."
                ),
                "top_contributors": shap_evidence,
            },

            "behavioral_assessment": behavioral_assessment,

            "feature_evidence": top_evidence,
            "feature_evidence_count": feature_evidence_count,

            "network_intelligence": {
                "available": False,
                "status": "Not available in supplied dataset",

                "message": (
                    "The supplied dataset does not provide explicit "
                    "account-to-account entity relationships for "
                    "reliable graph traversal."
                ),

                "simulation": network_simulation,
            },
        }


investigation_service = InvestigationService()