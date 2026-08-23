import React from "react";
import { ArrowLeft } from "lucide-react";

export default function InvestigationHeader({ transactionId, onBack, backLabel = "Back to Dashboard", }) {
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        {backLabel}
      </button>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          Investigation Workspace
        </h1>
        <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
          Transaction ID: {transactionId}
        </span>
      </div>
    </div>
  );
}
