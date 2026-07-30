from dataclasses import dataclass, field
from typing import List
import random

@dataclass
class Account:
    account_id: str


@dataclass
class Device:
    device_id: str


@dataclass
class Merchant:
    merchant_id: str


@dataclass
class IPAddress:
    ip_address: str


@dataclass
class Transaction:
    transaction_id: str

@dataclass
class InvestigationCase:

    case_id: str
    risk_score: float

    accounts: List[Account] = field(default_factory=list)
    devices: List[Device] = field(default_factory=list)
    merchants: List[Merchant] = field(default_factory=list)
    ip_addresses: List[IPAddress] = field(default_factory=list)
    transactions: List[Transaction] = field(default_factory=list)

class InvestigationCaseGenerator:

    def __init__(self, seed: int):

        self.random = random.Random(seed)

    def generate_account(self):

        return Account(
            account_id=f"ACC_{self.random.randint(1000,9999)}"
        )


    def generate_device(self):

        return Device(
            device_id=f"DEV_{self.random.randint(1,30):03d}"
        )


    def generate_merchant(self):

        return Merchant(
            merchant_id=f"MERCHANT_{self.random.randint(1,50):03d}"
        )


    def generate_ip(self):

        return IPAddress(
            ip_address=f"192.168.{self.random.randint(1,20)}.{self.random.randint(1,254)}"
        )


    def generate_transaction(self):

        return Transaction(
            transaction_id=f"TXN_{self.random.randint(1000,9999)}"
        )

    def generate_case(
        self,
        case_id: str,
        risk_score: float
    ) -> InvestigationCase:

        case = InvestigationCase(
            case_id=case_id,
            risk_score=risk_score
        )

        # Accounts
        case.accounts = [
            self.generate_account()
            for _ in range(3)
        ]

        # Devices
        case.devices = [
            self.generate_device()
            for _ in range(2)
        ]

        # Merchants
        case.merchants = [
            self.generate_merchant()
        ]

        # IPs
        case.ip_addresses = [
            self.generate_ip()
            for _ in range(2)
        ]

        # Transactions
        case.transactions = [
            self.generate_transaction()
            for _ in range(3)
        ]

        return case

if __name__ == "__main__":

    generator = InvestigationCaseGenerator(seed=101)

    case = generator.generate_case(
        case_id="CASE_0001",
        risk_score=94
    )

    print("\n========== INVESTIGATION CASE ==========\n")

    print("Case ID:", case.case_id)
    print("Risk Score:", case.risk_score)

    print("\nAccounts")
    for account in case.accounts:
        print(account.account_id)

    print("\nDevices")
    for device in case.devices:
        print(device.device_id)

    print("\nMerchants")
    for merchant in case.merchants:
        print(merchant.merchant_id)

    print("\nIP Addresses")
    for ip in case.ip_addresses:
        print(ip.ip_address)

    print("\nTransactions")
    for transaction in case.transactions:
        print(transaction.transaction_id)