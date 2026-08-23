import React from "react";
import { useNavigate } from "react-router-dom";

const PREDICTION_STYLES = {
  Legitimate: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Fraud: "bg-red-50 text-red-700 border-red-200",
};

const RISK_STYLES = {
  Safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
};

function Badge({ label, styleMap }) {
  const classes =
    styleMap[label] || "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}

export default function TransactionRow({ transaction }) {
  const navigate = useNavigate();
  const {
    transaction_id,
    prediction,
    risk_level,
    confidence,
    fraud_probability,
    recommended_action,
    needs_investigation,
} = transaction;

  const canInvestigate =
      needs_investigation === undefined
          ? true
          : needs_investigation;

  return (
    <tr className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50">
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-700">
        {transaction_id}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Badge
        label={prediction === 1 ? "Fraud" : "Legitimate"}
        styleMap={PREDICTION_STYLES}
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Badge label={risk_level} styleMap={RISK_STYLES} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
        {typeof confidence === "number"
            ? `${confidence.toFixed(1)}%`
            : typeof fraud_probability === "number"
            ? `${(fraud_probability * 100).toFixed(1)}%`
            : "—"}
      </td>
      <td className="px-6 py-4">
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                recommended_action.includes("Approve")
                    ? "bg-green-50 text-green-700"
                    : recommended_action.includes("Review")
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-red-50 text-red-700"
            }`}
        >
            {recommended_action}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <button
            type="button"
            onClick={() => {
                if (canInvestigate) {
                    navigate(`/investigation/${transaction_id}`, {
                        state: { from: "dashboard" },
                    });
                }
            }}
            className={[
                "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
                canInvestigate
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-100 text-slate-600",
            ].join(" ")}
        >
            {canInvestigate ? "View Details" : "No Investigation"}
        </button>
      </td>
    </tr>
  );
}