import React from "react";
import { ShieldAlert } from "lucide-react";

export default function RecommendedActionCard({ action }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-blue-600" strokeWidth={2} />
        <h2 className="text-sm font-semibold text-slate-800">
          Recommended Action
        </h2>
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-sm font-semibold text-blue-700">
          {action || "No recommendation available."}
        </p>
      </div>
    </div>
  );
}
