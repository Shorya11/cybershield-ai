import pandas as pd


class DatasetStore:

    def __init__(self):
        self.dataframe = None
        self.results = None

    def set_dataframe(self, dataframe: pd.DataFrame):
        self.dataframe = dataframe.copy()

    def set_results(self, results: pd.DataFrame):
        self.results = results.copy()

    def get_dataframe(self):
        return self.dataframe

    def get_results(self):
        return self.results

    def get_row(self, transaction_id: str):
        if self.dataframe is None:
            return None

        try:
            if not str(transaction_id).startswith("TXN_"):
                return None

            row_number = int(str(transaction_id).replace("TXN_", ""))

            index = row_number - 1

            if index < 0 or index >= len(self.dataframe):
                return None

            return self.dataframe.iloc[index]

        except (ValueError, TypeError):
            return None

    def get_result(self, transaction_id: str):
        if self.results is None:
            return None

        if "transaction_id" not in self.results.columns:
            return None

        matches = self.results[
            self.results["transaction_id"].astype(str)
            == str(transaction_id)
        ]

        if matches.empty:
            return None

        return matches.iloc[0]


dataset_store = DatasetStore()