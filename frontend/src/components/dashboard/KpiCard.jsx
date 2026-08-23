import React from "react";

export default function KpiCard({ title, value, description, icon: Icon, iconColor }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50"
          style={{ color: iconColor }}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </div>

      <p className="mt-4 text-4xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}