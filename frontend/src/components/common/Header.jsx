import React from "react";
import { Circle, Database, CalendarDays } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

export default function Header() {
  const { dashboardData } = useDashboard();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const backendStatus = "Connected";
  const datasetStatus = dashboardData ? "Loaded" : "Not Loaded";

  return (
    <header className="fixed top-0 left-80 right-0 z-30 flex h-24 items-center justify-end border-b border-slate-200 bg-white px-8">
      
      {/* System Status */}
      <div className="flex items-center gap-3">

        {/* Backend */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />

          <div className="leading-tight">
            <p className="text-[11px] font-medium text-slate-500">
              Backend
            </p>

            <p className="text-xs font-semibold text-emerald-600">
              {backendStatus}
            </p>
          </div>
        </div>

        {/* Dataset */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <Database
            className="h-4 w-4 text-slate-400"
            strokeWidth={2}
          />

          <div className="leading-tight">
            <p className="text-[11px] font-medium text-slate-500">
              Dataset
            </p>

            <p className="text-xs font-semibold text-slate-500">
              {datasetStatus}
            </p>
          </div>
        </div>

        {/* Today */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <CalendarDays
            className="h-4 w-4 text-slate-400"
            strokeWidth={2}
          />

          <div className="leading-tight">
            <p className="text-[11px] font-medium text-slate-500">
              Today
            </p>

            <p className="text-xs font-semibold text-slate-800">
              {today}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}