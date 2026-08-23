from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


class FoldSafePreprocessor(
    BaseEstimator,
    TransformerMixin,
):
    def __init__(self, missing_threshold=0.80):
        self.missing_threshold = missing_threshold

    def fit(self, X, y=None):
        X = X.copy()

        known_leaks = [
            "F2230",
            "F3912",
        ]

        X = X.drop(
            columns=known_leaks,
            errors="ignore",
        )

        all_null = [
            col
            for col in X.columns
            if X[col].isna().all()
        ]

        X = X.drop(
            columns=all_null,
            errors="ignore",
        )

        constant = [
            col
            for col in X.columns
            if X[col].nunique(
                dropna=False
            ) <= 1
        ]

        X = X.drop(
            columns=constant,
            errors="ignore",
        )

        missing_rate = X.isna().mean()

        high_missing = (
            missing_rate[
                missing_rate > self.missing_threshold
            ]
            .index
            .tolist()
        )

        X = X.drop(
            columns=high_missing,
            errors="ignore",
        )

        self.dropped_columns_ = sorted(
            set(
                known_leaks
                + all_null
                + constant
                + high_missing
            )
        )

        self.feature_columns_ = list(
            X.columns
        )

        self.numeric_columns_ = (
            X.select_dtypes(
                include=["number"]
            )
            .columns
            .tolist()
        )

        self.categorical_columns_ = (
            X.select_dtypes(
                include=["object", "category"]
            )
            .columns
            .tolist()
        )

        numeric_transformer = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(
                        strategy="median"
                    ),
                )
            ]
        )

        categorical_transformer = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(
                        strategy="most_frequent"
                    ),
                ),
                (
                    "encoder",
                    OneHotEncoder(
                        handle_unknown="ignore"
                    ),
                ),
            ]
        )

        self.preprocessor_ = ColumnTransformer(
            transformers=[
                (
                    "num",
                    numeric_transformer,
                    self.numeric_columns_,
                ),
                (
                    "cat",
                    categorical_transformer,
                    self.categorical_columns_,
                ),
            ]
        )

        self.preprocessor_.fit(
            X[self.feature_columns_]
        )

        return self

    def transform(self, X):
        X = X.copy()

        X = X.drop(
            columns=self.dropped_columns_,
            errors="ignore",
        )

        X = X.reindex(
            columns=self.feature_columns_,
            fill_value=float("nan"),
        )

        return self.preprocessor_.transform(X)

    def get_feature_names_out(self, input_features=None):
        """
        Expose transformed feature names from the underlying
        ColumnTransformer so the existing SHAP/investigation
        pipeline remains compatible.
        """
        return self.preprocessor_.get_feature_names_out(
            input_features
        )