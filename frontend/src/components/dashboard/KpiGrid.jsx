import React from "react";
import { ReceiptText, ShieldAlert, TriangleAlert, ShieldCheck } from "lucide-react";
import KpiCard from "./KpiCard";

export default function KpiGrid({ summary }) {

  const kpis = [
    {
      title: "Total Transactions",
      value: summary
        ? summary.total_transactions.toLocaleString()
        : "—",
      description: summary ? "Uploaded CSV" : "No dataset loaded",
      icon: ReceiptText,
      iconColor: "#2563eb",
    },
    {
      title: "Fraud Detected",
      value: summary
        ? summary.fraud_detected.toLocaleString()
        : "—",
      description: summary ? "ML Predictions" : "No dataset loaded",
      icon: ShieldAlert,
      iconColor: "#dc2626",
    },
    {
      title: "High Risk Cases",
      value: summary
        ? summary.high_risk_cases.toLocaleString()
        : "—",
      description: summary ? "Requires Review" : "No dataset loaded",
      icon: TriangleAlert,
      iconColor: "#d97706",
    },
    {
      title: "Investigation Required",
      value: summary
        ? summary.high_risk_cases.toLocaleString()
        : "—",
      description: summary ? "Ready For Investigation" : "No dataset loaded",
      icon: ShieldCheck,
      iconColor: "#059669",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}