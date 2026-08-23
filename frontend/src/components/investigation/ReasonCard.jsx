import React from "react";
import { ListChecks } from "lucide-react";

export default function ReasonCard({ reasons = [] }) {
  const reasonList =
  typeof reasons === "string"
    ? reasons
        .split(". ")
        .map((reason) => reason.trim())
        .filter(Boolean)
    : reasons;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-blue-600" strokeWidth={2} />
        <h2 className="text-sm font-semibold text-slate-800">
          Risk Assessment
        </h2>
      </div>

      {reasonList.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No additional assessment available.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {reasonList.map((reason, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2.5"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-600">
                  {reason.endsWith(".") ? reason : `${reason}.`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
