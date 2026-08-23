import React from "react";

const RISK_LEVEL_STYLES = {
  Safe: "text-emerald-600",
  Medium: "text-amber-600",
  High: "text-orange-600",
  Critical: "text-red-600",
};

const PREDICTION_STYLES = {
  Legitimate: "text-emerald-600",
  Fraud: "text-red-600",
};

function SummaryTile({ label, value, valueClassName }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold ${valueClassName || "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

export default function RiskSummaryGrid({
  riskScore,
  fraudProbability,
  riskLevel,
  prediction,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryTile
          label="Risk Score"
          value={
              typeof riskScore === "number"
                  ? riskScore.toFixed(2)
                  : riskScore
          }
      />
      <SummaryTile
        label="Fraud Probability"
        value={
          typeof fraudProbability === "number"
            ? `${(fraudProbability * 100).toFixed(1)}%`
            : fraudProbability
        }
      />
      <SummaryTile
        label="Risk Level"
        value={riskLevel}
        valueClassName={RISK_LEVEL_STYLES[riskLevel] || "text-slate-900"}
      />
      <SummaryTile
        label="Prediction"
        value={prediction}
        valueClassName={PREDICTION_STYLES[prediction] || "text-slate-900"}
      />
    </div>
  );
}
