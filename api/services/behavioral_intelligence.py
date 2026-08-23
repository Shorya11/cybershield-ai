import pandas as pd

from src.feature_mapper.mapper import FeatureMapper

class BehavioralIntelligenceService:

    def __init__(self):
        self.mapper = FeatureMapper()

    def _status_from_rate(self, rate):
        if rate is None:
            return "Unavailable"

        if rate >= 60:
            return "Elevated"

        if rate >= 25:
            return "Moderate"

        return "Low"

    def _get_feature_info(self, features):
        return [
            self.mapper.get_feature_info(feature)
            for feature in features
            if feature in self.mapper.variable_lookup
        ]

    def analyze(
        self,
        dataframe: pd.DataFrame,
        results: pd.DataFrame | None = None,
    ):
        df = dataframe.copy()

        analysis = {
            "transaction_velocity": self._transaction_velocity(df),
            "fund_flow": self._fund_flow(df),
            "activity_shifts": self._activity_shifts(df),
            "behavioral_deviations": self._behavioral_deviations(df),
            "alert_correlation": self._alert_correlation(df),
            "counterparty_signals": self._counterparty_signals(df),
            "risk_propagation": self._risk_propagation(df),
        }

        if results is not None:
            analysis["risk_concentration"] = (
                self._risk_concentration(
                    df,
                    results,
                )
            )
        else:
            analysis["risk_concentration"] = {
                "available": False,
                "status": "Unavailable",
                "high_risk_count": 0,
                "signals": [],
                "evidence": (
                    "Prediction results were not supplied "
                    "for concentration analysis."
                ),
            }

        return analysis

    def _non_zero_rate(self, df, features):
        available = [
            feature for feature in features
            if feature in df.columns
        ]

        if not available:
            return 0.0

        values = (
            df[available]
            .apply(pd.to_numeric, errors="coerce")
            .fillna(0)
        )

        active_rows = (values.abs().sum(axis=1) > 0).sum()

        return (
            float((active_rows / len(df)) * 100)
            if len(df)
            else 0.0
        )

    def _transaction_velocity(self, df):
        features = [
            "F670",
            "F1692",
            "F2082",
            "F2122",
        ]

        available = [
            feature for feature in features
            if feature in df.columns
        ]

        rate = round(
            self._non_zero_rate(df, features),
            2,
        )

        return {
            "features_analyzed": available,
            "feature_details": self._get_feature_info(available),
            "signal_rate": rate,
            "status": self._status_from_rate(rate),
            "evidence": (
                f"{rate}% of records show activity in the "
                "selected transaction-velocity indicators."
            ),
        }

    def _fund_flow(self, df):
        features = [
            "F2582",
            "F2678",
            "F2737",
            "F531",
        ]

        available = [
            feature for feature in features
            if feature in df.columns
        ]

        rate = round(
            self._non_zero_rate(df, features),
            2,
        )

        return {
            "features_analyzed": available,
            "feature_details": self._get_feature_info(available),
            "signal_rate": rate,
            "status": self._status_from_rate(rate),
            "evidence": (
                f"{rate}% of records contain activity in the "
                "selected fund-flow behaviour indicators."
            ),
        }

    def _activity_shifts(self, df):
        features = [
            "F115",
            "F321",
            "F527",
            "F531",
            "F3043",
        ]

        available = [
            feature for feature in features
            if feature in df.columns
        ]

        rate = round(
            self._non_zero_rate(df, features),
            2,
        )

        return {
            "features_analyzed": available,
            "feature_details": self._get_feature_info(available),
            "signal_rate": rate,
            "status": self._status_from_rate(rate),
            "evidence": (
                f"{rate}% of records contain activity in the "
                "selected historical-shift indicators."
            ),
        }

    def _behavioral_deviations(self, df):
        features = [
            "F2582",
            "F2678",
            "F2737",
            "F2956",
            "F3043",
        ]

        available = [
            feature for feature in features
            if feature in df.columns
        ]

        rate = round(
            self._non_zero_rate(df, features),
            2,
        )

        return {
            "features_analyzed": available,
            "feature_details": self._get_feature_info(available),
            "signal_rate": rate,
            "status": self._status_from_rate(rate),
            "evidence": (
                f"{rate}% of records contain activity in the "
                "selected behavioral-deviation indicators."
            ),
        }

    def _alert_correlation(self, df):
        features = [
            "F3900",
            "F3901",
            "F3902",
            "F3903",
            "F3904",
            "F3905",
            "F3906",
            "F3907",
            "F3908",
            "F3909",
            "F3910",
            "F3911",
        ]

        available = [
            feature for feature in features
            if feature in df.columns
        ]

        if not available:
            return {
                "features_analyzed": [],
                "rows_with_alert_signal": 0,
                "signal_rate": 0.0,
                "status": "Unavailable",
                "evidence": (
                    "No alert indicators were available "
                    "in the dataset."
                ),
            }

        values = (
            df[available]
            .apply(pd.to_numeric, errors="coerce")
            .fillna(0)
        )

        rows_with_alert = (
            values.sum(axis=1) > 0
        ).sum()

        rate = round(
            (rows_with_alert / len(df)) * 100,
            2,
        ) if len(df) else 0.0

        return {
            "features_analyzed": available,
            "rows_with_alert_signal": int(rows_with_alert),
            "feature_details": self._get_feature_info(available),
            "signal_rate": rate,
            "status": self._status_from_rate(rate),
            "evidence": (
                f"{int(rows_with_alert):,} records contain at least "
                f"one selected alert indicator."
            ),
        }

    def _counterparty_signals(self, df):
        features = [
            "F3901",
            "F3904",
            "F3908",
            "F3910",
        ]

        available = [
            feature for feature in features
            if feature in df.columns
        ]

        if not available:
            return {
                "features_analyzed": [],
                "signal_rate": 0.0,
                "status": "Unavailable",
                "evidence": (
                    "No counterparty-related behavioural "
                    "signals were available in the dataset."
                ),
            }

        values = (
            df[available]
            .apply(pd.to_numeric, errors="coerce")
            .fillna(0)
        )

        rows_with_signal = (
            values.sum(axis=1) > 0
        ).sum()

        rate = round(
            (rows_with_signal / len(df)) * 100,
            2,
        ) if len(df) else 0.0

        return {
            "features_analyzed": available,
            "feature_details": self._get_feature_info(available),
            "signal_rate": rate,
            "status": self._status_from_rate(rate),
            "evidence": (
                f"{int(rows_with_signal):,} records contain at least "
                "one counterparty-related behavioural signal."
            ),
        }

    def _risk_propagation(self, df):
        """
        Measure multi-dimensional risk-signal propagation.

        Propagation is defined as the co-occurrence of multiple
        independent behavioral signal families within the same record.

        This does NOT imply confirmed account-to-account relationships.
        """

        signal_groups = {
            "transaction_velocity": [
                "F670",
                "F1692",
                "F2082",
                "F2122",
            ],
            "fund_flow": [
                "F2582",
                "F2678",
                "F2737",
                "F531",
            ],
            "activity_shifts": [
                "F115",
                "F321",
                "F527",
                "F531",
                "F3043",
            ],
            "behavioral_deviations": [
                "F2582",
                "F2678",
                "F2737",
                "F2956",
                "F3043",
            ],
            "alert_correlation": [
                "F3900",
                "F3901",
                "F3902",
                "F3903",
                "F3904",
                "F3905",
                "F3906",
                "F3907",
                "F3908",
                "F3909",
                "F3910",
                "F3911",
            ],
            "counterparty_signals": [
                "F3901",
                "F3904",
                "F3908",
                "F3910",
            ],
        }

        family_masks = {}

        for family, features in signal_groups.items():
            available = [
                feature
                for feature in features
                if feature in df.columns
            ]

            if available:
                values = (
                    df[available]
                    .apply(pd.to_numeric, errors="coerce")
                    .fillna(0)
                )

                family_masks[family] = (
                    values.abs().sum(axis=1) > 0
                )

        if not family_masks or len(df) == 0:
            return {
                "score": 0.0,
                "status": "Unavailable",
                "signal_families_active": 0,
                "signal_families_total": len(signal_groups),
                "propagation_rate": 0.0,
                "average_active_families": 0.0,
                "max_active_families": 0,
                "evidence": (
                    "Insufficient behavioral signal data was "
                    "available to calculate propagation."
                ),
            }

        family_matrix = pd.DataFrame(
            family_masks,
            index=df.index,
        )

        active_family_count = family_matrix.sum(axis=1)

        propagation_rows = (
            active_family_count >= 3
        ).sum()

        propagation_rate = round(
            (propagation_rows / len(df)) * 100,
            2,
        )

        average_active_families = round(
            float(active_family_count.mean()),
            2,
        )

        max_active_families = int(
            active_family_count.max()
        )

        score = propagation_rate

        status = self._status_from_rate(score)

        return {
            "score": score,
            "status": status,
            "signal_families_active": len(family_masks),
            "signal_families_total": len(signal_groups),
            "propagation_rate": propagation_rate,
            "average_active_families": average_active_families,
            "max_active_families": max_active_families,
            "evidence": (
                f"{int(propagation_rows):,} records show "
                f"three or more simultaneous behavioral "
                f"risk-signal families "
                f"({propagation_rate}% of records)."
            ),
        }

    def _risk_concentration(
        self,
        df: pd.DataFrame,
        results: pd.DataFrame,
    ):
        """
        Compare behavioral signal activation in high-risk
        transactions against the overall dataset.

        High-risk transactions are defined by the prediction
        pipeline as High or Critical risk cases.
        """

        signal_groups = {
            "transaction_velocity": [
                "F670",
                "F1692",
                "F2082",
                "F2122",
            ],
            "fund_flow": [
                "F2582",
                "F2678",
                "F2737",
                "F531",
            ],
            "activity_shifts": [
                "F115",
                "F321",
                "F527",
                "F531",
                "F3043",
            ],
            "behavioral_deviations": [
                "F2582",
                "F2678",
                "F2737",
                "F2956",
                "F3043",
            ],
            "alert_correlation": [
                "F3900",
                "F3901",
                "F3902",
                "F3903",
                "F3904",
                "F3905",
                "F3906",
                "F3907",
                "F3908",
                "F3909",
                "F3910",
                "F3911",
            ],
            "counterparty_signals": [
                "F3901",
                "F3904",
                "F3908",
                "F3910",
            ],
        }

        if len(df) == 0 or len(results) == 0:
            return {
                "available": False,
                "status": "Unavailable",
                "high_risk_count": 0,
                "signals": [],
                "evidence": (
                    "Insufficient prediction data was "
                    "available to calculate risk concentration."
                ),
            }

        high_risk_mask = results["risk_level"].isin(
            ["High", "Critical"]
        )

        high_risk_count = int(high_risk_mask.sum())

        if high_risk_count == 0:
            return {
                "available": True,
                "status": "No High/Critical cases",
                "high_risk_count": 0,
                "signals": [],
                "evidence": (
                    "No High or Critical transactions were "
                    "available for concentration analysis."
                ),
            }

        high_risk_df = df.loc[
            high_risk_mask.values
        ]

        signals = []

        for family, features in signal_groups.items():

            available = [
                feature
                for feature in features
                if feature in df.columns
            ]

            if not available:
                continue

            overall_values = (
                df[available]
                .apply(pd.to_numeric, errors="coerce")
                .fillna(0)
            )

            high_risk_values = (
                high_risk_df[available]
                .apply(pd.to_numeric, errors="coerce")
                .fillna(0)
            )

            overall_active = (
                overall_values.abs().sum(axis=1) > 0
            )

            high_risk_active = (
                high_risk_values.abs().sum(axis=1) > 0
            )

            overall_rate = (
                float(overall_active.mean() * 100)
            )

            high_risk_rate = (
                float(high_risk_active.mean() * 100)
            )

            difference = (
                high_risk_rate - overall_rate
            )

            signals.append({
                "dimension": family,
                "overall_rate": round(
                    overall_rate,
                    2,
                ),
                "high_risk_rate": round(
                    high_risk_rate,
                    2,
                ),
                "difference": round(
                    difference,
                    2,
                ),
                "features_analyzed": available,
            })

        signals.sort(
            key=lambda item: item["difference"],
            reverse=True,
        )

        strongest = signals[0] if signals else None

        return {
            "available": bool(signals),
            "status": (
                "Elevated"
                if strongest and strongest["difference"] >= 10
                else "Moderate"
                if strongest and strongest["difference"] >= 5
                else "Low"
            ),
            "high_risk_count": high_risk_count,
            "signals": signals,
            "evidence": (
                f"Behavioral signal activation was compared "
                f"between {high_risk_count:,} High/Critical "
                "transactions and the overall dataset."
            ),
        }

    def _transaction_signal(self, row, features):
        """
        Determine whether selected behavioral indicators are active
        for one transaction.
        """

        available = [
            feature
            for feature in features
            if feature in row.index
        ]

        if not available:
            return {
                "features_analyzed": [],
                "active_features": [],
                "signal_count": 0,
                "signal_rate": 0.0,
                "status": "Unavailable",
                "feature_details": [],
            }

        active_features = []

        for feature in available:
            value = pd.to_numeric(
                row.get(feature),
                errors="coerce",
            )

            if pd.notna(value) and float(value) != 0:
                active_features.append(feature)

        signal_count = len(active_features)

        signal_rate = round(
            (signal_count / len(available)) * 100,
            2,
        )

        return {
            "features_analyzed": available,
            "active_features": active_features,
            "signal_count": signal_count,
            "signal_rate": signal_rate,
            "status": self._status_from_rate(signal_rate),
            "feature_details": self._get_feature_info(
                active_features
            ),
        }

    def _transaction_velocity_transaction(self, row):
        features = [
            "F670",
            "F1692",
            "F2082",
            "F2122",
        ]

        result = self._transaction_signal(
            row,
            features,
        )

        result["evidence"] = (
            f"{result['signal_count']} of "
            f"{len(result['features_analyzed'])} selected "
            "transaction-velocity indicators are active."
        )

        return result

    def _fund_flow_transaction(self, row):
        features = [
            "F2582",
            "F2678",
            "F2737",
            "F531",
        ]

        result = self._transaction_signal(
            row,
            features,
        )

        result["evidence"] = (
            f"{result['signal_count']} of "
            f"{len(result['features_analyzed'])} selected "
            "fund-flow indicators are active."
        )

        return result

    def _activity_shifts_transaction(self, row):
        features = [
            "F115",
            "F321",
            "F527",
            "F531",
            "F3043",
        ]

        result = self._transaction_signal(
            row,
            features,
        )

        result["evidence"] = (
            f"{result['signal_count']} of "
            f"{len(result['features_analyzed'])} selected "
            "historical-shift indicators are active."
        )

        return result

    def _behavioral_deviations_transaction(self, row):
        features = [
            "F2582",
            "F2678",
            "F2737",
            "F2956",
            "F3043",
        ]

        result = self._transaction_signal(
            row,
            features,
        )

        result["evidence"] = (
            f"{result['signal_count']} of "
            f"{len(result['features_analyzed'])} selected "
            "behavioral-deviation indicators are active."
        )

        return result

    def _alert_correlation_transaction(self, row):
        features = [
            "F3900",
            "F3901",
            "F3902",
            "F3903",
            "F3904",
            "F3905",
            "F3906",
            "F3907",
            "F3908",
            "F3909",
            "F3910",
            "F3911",
        ]

        result = self._transaction_signal(
            row,
            features,
        )

        result["evidence"] = (
            f"{result['signal_count']} of "
            f"{len(result['features_analyzed'])} selected "
            "alert indicators are active."
        )

        return result

    def _counterparty_signals_transaction(self, row):
        features = [
            "F3901",
            "F3904",
            "F3908",
            "F3910",
        ]

        result = self._transaction_signal(
            row,
            features,
        )

        result["evidence"] = (
            f"{result['signal_count']} of "
            f"{len(result['features_analyzed'])} selected "
            "counterparty-related behavioural indicators are active."
        )

        return result

    def analyze_transaction(self, row: pd.Series):
        """
        Analyze behavioral signals for one real transaction.

        This is intentionally different from analyze(), which calculates
        dataset-level signal rates for the Analytics page.
        """

        if not isinstance(row, pd.Series):
            row = pd.Series(row)

        return {
            "transaction_velocity": self._transaction_velocity_transaction(row),
            "fund_flow": self._fund_flow_transaction(row),
            "activity_shifts": self._activity_shifts_transaction(row),
            "behavioral_deviations": self._behavioral_deviations_transaction(row),
            "alert_correlation": self._alert_correlation_transaction(row),
            "counterparty_signals": self._counterparty_signals_transaction(row),
        }


behavioral_intelligence_service = BehavioralIntelligenceService()