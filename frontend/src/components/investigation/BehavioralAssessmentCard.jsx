import React from "react";

const LABELS = {
    transaction_velocity: "Transaction Velocity",
    fund_flow: "Fund Flow",
    activity_shifts: "Activity Shifts",
    behavioral_deviations: "Behavioral Deviations",
    alert_correlation: "Alert Correlation",
    counterparty_signals: "Counterparty Signals",
};

function statusClasses(status) {
    switch (status) {
        case "Elevated":
            return "border-red-200 bg-red-50 text-red-700";

        case "Moderate":
            return "border-amber-200 bg-amber-50 text-amber-700";

        case "Low":
            return "border-slate-200 bg-slate-50 text-slate-600";

        default:
            return "border-slate-200 bg-slate-50 text-slate-500";
    }
}

export default function BehavioralAssessmentCard({
    behavioralAssessment,
}) {
    if (!behavioralAssessment) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                    ARGUS Behavioral Assessment
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Transaction-level behavioral signals derived from
                    the supplied feature definitions.
                </p>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(LABELS).map(
                    ([key, label]) => {
                        const item =
                            behavioralAssessment[key];

                        if (!item) return null;

                        return (
                            <div
                                key={key}
                                className="rounded-xl border border-slate-200 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        {label}
                                    </p>

                                    <span
                                        className={[
                                            "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                                            statusClasses(
                                                item.status
                                            ),
                                        ].join(" ")}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                <p className="mt-3 text-lg font-bold text-slate-900">
                                    {item.signal_count ?? 0}
                                    <span className="text-sm font-medium text-slate-400">
                                        {" "}
                                        /{" "}
                                        {item.features_analyzed
                                            ?.length ?? 0}
                                    </span>
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    selected indicators active
                                </p>

                                <p className="mt-3 text-xs leading-5 text-slate-500">
                                    {item.evidence}
                                </p>
                            </div>
                        );
                    }
                )}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                <p className="text-xs text-slate-500">
                    These behavioral statuses describe observed
                    signals in this transaction. They are not
                    independent fraud probabilities.
                </p>
            </div>
        </div>
    );
}