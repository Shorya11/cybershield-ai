from pyvis.network import Network

from .analytics import GraphAnalytics
from .mule_detector import MuleDetectionResult
import networkx as nx

NODE_COLORS = {
    "Account": "#3498db",
    "Transaction": "#f39c12",
    "Device": "#9b59b6",
    "IP": "#2ecc71",
    "Merchant": "#8e5a2b"
}

EDGE_COLORS = {
    "ACCOUNT_DEVICE": "#9b59b6",
    "ACCOUNT_IP": "#2ecc71",
    "TRANSACTION_ACCOUNT": "#3498db",
    "TRANSACTION_MERCHANT": "#e67e22"
}

SUSPICIOUS_COLOR = "#e74c3c"

class InvestigationVisualizer:

    def create_network(
        self,
        graph: nx.Graph,
        analytics: GraphAnalytics,
        detection: MuleDetectionResult
    ) -> Network:

        network = Network(
            height="750px",
            width="100%",
            bgcolor="#ffffff",
            font_color="black",
            directed=False
        )

        suspicious_nodes = {
            entity.entity_id
            for entity in detection.suspicious_entities
        }

        for node, attrs in graph.nodes(data=True):
            node_type = attrs.get("node_type", "Unknown")
            color = NODE_COLORS.get(node_type, "#95a5a6")
            if node in suspicious_nodes:
                color = SUSPICIOUS_COLOR

            degree = analytics.degree_centrality.get(node, 0)

            betweenness = analytics.betweenness_centrality.get(node, 0)

            title = (
                f"<b>{node_type}</b><br>"
                f"ID: {node}<br>"
                f"Degree: {degree:.3f}<br>"
                f"Betweenness: {betweenness:.3f}<br>"
                f"Suspicious: {'YES' if node in suspicious_nodes else 'NO'}"
            )
            size = 20
            if node in suspicious_nodes:
                size = 35
            network.add_node(
                node,
                label=node,
                title=title,
                color=color,
                size=size
            )

        for source, target, attrs in graph.edges(data=True):
            edge_type = attrs.get("edge_type", "")

            color = EDGE_COLORS.get(edge_type, "#7f8c8d")
            network.add_edge(
                source,
                target,
                color=color,
                title=edge_type
            )

        network.barnes_hut()
        network.toggle_physics(True)
        network.show_buttons(filter_=["physics"])
        return network
        
    def save_html(
        self,
        network: Network,
        filename: str = "investigation_graph.html"
        ):
        network.save_graph(filename)


if __name__ == "__main__":

    from .entities import InvestigationCaseGenerator
    from .graph_builder import InvestigationGraphBuilder
    from .analytics import InvestigationAnalytics
    from .mule_detector import MuleDetector

    generator = InvestigationCaseGenerator(seed=101)

    case = generator.generate_case(
        case_id="CASE001",
        risk_score=95
    )

    graph = InvestigationGraphBuilder().build_graph(case)

    analytics = InvestigationAnalytics().analyze(graph)

    detection = MuleDetector().detect(analytics)

    visualizer = InvestigationVisualizer()

    network = visualizer.create_network(
        graph,
        analytics,
        detection
    )

    visualizer.save_html(network)

    print("\nGraph saved as investigation_graph.html")