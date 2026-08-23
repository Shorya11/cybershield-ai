import { useDashboard } from "../context/DashboardContext";

import DashboardHero from "../components/dashboard/DashboardHero";
import KpiGrid from "../components/dashboard/KpiGrid";
import RiskConcentrationCard from "../components/dashboard/RiskConcentrationCard";
import UploadCard from "../components/upload/UploadCard";
import TransactionTable from "../components/transactions/TransactionTable";
import { uploadCsv } from "../services/uploadService";

import { useState } from "react";

function Dashboard() {

  const {
    dashboardData,
    setDashboardData,
    isProcessing,
    setIsProcessing,
    uploadError,
    setUploadError,
  } = useDashboard();

  const [showAllInvestigations, setShowAllInvestigations] = useState(false);

  const handleUpload = async (file) => {
    try {
        console.log("Uploading:", file.name);

        setIsProcessing(true);
        setUploadError(null);

        const response = await uploadCsv(file);

        console.log("Backend Response:", response);

        if (!response?.success) {
        throw new Error("Dataset processing failed.");
        }

        setDashboardData({
        ...response,
        uploadTime: new Date().toISOString(),
        });

        console.log("Dashboard Data:", response);

        alert("Dataset uploaded successfully!");
    } catch (error) {
        console.error("Upload Error:", error);

        if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        }

        setUploadError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to process the uploaded dataset."
        );

        alert("Upload failed.");
    } finally {
        setIsProcessing(false);
    }
  };

  const investigations = dashboardData?.investigations || [];

  const visibleInvestigations = showAllInvestigations
      ? investigations
      : investigations.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {uploadError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
            <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-semibold text-red-700">
                Dataset processing failed
                </p>

                <p className="mt-1 text-sm text-red-600">
                {uploadError}
                </p>

                <p className="mt-1 text-xs text-red-500">
                Please check the CSV format and try uploading again.
                </p>
            </div>

            <button
                type="button"
                onClick={() => setUploadError(null)}
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
            >
                Dismiss
            </button>
            </div>
        </div>
        )}
      <DashboardHero />
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Real-time summary of the uploaded transaction dataset.
        </p>
      </div>
      <KpiGrid summary={dashboardData?.summary} />
      <UploadCard 
      onUpload={handleUpload}
      dashboardData={dashboardData}
      />
      <RiskConcentrationCard
        data={dashboardData?.behavioral_intelligence?.risk_concentration}
        />
      <div>
        <div 
        id="high-risk-transactions"
        className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
                High-Risk Transactions
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                Transactions flagged by the AI model for investigation.
            </p>

            <p className="mt-1 text-xs text-slate-400">
                Showing {dashboardData?.investigations?.length || 0} flagged cases
            </p>
        </div>

        <div className="mt-6">
            <TransactionTable
                transactions={visibleInvestigations}
            />
        </div>

        {investigations.length > 5 && (
            <div className="mt-5 flex justify-center">
                <button
                    type="button"
                    onClick={() =>
                        setShowAllInvestigations((prev) => !prev)
                    }
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                    {showAllInvestigations
                        ? "Show Less"
                        : `Show All ${investigations.length} Cases`}
                </button>
            </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;