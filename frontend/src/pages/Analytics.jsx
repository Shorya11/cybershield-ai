import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import {
  Activity,
  ReceiptText,
  ShieldAlert,
  Percent,
  TriangleAlert,
  Gauge,
  ShieldCheck,
  Shield,
  Database,
  Search,
  PieChart,
  BarChart3,
  LayoutGrid,
  ArrowRight,
  Ban,
  Eye,
  CheckCircle2,
  HelpCircle,
  Share2,
  GitBranch,
} from "lucide-react";

function Analytics() {
  const {
    dashboardData,
    isProcessing,
    uploadError,
  } = useDashboard();
  const navigate = useNavigate();

  const [modelDrivers, setModelDrivers] = useState(null);
  const [modelDriversLoading, setModelDriversLoading] = useState(false);
  const [modelDriversError, setModelDriversError] = useState(null);

  useEffect(() => {
    if (!dashboardData || isProcessing) return;

    const fetchModelDrivers = async () => {
      setModelDriversLoading(true);
      setModelDriversError(null);

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/analytics/model-drivers"
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          throw new Error(
            errorData.detail ||
              `Model driver request failed with status ${response.status}`
          );
        }

        const data = await response.json();

        setModelDrivers(data);
      } catch (error) {
        console.error("Model risk drivers fetch failed:", error);
        setModelDriversError(error.message);
      } finally {
        setModelDriversLoading(false);
      }
    };

    fetchModelDrivers();
  }, [dashboardData, isProcessing]);

  const analytics = useMemo(() => {
    const summary = dashboardData?.summary;
    const investigations = dashboardData?.investigations || [];

    const behavioralIntelligence =
      dashboardData?.behavioral_intelligence || {};

    const totalTransactions = summary?.total_transactions || 0;

    const fraudDetected = summary?.fraud_detected || 0;

    const highRiskCases = summary?.high_risk_cases || 0;

    const fraudRate =
      totalTransactions > 0
        ? (fraudDetected / totalTransactions) * 100
        : 0;

    const averageRiskScore =
      investigations.length > 0
        ? investigations.reduce(
            (total, item) => total + (Number(item.risk_score) || 0),
            0
          ) / investigations.length
        : 0;

    const averageFraudProbability =
      investigations.length > 0
        ? investigations.reduce(
            (total, item) =>
              total + (Number(item.fraud_probability) || 0),
            0
          ) / investigations.length
        : 0;

    const investigationCount = investigations.length;

    // ---- STEP 2: Prediction Distribution -----------------------------
    // Official counts come from summary, NOT from investigations.
    const legitimateCount = Math.max(totalTransactions - fraudDetected, 0);

    const fraudPercentage =
      totalTransactions > 0 ? (fraudDetected / totalTransactions) * 100 : 0;

    const legitimatePercentage =
      totalTransactions > 0
        ? (legitimateCount / totalTransactions) * 100
        : 0;

    // ---- STEP 2: Risk Level Distribution ------------------------------
    // Counted from investigations, denominator is investigationCount.
    const riskLevelCounts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Safe: 0,
    };

    investigations.forEach((item) => {
      const level = item.risk_level;
      if (Object.prototype.hasOwnProperty.call(riskLevelCounts, level)) {
        riskLevelCounts[level] += 1;
      }
    });

    const riskLevelDistribution = Object.entries(riskLevelCounts).map(
      ([level, count]) => ({
        level,
        count,
        percentage:
          investigationCount > 0 ? (count / investigationCount) * 100 : 0,
      })
    );

    // ---- STEP 3: Investigation Intelligence ---------------------------
    const criticalCaseCount = investigations.filter(
      (item) => item.risk_level === "Critical"
    ).length;

    const recommendedActionCounts = {};

    investigations.forEach((item) => {
      const action = item.recommended_action;

      if (!action) return;

      recommendedActionCounts[action] =
        (recommendedActionCounts[action] || 0) + 1;
    });

    const riskSignalCounts = {};

    investigations.forEach((item) => {
      const reasons = item.reasons;

      if (!reasons) return;

      const reasonList = Array.isArray(reasons)
        ? reasons
        : [reasons];

      reasonList.forEach((reason) => {
        if (!reason) return;

        const normalizedReason = String(reason).trim();

        if (!normalizedReason) return;

        riskSignalCounts[normalizedReason] =
          (riskSignalCounts[normalizedReason] || 0) + 1;
      });
    });

    const riskSignalList = Object.entries(riskSignalCounts)
      .map(([signal, count]) => ({
        signal,
        count,
        percentage:
          investigationCount > 0
            ? (count / investigationCount) * 100
            : 0,
      }))
      .sort((a, b) => b.count - a.count);


    const recommendedActionList = Object.entries(recommendedActionCounts)
      .map(([action, count]) => ({
        action,
        count,
        percentage:
          investigationCount > 0 ? (count / investigationCount) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalTransactions,
      fraudDetected,
      highRiskCases,
      fraudRate,
      averageRiskScore,
      averageFraudProbability,
      investigationCount,
      legitimateCount,
      fraudPercentage,
      legitimatePercentage,
      riskLevelDistribution,
      criticalCaseCount,
      recommendedActionCounts,
      recommendedActionList,
      riskSignalList,
      behavioralIntelligence,
    };
  }, [dashboardData]);

  console.log("Analytics Data:", analytics);
  console.log(
    "First Investigation:",
    dashboardData?.investigations?.[0]
  );
  console.log("Risk Signal List:", analytics.riskSignalList);

  if (isProcessing) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Behavioral risk intelligence from the uploaded transaction dataset.
          </p>
        </div>

        {/* Processing State */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
          <div className="mx-auto flex max-w-md flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <BarChart3
                className="h-6 w-6 animate-pulse text-blue-600"
                strokeWidth={2}
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-800">
              Analyzing Dataset...
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your transaction data is being processed by the AI fraud
              detection pipeline. Analytics will appear once processing is
              complete.
            </p>

            <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Detecting suspicious activity and building investigation insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Behavioral risk intelligence from the uploaded transaction dataset.
          </p>
        </div>

        {/* Empty State */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            No dataset uploaded yet.
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Upload a transaction CSV from the Dashboard to generate analytics.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const fraudRatePct = Math.min(Math.max(analytics.fraudRate, 0), 100);

  const investigationLoadPct =
    analytics.totalTransactions > 0
      ? Math.min(
          Math.max(
            (analytics.highRiskCases / analytics.totalTransactions) * 100,
            0
          ),
          100
        )
      : 0;

  const fraudProbabilityPct = Math.min(
    Math.max(analytics.averageFraudProbability * 100, 0),
    100
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Behavioral risk intelligence from the uploaded transaction dataset.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <Activity className="h-4 w-4 text-blue-600" strokeWidth={2} />
          <span className="text-xs font-semibold text-slate-700">
            AI Risk Intelligence
          </span>
        </div>
      </div>

      {/* 2. EXECUTIVE RISK OVERVIEW */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          Executive Risk Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiTile
            icon={ReceiptText}
            label="Total Transactions"
            value={analytics.totalTransactions.toLocaleString()}
            description="Analyzed in dataset"
            tone="blue"
          />
          <KpiTile
            icon={ShieldAlert}
            label="Fraud Detected"
            value={analytics.fraudDetected.toLocaleString()}
            description="Flagged by model"
            tone="red"
          />
          <KpiTile
            icon={Percent}
            label="Fraud Rate"
            value={`${analytics.fraudRate.toFixed(2)}%`}
            description="Of total transactions"
            tone="red"
          />
          <KpiTile
            icon={TriangleAlert}
            label="High Risk Cases"
            value={analytics.highRiskCases.toLocaleString()}
            description="Requires review"
            tone="amber"
          />
        </div>
      </div>

      {/* 3. RISK INTELLIGENCE SUMMARY */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          Risk Intelligence Summary
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <KpiTile
            icon={Gauge}
            label="Average Risk Score"
            value={analytics.averageRiskScore.toFixed(2)}
            description={`Across ${analytics.investigationCount} flagged cases`}
            tone="blue"
          />
          <KpiTile
            icon={ShieldCheck}
            label="Average Fraud Probability"
            value={`${(analytics.averageFraudProbability * 100).toFixed(2)}%`}
            description={`Across ${analytics.investigationCount} flagged cases`}
            tone="blue"
          />
        </div>
      </div>

      {/* 4. RISK POSTURE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Risk Posture
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Current risk profile of the analyzed transaction dataset.
        </p>

        <div className="mt-6 space-y-6">
          <PostureBar
            label="Fraud Exposure"
            valueLabel={`${analytics.fraudRate.toFixed(2)}%`}
            widthPct={fraudRatePct}
            tone="red"
          />
          <PostureBar
            label="High-Risk Investigation Load"
            valueLabel={`${analytics.highRiskCases.toLocaleString()} cases`}
            widthPct={investigationLoadPct}
            tone="amber"
          />
          <PostureBar
            label="Average Fraud Probability"
            valueLabel={`${(analytics.averageFraudProbability * 100).toFixed(2)}%`}
            widthPct={fraudProbabilityPct}
            tone="blue"
          />
        </div>
      </div>

      {/* 5. RISK DISTRIBUTION */}
      <div>
        <h2 className="mb-1 text-sm font-semibold text-slate-800">
          Risk Distribution
        </h2>
        <p className="mb-3 text-xs text-slate-400">
          Distribution of model predictions and risk levels across the
          analyzed dataset.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Card 1 — Prediction Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-blue-600" strokeWidth={2} />
              <h3 className="text-sm font-semibold text-slate-800">
                Prediction Distribution
              </h3>
            </div>

            <div className="mt-5 space-y-5">
              <DistributionBar
                label="Fraud"
                count={analytics.fraudDetected}
                percentage={analytics.fraudPercentage}
                tone="red"
              />
              <DistributionBar
                label="Legitimate"
                count={analytics.legitimateCount}
                percentage={analytics.legitimatePercentage}
                tone="slate"
              />
            </div>
          </div>

          {/* Card 2 — Risk Level Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-blue-600" strokeWidth={2} />
              <h3 className="text-sm font-semibold text-slate-800">
                Risk Level Distribution
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Risk classification across flagged investigation cases.
            </p>

            <div className="mt-5 space-y-5">
              {analytics.riskLevelDistribution.map(
                ({ level, count, percentage }) => (
                  <DistributionBar
                    key={level}
                    label={level}
                    count={count}
                    percentage={percentage}
                    tone={RISK_LEVEL_TONE[level]}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6. ARGUS BEHAVIORAL INTELLIGENCE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Activity
            className="h-4 w-4 text-blue-600"
            strokeWidth={2}
          />

          <h2 className="text-base font-semibold text-slate-900">
            ARGUS Behavioral Intelligence
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Behavioral dimensions used to identify abnormal transaction
          and account activity patterns.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              key: "transaction_velocity",
              title: "Transaction Velocity",
              description:
                "Detects unusual frequency or rapid transaction activity.",
            },
            {
              key: "fund_flow",
              title: "Fund Flow Patterns",
              description:
                "Identifies abnormal movement and dispersion of funds.",
            },
            {
              key: "counterparty_signals",
              title: "Sender / Receiver Diversity",
              description:
                "Examines counterparty-related behavioural signals available in the dataset.",
            },
            {
              key: "activity_shifts",
              title: "Account Activity Shifts",
              description:
                "Highlights changes from expected account activity patterns.",
            },
            {
              key: "behavioral_deviations",
              title: "Behavioral Deviations",
              description:
                "Identifies abnormal changes from selected behavioural indicators.",
            },
            {
              key: "alert_correlation",
              title: "Alert Correlation",
              description:
                "Connects related risk signals across suspicious activity.",
            },
          ].map(({ key, title, description }) => (
            <BehavioralDimensionCard
              key={key}
              title={title}
              description={description}
              data={analytics.behavioralIntelligence?.[key]}
            />
          ))}
        </div>
      </div>      

      {/* 6A. BEHAVIORAL SIGNAL CONVERGENCE */}
      <BehavioralSignalConvergence
        data={analytics.behavioralIntelligence?.risk_propagation}
      />

      {/* 7. MODEL RISK DRIVERS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <GitBranch
            className="h-4 w-4 text-blue-600"
            strokeWidth={2}
          />

          <h2 className="text-base font-semibold text-slate-900">
            Model Risk Drivers
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          SHAP-based analysis of features contributing to fraud-risk
          predictions across suspicious transactions.
        </p>

        {modelDriversLoading ? (
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-600">
              Calculating model risk drivers...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Analyzing a representative sample of suspicious transactions.
            </p>
          </div>
        ) : modelDriversError ? (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              Model risk drivers unavailable
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              {modelDriversError}
            </p>
          </div>
        ) : !modelDrivers?.drivers?.length ? (
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-600">
              No model risk drivers available.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              No suspicious transactions were available for SHAP analysis.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                SHAP
              </span>

              <span className="text-xs text-slate-400">
                {modelDrivers.transactions_analyzed} suspicious transactions analyzed
              </span>
            </div>

            <div className="mt-5 space-y-5">
              {modelDrivers.drivers.map((driver) => {
                const importance = Number(driver.importance || 0);

                const maxImportance = Math.max(
                  ...modelDrivers.drivers.map(
                    (item) => Number(item.importance || 0)
                  ),
                  0.000001
                );

                const width =
                  (importance / maxImportance) * 100;

                return (
                  <div key={driver.feature}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          {driver.variable_name || driver.feature}
                        </p>

                        <p className="mt-0.5 text-xs leading-5 text-slate-500">
                          {driver.description ||
                            "Feature contribution identified by the model."}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          {importance.toFixed(4)}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          importance
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${width}%` }}
                      />
                    </div>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Contributed to {driver.transactions_contributing} analyzed
                      transaction
                      {driver.transactions_contributing === 1 ? "" : "s"}.
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 8. INVESTIGATION INTELLIGENCE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Investigation Intelligence
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          AI-generated overview of cases requiring investigator attention.
        </p>

        {analytics.investigationCount === 0 ? (
          <p className="mt-6 text-sm text-slate-400">
            No investigation cases available.
          </p>
        ) : (
          <>
            {/* Top summary tiles */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KpiTile
                icon={Search}
                label="Flagged Investigations"
                value={analytics.investigationCount.toLocaleString()}
                description="Cases requiring review"
                tone="blue"
              />
              <KpiTile
                icon={ShieldAlert}
                label="Critical Cases"
                value={analytics.criticalCaseCount.toLocaleString()}
                description="Highest risk classification"
                tone="red"
              />
              <KpiTile
                icon={Shield}
                label="Fraud Detected"
                value={analytics.fraudDetected.toLocaleString()}
                description="Dataset-level model predictions"
                tone="red"
              />
            </div>

            {/* Recommended Actions */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-800">
                Recommended Actions
              </h3>

              <div className="mt-4 space-y-4">
                {analytics.recommendedActionList.map(
                  ({ action, count, percentage }) => (
                    <RecommendedActionRow
                      key={action}
                      action={action}
                      count={count}
                      percentage={percentage}
                    />
                  )
                )}
              </div>
            </div>

            {/* View High-Risk Cases */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate("/transactions#high-risk-transactions")
                }
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                View High-Risk Cases
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* 9. NETWORK INTELLIGENCE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-blue-600" strokeWidth={2} />

          <h2 className="text-base font-semibold text-slate-900">
            Network Intelligence
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Relationship-level analysis for identifying connected suspicious
          entities and potential mule-account networks.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <Share2
                className="h-4 w-4 text-blue-600"
                strokeWidth={2}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Relationship data unavailable
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                The supplied transaction dataset does not contain explicit
                account-to-account entity relationships required for reliable
                network traversal.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">
                Current capability
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Behavioral and counterparty signals from available features.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">
                Required data
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Explicit sender, receiver, account or entity relationships.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">
                Future analysis
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Multi-hop fund-flow and suspicious-network traversal.
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/investigation")}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Explore Investigations
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* 10. DATASET INTELLIGENCE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-600" strokeWidth={2} />
          <h2 className="text-base font-semibold text-slate-900">
            Dataset Intelligence
          </h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Investigation workload summary for the current dataset.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DataStat
            icon={ReceiptText}
            label="Analyzed Transactions"
            value={analytics.totalTransactions.toLocaleString()}
          />

          <DataStat
            icon={ShieldAlert}
            label="Detected Fraud"
            value={analytics.fraudDetected.toLocaleString()}
          />

          <DataStat
            icon={TriangleAlert}
            label="High Risk Cases"
            value={analytics.highRiskCases.toLocaleString()}
          />

          <DataStat
            icon={Search}
            label="Flagged Investigations"
            value={analytics.investigationCount.toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Presentational helpers (UI only — no data logic)                  */
/* ---------------------------------------------------------------- */

const TONE_STYLES = {
  blue: { iconBg: "bg-blue-50", iconText: "text-blue-600" },
  red: { iconBg: "bg-red-50", iconText: "text-red-600" },
  amber: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
};

function KpiTile({ icon: Icon, label, value, description, tone = "blue" }) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.blue;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.iconBg}`}
      >
        <Icon className={`h-4 w-4 ${styles.iconText}`} strokeWidth={2} />
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

const BAR_TONE_STYLES = {
  red: "bg-red-500",
  amber: "bg-amber-500",
  blue: "bg-blue-600",
};

function PostureBar({ label, valueLabel, widthPct, tone = "blue" }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">
          {valueLabel}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${BAR_TONE_STYLES[tone]}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}

function DataStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
        <Icon
          className="h-4 w-4 text-blue-600"
          strokeWidth={2}
        />
      </div>

      <p className="mt-3 text-xl font-semibold text-slate-900">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

const RISK_LEVEL_TONE = {
  Critical: "red",
  High: "orange",
  Medium: "amber",
  Safe: "emerald",
};

const DISTRIBUTION_TONE_STYLES = {
  red: { bar: "bg-red-500", text: "text-red-600" },
  orange: { bar: "bg-orange-500", text: "text-orange-600" },
  amber: { bar: "bg-amber-500", text: "text-amber-600" },
  emerald: { bar: "bg-emerald-500", text: "text-emerald-600" },
  slate: { bar: "bg-slate-400", text: "text-slate-600" },
  blue: { bar: "bg-blue-600", text: "text-blue-600" },
};

function DistributionBar({ label, count, percentage, tone = "slate" }) {
  const styles = DISTRIBUTION_TONE_STYLES[tone] || DISTRIBUTION_TONE_STYLES.slate;
  const widthPct = Math.min(Math.max(percentage || 0, 0), 100);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-sm font-semibold ${styles.text}`}>
          {(count || 0).toLocaleString()}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {(percentage || 0).toFixed(2)}%
      </p>
    </div>
  );
}

const ACTION_TONE_STYLES = {
  red: { bar: "bg-red-500", text: "text-red-600", iconText: "text-red-600" },
  amber: {
    bar: "bg-amber-500",
    text: "text-amber-600",
    iconText: "text-amber-600",
  },
  emerald: {
    bar: "bg-emerald-500",
    text: "text-emerald-600",
    iconText: "text-emerald-600",
  },
  slate: {
    bar: "bg-slate-400",
    text: "text-slate-600",
    iconText: "text-slate-500",
  },
};

// Classifies an arbitrary backend-provided action string into a semantic
// tone/icon. Falls back to "slate"/HelpCircle for any action that doesn't
// match a known keyword, so unseen actions from other datasets still render.
function classifyAction(action) {
  const normalized = (action || "").toLowerCase();

  if (normalized.includes("block")) {
    return { tone: "red", icon: Ban };
  }
  if (normalized.includes("review")) {
    return { tone: "amber", icon: Eye };
  }
  if (normalized.includes("approve")) {
    return { tone: "emerald", icon: CheckCircle2 };
  }
  return { tone: "slate", icon: HelpCircle };
}

function RecommendedActionRow({ action, count, percentage }) {
  const { tone, icon: Icon } = classifyAction(action);
  const styles = ACTION_TONE_STYLES[tone];
  const widthPct = Math.min(Math.max(percentage || 0, 0), 100);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${styles.iconText}`} strokeWidth={2} />
          <span className="text-sm font-medium text-slate-700">
            {action}
          </span>
        </div>
        <span className={`text-sm font-semibold ${styles.text}`}>
          {count.toLocaleString()}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}

function FootprintStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xl font-semibold text-slate-900">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  );
}


function BehavioralDimensionCard({ title, description, data }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
          <Activity className="h-4 w-4 text-blue-600" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

            {data?.status && (
              <span
                className={[
                  "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                  data.status === "Elevated"
                    ? "bg-red-50 text-red-600"
                    : data.status === "Moderate"
                    ? "bg-amber-50 text-amber-600"
                    : data.status === "Low"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                {data.status}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>

          {data ? (
            <>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xl font-semibold text-slate-900">
                    {Number(data.signal_rate || 0).toFixed(2)}%
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Signal coverage
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium text-slate-600">
                    {data.features_analyzed?.length || 0}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Features analyzed
                  </p>
                </div>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={[
                    "h-full rounded-full",
                    data.status === "Elevated"
                      ? "bg-red-500"
                      : data.status === "Moderate"
                      ? "bg-amber-500"
                      : "bg-emerald-500",
                  ].join(" ")}
                  style={{
                    width: `${Math.min(
                      Math.max(Number(data.signal_rate || 0), 0),
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-[11px] leading-5 text-slate-400">
                {data.evidence}
              </p>

              {/* Feature Evidence */}
              {data.feature_details?.length > 0 && (
                <details className="mt-4 border-t border-slate-100 pt-3">
                  <summary className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700">
                    View indicators ({data.feature_details.length})
                  </summary>

                  <div className="mt-3 space-y-2">
                    {data.feature_details.map((feature) => (
                      <div
                        key={feature.feature}
                        className="rounded-lg bg-slate-50 px-3 py-2"
                      >
                        <p className="text-xs font-semibold text-slate-700">
                          {feature.variable_name || feature.feature}
                        </p>

                        {feature.description && (
                          <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </>
          ) : (
            <p className="mt-4 text-xs text-slate-400">
              Behavioral signal data unavailable.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function BehavioralSignalConvergence({ data }) {
  if (!data) {
    return null;
  }

  const convergenceRate = Math.min(
    Math.max(Number(data.propagation_rate || 0), 0),
    100
  );

  const activeFamilies = Number(
    data.signal_families_active || 0
  );

  const totalFamilies = Number(
    data.signal_families_total || 0
  );

  const averageFamilies = Number(
    data.average_active_families || 0
  );

  const maxFamilies = Number(
    data.max_active_families || 0
  );

  const status = data.status || "Unavailable";

  const statusStyles =
    status === "Elevated"
      ? "bg-red-50 text-red-600"
      : status === "Moderate"
      ? "bg-amber-50 text-amber-600"
      : status === "Low"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-slate-100 text-slate-500";

  const barColor =
    status === "Elevated"
      ? "bg-red-500"
      : status === "Moderate"
      ? "bg-amber-500"
      : status === "Low"
      ? "bg-emerald-500"
      : "bg-slate-400";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch
              className="h-4 w-4 text-blue-600"
              strokeWidth={2}
            />

            <h2 className="text-base font-semibold text-slate-900">
              Behavioral Signal Convergence
            </h2>
          </div>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Measures simultaneous activation of multiple behavioral
            risk-signal families across the analyzed transaction dataset.
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">
            {convergenceRate.toFixed(2)}%
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Convergence rate
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">
            {averageFamilies.toFixed(2)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Average active families
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">
            {activeFamilies} / {totalFamilies}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Signal families available
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Multi-signal convergence
          </span>

          <span className="text-sm font-semibold text-slate-900">
            {convergenceRate.toFixed(2)}%
          </span>
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{
              width: `${convergenceRate}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          {data.evidence}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-white p-4">
          <p className="text-xs font-semibold text-slate-700">
            Maximum observed convergence
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {maxFamilies} / {totalFamilies}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-slate-400">
            Highest number of behavioral signal families active
            within a single analyzed record.
          </p>
        </div>

        <div className="rounded-lg border border-slate-100 bg-white p-4">
          <p className="text-xs font-semibold text-slate-700">
            Interpretation
          </p>

          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Multiple behavioral risk dimensions are active
            simultaneously across the analyzed population.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-[11px] leading-5 text-blue-700">
          This indicates behavioral signal convergence, not confirmed
          account-to-account fund-flow relationships.
        </p>
      </div>
    </div>
  );
}

export default Analytics;
