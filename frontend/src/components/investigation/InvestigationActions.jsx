import React from "react";
import { Lock, TriangleAlert, CheckCircle2 } from "lucide-react";

export default function InvestigationActions({
  caseStatus,
  onFreeze,
  onEscalate,
  onClose,
}) {
  const isFrozen = caseStatus === "Frozen";
  const isEscalated = caseStatus === "Escalated";
  const isClosed = caseStatus === "Closed";

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">
        Actions
      </h3>

      <div className="mt-4 flex flex-wrap gap-3">

        {/* Freeze */}
        <button
          type="button"
          onClick={onFreeze}
          disabled={isFrozen || isClosed}
          className={[
            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
            isFrozen
              ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
              : isClosed
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-red-600 text-white hover:bg-red-700",
          ].join(" ")}
        >
          <Lock className="h-4 w-4" strokeWidth={2} />

          {isFrozen
            ? "Account Frozen"
            : "Freeze Account"}
        </button>

        {/* Escalate */}
        <button
          type="button"
          onClick={onEscalate}
          disabled={isEscalated || isClosed}
          className={[
            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
            isEscalated
              ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
              : isClosed
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-amber-500 text-white hover:bg-amber-600",
          ].join(" ")}
        >
          <TriangleAlert className="h-4 w-4" strokeWidth={2} />

          {isEscalated
            ? "Case Escalated"
            : "Escalate Case"}
        </button>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          disabled={isClosed}
          className={[
            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
            isClosed
              ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          ].join(" ")}
        >
          <CheckCircle2 className="h-4 w-4" strokeWidth={2} />

          {isClosed
            ? "Investigation Closed"
            : "Close Investigation"}
        </button>

      </div>
    </div>
  );
}