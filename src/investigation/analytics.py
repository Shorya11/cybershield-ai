from dataclasses import dataclass
from typing import Dict, List

import networkx as nx

@dataclass
class GraphAnalytics:

    degree_centrality: Dict[str, float]

    betweenness_centrality: Dict[str, float]

    connected_components: List[set]

    component_sizes: List[int]

    shared_devices: Dict[str, List[str]]

    shared_ips: Dict[str, List[str]]

    node_count: int

    edge_count: int

    top_nodes: List[tuple]

class InvestigationAnalytics:

    def analyze(
        self,
        graph: nx.Graph
    ) -> GraphAnalytics:

        degree = nx.degree_centrality(graph)

        degree = dict(
            sorted(
                degree.items(),
                key=lambda item: item[1],
                reverse=True
            )
        )

        betweenness = nx.betweenness_centrality(graph)

        betweenness = dict(
            sorted(
                betweenness.items(),
                key=lambda item: item[1],
                reverse=True
            )
        )

        components = list(nx.connected_components(graph))

        component_sizes = [
            len(component)
            for component in components
        ]

        top_nodes = sorted(
            degree.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]

        shared_devices = {}
        for node, attrs in graph.nodes(data=True):

            if attrs.get("node_type") != "Device":
                continue

            connected_accounts = [

                neighbour

                for neighbour in graph.neighbors(node)

                if graph.nodes[neighbour]["node_type"] == "Account"

            ]

            if len(connected_accounts) > 1:

                shared_devices[node] = connected_accounts

        shared_ips = {}
        for node, attrs in graph.nodes(data=True):

            if attrs.get("node_type") != "IP":
                continue

            connected_accounts = [
                neighbour
                for neighbour in graph.neighbors(node)
                if graph.nodes[neighbour]["node_type"] == "Account"
            ]

            if len(connected_accounts) > 1:
                shared_ips[node] = connected_accounts

        node_count = graph.number_of_nodes()
        edge_count = graph.number_of_edges()

        return GraphAnalytics(
            degree_centrality=degree,
            betweenness_centrality=betweenness,
            connected_components=components,
            component_sizes=component_sizes,
            shared_devices=shared_devices,
            shared_ips=shared_ips,
            node_count=node_count,
            edge_count=edge_count,
            top_nodes=top_nodes
        )


    
if __name__ == "__main__":

    from .entities import InvestigationCaseGenerator
    from .graph_builder import InvestigationGraphBuilder

    generator = InvestigationCaseGenerator(seed=101)

    case = generator.generate_case(
        case_id="CASE001",
        risk_score=92
    )

    graph = InvestigationGraphBuilder().build_graph(case)

    analytics = InvestigationAnalytics().analyze(graph)

    print("\nGraph Statistics")
    print("-" * 40)

    print(f"Nodes : {analytics.node_count}")
    print(f"Edges : {analytics.edge_count}")

    print(f"\nConnected Components : {len(analytics.connected_components)}")

    print("\nShared Devices")
    print(analytics.shared_devices)

    print("\nShared IPs")
    print(analytics.shared_ips)

    print("\nTop Connected Nodes")
    print("-" * 40)

    for node, score in analytics.top_nodes:
        print(f"{node:<20} {score:.3f}")

    print("\nComponent Sizes")
    print(analytics.component_sizes)