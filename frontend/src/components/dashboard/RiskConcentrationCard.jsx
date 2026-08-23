import React from "react";
import { TrendingUp } from "lucide-react";

export default function RiskConcentrationCard({ data }) {
  if (!data?.available || !data?.signals?.length) {
    return null;
  }

  const signals = [...data.signals]
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 3);

  const status = data.status || "Unavailable";

  const statusStyles =
    status === "Elevated"
      ? "bg-red-50 text-red-600 border-red-100"
      : status === "Moderate"
      ? "bg-amber-50 text-amber-600 border-amber-100"
      : "bg-emerald-50 text-emerald-600 border-emerald-100";

  const formatName = (name) =>
    name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp
              className="h-5 w-5 text-blue-600"
              strokeWidth={2}
            />

            <h2 className="text-lg font-semibold text-slate-900">
              Risk Concentration Intelligence
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Behavioral signals disproportionately concentrated among
            High/Critical transactions.
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div>
          <p className="text-2xl font-semibold text-slate-900">
            {Number(data.high_risk_count || 0).toLocaleString()}
          </p>

          <p className="text-xs text-slate-500">
            High/Critical cases analyzed
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {signals.map((signal) => {
          const overall = Number(signal.overall_rate || 0);
          const highRisk = Number(signal.high_risk_rate || 0);
          const difference = Number(signal.difference || 0);

          return (
            <div key={signal.dimension}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">
                  {formatName(signal.dimension)}
                </p>

                <span
                  className={[
                    "text-xs font-semibold",
                    difference > 0
                      ? "text-red-600"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  {difference > 0 ? "+" : ""}
                  {difference.toFixed(2)} pp
                </span>
              </div>

              <div className="mt-2 space-y-2">
                <div>
                  <div className="mb-1 flex justify-between text-[11px] text-slate-400">
                    <span>Overall dataset</span>
                    <span>{overall.toFixed(2)}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-500"
                      style={{
                        width: `${Math.min(overall, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                    <span>High/Critical</span>
                    <span className="font-semibold text-slate-700">
                      {highRisk.toFixed(2)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{
                        width: `${Math.min(highRisk, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-xs font-semibold text-blue-800">
          Key finding
        </p>

        <p className="mt-1 text-xs leading-5 text-blue-700">
          {signals[0]
            ? `${formatName(
                signals[0].dimension
              )} shows the strongest concentration among High/Critical cases, with a ${Math.abs(
                Number(signals[0].difference || 0)
              ).toFixed(2)} percentage-point difference from the overall dataset.`
            : data.evidence}
        </p>
      </div>

      <p className="mt-3 text-[10px] leading-4 text-slate-400">
        Concentration compares behavioral signal activation in
        High/Critical transactions against the overall dataset.
      </p>
    </section>
  );
}