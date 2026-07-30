import networkx as nx
import hashlib

from .entities import InvestigationCase

class InvestigationGraphBuilder:

    def stable_index(self, value: str, size: int) -> int:
        digest = hashlib.md5(value.encode()).hexdigest()
        return int(digest, 16) % size

    def build_graph(
        self,
        case: InvestigationCase
    ) -> nx.Graph:

        graph = nx.Graph()

        for account in case.accounts:

            graph.add_node(
                account.account_id,
                node_type="Account",
                label=account.account_id
            )

        for device in case.devices:

            graph.add_node(
                device.device_id,
                node_type="Device",
                label=device.device_id
            )

        for merchant in case.merchants:

            graph.add_node(
                merchant.merchant_id,
                node_type="Merchant"
            )

        for ip in case.ip_addresses:

            graph.add_node(
                ip.ip_address,
                node_type="IP"
            )

        for transaction in case.transactions:

            graph.add_node(
                transaction.transaction_id,
                node_type="Transaction"
            )

        for transaction in case.transactions:

            account = case.accounts[
                self.stable_index(
                    transaction.transaction_id,
                    len(case.accounts))
            ]

            graph.add_edge(
                transaction.transaction_id,
                account.account_id,
                relationship="performed_by",
                edge_type="TRANSACTION_ACCOUNT"
            )

        for account in case.accounts:

            device = case.devices[
                self.stable_index(
                    account.account_id,
                    len(case.devices))
            ]

            graph.add_edge(
                account.account_id,
                device.device_id,
                relationship="uses_device",
                edge_type="ACCOUNT_DEVICE"
            )

        for account in case.accounts:

            ip = case.ip_addresses[
                self.stable_index(
                    account.account_id,
                    len(case.ip_addresses))
            ]

            graph.add_edge(
                account.account_id,
                ip.ip_address,
                relationship="uses_ip",
                edge_type="ACCOUNT_IP"
            )

        merchant = case.merchants[0]

        for transaction in case.transactions:

            graph.add_edge(
                transaction.transaction_id,
                merchant.merchant_id,
                relationship="merchant",
                edge_type="TRANSACTION_MERCHANT"
            )

        graph.graph["case_id"] = case.case_id
        graph.graph["risk_score"] = case.risk_score

        graph.graph["node_counts"] = {
            "accounts": len(case.accounts),
            "devices": len(case.devices),
            "transactions": len(case.transactions),
            "ips": len(case.ip_addresses),
            "merchants": len(case.merchants),
        }

        return graph

if __name__ == "__main__":

    from .entities import InvestigationCaseGenerator

    generator = InvestigationCaseGenerator(seed=101)

    case = generator.generate_case(
        case_id="CASE_0001",
        risk_score=94
    )

    builder = InvestigationGraphBuilder()

    graph = builder.build_graph(case)

    print("\nGraph Summary")
    print("=" * 40)

    print(f"Case ID : {graph.graph['case_id']}")
    print(f"Risk Score : {graph.graph['risk_score']}")
    print(f"Nodes : {graph.number_of_nodes()}")
    print(f"Edges : {graph.number_of_edges()}")

    print("\nNode Counts")
    print(graph.graph["node_counts"])

    print("\nRelationships")
    print("-" * 60)

    for u, v, data in graph.edges(data=True):
        print(
            f"{u:<18} --> {v:<18} ({data['relationship']})"
        )