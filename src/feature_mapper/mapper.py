from pathlib import Path

import joblib
import pandas as pd


class FeatureMapper:

    def __init__(self):

        project_root = Path(__file__).resolve().parents[2]

        excel_path = project_root / "Description.xlsx"

        metadata_path = (
            project_root /
            "models" /
            "feature_metadata.pkl"
        )

        # Load Excel
        self.df = pd.read_excel(excel_path)

        # Load metadata
        self.metadata = joblib.load(metadata_path)

        # Lookups
        self.variable_lookup = dict(
            zip(
                self.df["Feature"],
                self.df["Variable Name"]
            )
        )

        self.description_lookup = dict(
            zip(
                self.df["Feature"],
                self.df["Description"]
            )
        )

        if "Bank_Finalized_Variables" in self.df.columns:

            self.business_lookup = dict(
                zip(
                    self.df["Feature"],
                    self.df["Bank_Finalized_Variables"]
                )
            )

        else:

            self.business_lookup = {}

    # -------------------------
    # Metadata
    # -------------------------

    def get_original_features(self):

        return self.metadata["feature_names"]

    def get_numerical_features(self):

        return self.metadata["numerical_columns"]

    def get_categorical_features(self):

        return self.metadata["categorical_columns"]

    def get_mapped_feature_names(self):

        return [
            self.get_variable_name(feature)
            for feature in self.get_original_features()
        ]

    # -------------------------
    # Mapping
    # -------------------------

    def get_variable_name(self, feature):

        return self.variable_lookup.get(feature, feature)

    def get_description(self, feature):

        return self.description_lookup.get(feature, "")

    def get_business_name(self, feature):

        return self.business_lookup.get(feature, feature)

    def get_feature_info(self, feature):

        return {
            "feature": feature,
            "variable_name": self.get_variable_name(feature),
            "business_name": self.get_business_name(feature),
            "description": self.get_description(feature)
        }

    def rename_dataframe(self, dataframe):

        dataframe = dataframe.copy()

        dataframe.columns = [
            self.get_variable_name(column)
            for column in dataframe.columns
        ]

        return dataframe

    def rename_feature_list(self, feature_list):

        return [
            self.get_variable_name(feature)
            for feature in feature_list
        ]


if __name__ == "__main__":

    mapper = FeatureMapper()

    print("=" * 60)
    print("FEATURE METADATA")
    print("=" * 60)

    print()

    print("Original Features")

    print(mapper.get_original_features()[:5])

    print()

    print("Mapped Features")

    print(mapper.get_mapped_feature_names()[:5])

    print()

    print("Feature Information")

    print(mapper.get_feature_info("F670"))

    import pandas as pd

    print()

    print("=" * 60)
    print("DATAFRAME TEST")
    print("=" * 60)

    sample_df = pd.DataFrame(
        {
            "F1": [1],
            "F670": [2],
            "F3894": [3]
        }
    )

    print()

    print("Before")

    print(sample_df.columns)

    renamed_df = mapper.rename_dataframe(sample_df)

    print()

    print("After")

    print(renamed_df.columns)