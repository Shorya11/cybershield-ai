import { createContext, useContext, useState, useEffect,} from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
    const [dashboardData, setDashboardData] = useState(() => {
      try {
          const saved = sessionStorage.getItem("cybershield_dashboard_data");

          return saved ? JSON.parse(saved) : null;
      } catch (error) {
          console.error("Failed to restore dashboard data:", error);
          return null;
      }
  });

  const [caseStatuses, setCaseStatuses] = useState({});

  // Dataset processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
      try {
          if (dashboardData) {
              sessionStorage.setItem(
                  "cybershield_dashboard_data",
                  JSON.stringify(dashboardData)
              );
          } else {
              sessionStorage.removeItem(
                  "cybershield_dashboard_data"
              );
          }
      } catch (error) {
          console.error("Failed to persist dashboard data:", error);
      }
  }, [dashboardData]);

  const updateCaseStatus = (transactionId, status) => {
    setCaseStatuses((current) => ({
      ...current,
      [transactionId]: status,
    }));
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        setDashboardData,

        caseStatuses,
        updateCaseStatus,

        isProcessing,
        setIsProcessing,

        uploadError,
        setUploadError,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}