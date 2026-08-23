import React from "react";
import {
  ShieldCheck,
  Upload,
  Search,
  TrendingUp,
  Network,
  AlertTriangle,
} from "lucide-react";

export default function DashboardHero() {
  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 md:p-12">
      <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between">
        {/* Left: copy + actions */}
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            Financial Crime Investigation Dashboard
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            AI-powered transaction monitoring, fraud detection, and network
            investigation for suspicious banking transactions.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button 
            type="button"
            onClick={() => {
              document
                .getElementById("upload-dataset")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              <Upload className="h-4 w-4" strokeWidth={2} />
              Upload Dataset
            </button>
            <button 
            type="button"
            onClick={() => {
              document
                .getElementById("high-risk-transactions")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              <Search className="h-4 w-4" strokeWidth={2} />
              View Investigations
            </button>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="relative flex h-56 w-56 shrink-0 items-center justify-center md:h-64 md:w-64">
          <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-blue-600 md:h-40 md:w-40">
            <ShieldCheck className="h-16 w-16 text-white md:h-20 md:w-20" strokeWidth={1.75} />
          </div>

          {/* Stat badges */}
          <div className="absolute left-0 top-2 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />
            <span className="text-[11px] font-semibold text-slate-700">ML-Powered Detection </span>
          </div>

          <div className="absolute right-0 top-8 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
            <Network className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
            <span className="text-[11px] font-semibold text-slate-700">Entity Network</span>
          </div>

          <div className="absolute bottom-0 left-4 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} />
            <span className="text-[11px] font-semibold text-slate-700">Fraud Investigation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
