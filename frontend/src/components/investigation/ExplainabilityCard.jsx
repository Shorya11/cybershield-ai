import React from "react";

export default function ExplainabilityCard({ explainability }) {
    const contributors =
        explainability?.top_contributors || [];

    if (!contributors.length) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">
                    Why This Transaction Was Flagged
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    No transaction-level explainability data is available.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Why This Transaction Was Flagged
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Model-supported evidence from transaction-level{" "}
                            {explainability.method || "SHAP"} analysis.
                        </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {explainability.method || "SHAP"}
                    </span>
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {contributors.map((item, index) => {
                    const shapValue = Number(item.shap_value ?? 0);
                    const observedValue = item.value;

                    return (
                        <div
                            key={`${item.feature}-${index}`}
                            className="px-5 py-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-900">
                                            ↑ {item.variable_name || item.feature}
                                        </span>

                                        <span className="font-mono text-[11px] text-slate-400">
                                            {item.feature}
                                        </span>
                                    </div>

                                    {item.description && (
                                        <p className="mt-1 text-sm text-slate-500">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className="mt-2 text-xs text-slate-500">
                                        Observed value:{" "}
                                        <span className="font-semibold text-slate-700">
                                            {typeof observedValue === "number"
                                                ? observedValue.toLocaleString()
                                                : String(observedValue ?? "N/A")}
                                        </span>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-bold text-red-600">
                                        +{shapValue.toFixed(3)}
                                    </p>

                                    <p className="mt-1 text-[11px] font-medium text-slate-400">
                                        model contribution
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                <p className="text-xs text-slate-500">
                    Positive SHAP contributions indicate that the feature
                    pushed this transaction toward a higher fraud-risk
                    prediction. They do not independently prove fraud.
                </p>
            </div>
        </div>
    );
}