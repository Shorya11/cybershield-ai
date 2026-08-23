import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

import InvestigationHeader from "../components/investigation/InvestigationHeader";
import RiskSummaryGrid from "../components/investigation/RiskSummaryGrid";
import ReasonCard from "../components/investigation/ReasonCard";
import ExplainabilityCard from "../components/investigation/ExplainabilityCard";
import GraphSummaryCard from "../components/investigation/GraphSummaryCard";
import RecommendedActionCard from "../components/investigation/RecommendedActionCard";
import InvestigationActions from "../components/investigation/InvestigationActions";
import BehavioralAssessmentCard from "../components/investigation/BehavioralAssessmentCard";

export default function Investigation() {
  
  const navigate = useNavigate();
  const location = useLocation();

  const { transactionId } = useParams();

  const [investigation, setInvestigation] = useState(null);
  const [loadingInvestigation, setLoadingInvestigation] = useState(false);
  const [investigationError, setInvestigationError] = useState(null);

  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("priority");

  useEffect(() => {
    if (!transactionId) return;

    const fetchInvestigation = async () => {
        setLoadingInvestigation(true);
        setInvestigationError(null);

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/investigation/${transactionId}`
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                throw new Error(
                    errorData.detail ||
                    `Investigation request failed with status ${response.status}`
                );
            }

            const data = await response.json();

            setInvestigation(data.investigation);
        } catch (error) {
            console.error("Investigation fetch failed:", error);
            setInvestigationError(error.message);
        } finally {
            setLoadingInvestigation(false);
        }
    };

    fetchInvestigation();
  }, [transactionId]);

  const handleBack = () => {
    if (location.state?.from === "investigations") {
        navigate("/investigation");
        return;
    }

    navigate("/");
    };

  const backLabel =
    location.state?.from === "investigations"
        ? "Back to Investigations"
        : "Back to Dashboard";

  const { dashboardData, caseStatuses, updateCaseStatus, } = useDashboard();

  const getPriorityScore = (item) => {
    const riskScore = Math.min(
      Math.max(Number(item.risk_score ?? 0), 0),
      100
    );

    const fraudProbability =
      Math.min(
        Math.max(Number(item.fraud_probability ?? 0), 0),
        1
      ) * 100;

    const riskLevelWeight = {
      Critical: 20,
      High: 10,
      Medium: 5,
      Low: 0,
    };

    const levelWeight =
      riskLevelWeight[item.risk_level] ?? 0;

    return Math.min(
      100,
      riskScore * 0.6 +
        fraudProbability * 0.2 +
        levelWeight
    );
  };
  
  const prioritizedInvestigations = useMemo(() => {
    const investigations =
      dashboardData?.investigations || [];

    const filtered = investigations.filter((item) => {
      const riskMatches =
        riskFilter === "All" ||
        item.risk_level === riskFilter;

      const currentStatus =
        caseStatuses[item.transaction_id] || "Open";

      const statusMatches =
        statusFilter === "All" ||
        currentStatus === statusFilter;

      return riskMatches && statusMatches;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "risk_score") {
        return (
          Number(b.risk_score ?? 0) -
          Number(a.risk_score ?? 0)
        );
      }

      if (sortBy === "fraud_probability") {
        return (
          Number(b.fraud_probability ?? 0) -
          Number(a.fraud_probability ?? 0)
        );
      }

      return (
        getPriorityScore(b) -
        getPriorityScore(a)
      );
    });
  }, [
    dashboardData,
    caseStatuses,
    riskFilter,
    statusFilter,
    sortBy,
  ]);

  if (!transactionId) {
    const investigations = dashboardData?.investigations || [];

    if (!dashboardData) {
        return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <div>
            <h1 className="text-2xl font-semibold text-slate-900">
                Investigation Center
            </h1>

            <p className="mt-1 text-sm text-slate-500">
                Review AI-generated investigations from the uploaded dataset.
            </p>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-700">
                No dataset uploaded yet.
            </p>

            <p className="mt-2 text-sm text-slate-400">
                Upload a transaction CSV from the Dashboard to generate
                investigations.
            </p>

            <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
                Go to Dashboard
            </button>
            </div>
        </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
            <h1 className="text-2xl font-semibold text-slate-900">
            Investigation Center
            </h1>

            <p className="mt-1 text-sm text-slate-500">
            Review AI-generated investigations from the current dataset.
            </p>
        </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                <h2 className="text-base font-semibold text-slate-900">
                    Investigation Priority Queue
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                    {prioritizedInvestigations.length} cases currently match
                    the selected filters.
                </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-400"
                >
                    <option value="All">All Risk Levels</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-400"
                >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Closed">Closed</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-400"
                >
                    <option value="priority">
                    Priority
                    </option>
                    <option value="risk_score">
                    Risk Score
                    </option>
                    <option value="fraud_probability">
                    Fraud Probability
                    </option>
                </select>
                </div>
            </div>
            </div>

            <div className="divide-y divide-slate-100">
            {prioritizedInvestigations.length === 0 ? (
                <div className="px-5 py-12 text-center">
                <p className="text-sm font-semibold text-slate-700">
                    No investigations match these filters.
                </p>

                <button
                    type="button"
                    onClick={() => {
                    setRiskFilter("All");
                    setStatusFilter("All");
                    }}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                    Clear filters
                </button>
                </div>
            ) : (
                prioritizedInvestigations.map((item) => {
                const currentStatus =
                    caseStatuses[item.transaction_id] || "Open";

                const priority = getPriorityScore(item);

                const riskStyles =
                    item.risk_level === "Critical"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : item.risk_level === "High"
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-slate-50 text-slate-600 border-slate-200";

                const statusStyles =
                    currentStatus === "Escalated"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : currentStatus === "Frozen"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : currentStatus === "Closed"
                    ? "bg-slate-100 text-slate-500 border-slate-200"
                    : "bg-blue-50 text-blue-700 border-blue-200";

                return (
                    <div
                    key={item.transaction_id}
                    className="px-5 py-4 transition-colors hover:bg-slate-50"
                    >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono text-sm font-semibold text-slate-800">
                            {item.transaction_id}
                            </p>

                            <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${riskStyles}`}
                            >
                            {item.risk_level}
                            </span>

                            <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyles}`}
                            >
                            {currentStatus}
                            </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>
                            Risk Score:{" "}
                            <span className="font-semibold text-slate-700">
                                {Number(item.risk_score ?? 0).toFixed(2)}
                            </span>
                            </span>

                            <span>
                            Fraud Probability:{" "}
                            <span className="font-semibold text-slate-700">
                                {(Number(item.fraud_probability ?? 0) * 100).toFixed(2)}%
                            </span>
                            </span>

                            <span>
                            Prediction:{" "}
                            <span
                                className={
                                item.prediction === 1
                                    ? "font-semibold text-red-600"
                                    : "font-semibold text-emerald-600"
                                }
                            >
                                {item.prediction === 1
                                ? "Fraud"
                                : "Legitimate"}
                            </span>
                            </span>
                        </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                            Priority
                            </p>

                            <p className="text-lg font-semibold text-slate-900">
                            {priority.toFixed(0)}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                            navigate(
                                `/investigation/${item.transaction_id}`,
                                {
                                state: {
                                    from: "investigations",
                                },
                                }
                            )
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            Investigate
                        </button>
                        </div>
                    </div>
                    </div>
                );
                })
            )}
            </div>
        </div>
      </div>
    );
  }


  const caseStatus = caseStatuses[transactionId] || "Open";

  const handleFreeze = () => {
      updateCaseStatus(transactionId, "Frozen");
  };

  const handleEscalate = () => {
      updateCaseStatus(transactionId, "Escalated");
  };

  const handleClose = () => {
      updateCaseStatus(transactionId, "Closed");
  };

  console.log("URL Transaction ID:", transactionId);
  console.log(
      "Investigation Count:",
      dashboardData?.investigations?.length
  );
  console.log(
      "First Investigation:",
      dashboardData?.investigations?.[0]
  );

  if (loadingInvestigation) {
    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                    Loading investigation...
                </p>

                <p className="mt-2 text-sm text-slate-400">
                    Fetching real investigation data for{" "}
                    <span className="font-mono">{transactionId}</span>.
                </p>
            </div>
        </div>
    );
  }

  if (investigationError) {
    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm">
                <p className="text-sm font-semibold text-red-700">
                    Investigation unavailable
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    {investigationError}
                </p>

                <button
                    type="button"
                    onClick={handleBack}
                    className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    {backLabel}
                </button>
            </div>
        </div>
    );
  }

  if (!investigation) {
      return (
          <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
              <h1 className="text-xl font-semibold text-slate-900">
                  Investigation Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                  No investigation data was found for transaction{" "}
                  <span className="font-mono">{transactionId}</span>.
              </p>

              <button
                  type="button"
                  onClick={handleBack}
                  className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                  {backLabel}
              </button>
          </div>
      );
  }
    
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <InvestigationHeader
        transactionId={investigation.transaction_id}
        onBack={handleBack}
        backLabel={backLabel}
      />

      <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                  Case Status
              </span>

              <span
                  className={[
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      caseStatus === "Open"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : caseStatus === "Frozen"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : caseStatus === "Escalated"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-slate-100 text-slate-700",
                  ].join(" ")}
              >
                  {caseStatus}
              </span>
          </div>
      </div>

      <div className="space-y-6">
        <RiskSummaryGrid
            riskScore={investigation.risk_score}
            fraudProbability={investigation.fraud_probability}
            riskLevel={investigation.risk_level}
            prediction={
                investigation.prediction === 1
                    ? "Fraud"
                    : "Legitimate"
            }
        />

        <ReasonCard reasons={investigation.reasons} />

        <ExplainabilityCard
            explainability={investigation.explainability}
        />

        <BehavioralAssessmentCard
            behavioralAssessment={
                investigation.behavioral_assessment
            }
        />

        <GraphSummaryCard
            networkIntelligence={investigation.network_intelligence}
        />

        <RecommendedActionCard
            action={investigation.recommended_action}
        />

        <InvestigationActions
            caseStatus={caseStatus}
            onFreeze={handleFreeze}
            onEscalate={handleEscalate}
            onClose={handleClose}
        />
      </div>
    </div>
  );
}
