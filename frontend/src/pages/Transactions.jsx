import React, { useEffect, useMemo } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { Search } from "lucide-react";

import TransactionTable from "../components/transactions/TransactionTable";
import { useDashboard } from "../context/DashboardContext";

export default function Transactions() {
  const navigate = useNavigate();
  const location = useLocation();

  const { dashboardData } = useDashboard();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filter, setFilter] = React.useState("All");

  const [currentPage, setCurrentPage] = React.useState(1);

  const ROWS_PER_PAGE = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  useEffect(() => {
    if (location.hash === "#high-risk-transactions") {
      setFilter("High Risk");
    }
  }, [location.hash]);

  useEffect(() => {
    if (
      location.hash === "#high-risk-transactions" &&
      filter === "High Risk"
    ) {
      const element = document.getElementById("high-risk-transactions");

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [location.hash, filter]);

  const transactions = dashboardData?.transactions || [];
  const investigations = dashboardData?.investigations || [];

  const allTransactions = transactions;

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.transaction_id
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const isFraud = transaction.prediction === 1;

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Fraud"
          ? isFraud
          : filter === "Legitimate"
          ? !isFraud
          : filter === "High Risk"
          ? ["High", "Critical"].includes(transaction.risk_level)
          : true;

      return matchesSearch && matchesFilter;
    });
  }, [allTransactions, searchTerm, filter]);

  const totalFilteredTransactions = filteredTransactions.length;

  const totalPages = Math.ceil(
    totalFilteredTransactions / ROWS_PER_PAGE
  );

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;

    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  const handleViewDetails = (transactionId) => {
    navigate(`/investigation/${transactionId}`);
  };

  if (!dashboardData) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analyze and review transactions from the uploaded dataset.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-600">
            No dataset uploaded yet.
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Upload a transaction CSV from the Dashboard to begin analysis.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Transactions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review AI-analyzed transactions from the uploaded dataset.
        </p>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={2}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Transaction ID..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {["All", "Fraud", "Legitimate", "High Risk"].map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={[
                    "rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors",
                    filter === option
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {option}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div 
      id="high-risk-transactions"
      className="flex items-center justify-between scroll-mt-24">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {filter === "High Risk"
              ? "High-Risk Transactions"
              : "Analyzed Transactions"}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {totalFilteredTransactions === 0
              ? "No matching transactions"
              : filter === "High Risk"
              ? `Showing ${
                  (currentPage - 1) * ROWS_PER_PAGE + 1
                }–${Math.min(
                  currentPage * ROWS_PER_PAGE,
                  totalFilteredTransactions
                )} of ${totalFilteredTransactions} high-risk cases`
              : `Showing ${
                  (currentPage - 1) * ROWS_PER_PAGE + 1
                }–${Math.min(
                  currentPage * ROWS_PER_PAGE,
                  totalFilteredTransactions
                )} of ${totalFilteredTransactions} available records`}
          </p>
        </div>
      </div>

      {/* Table */}
      <TransactionTable transactions={paginatedTransactions} />

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              {(() => {
                const pages = [];

                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, currentPage + 2);

                if (startPage > 1) {
                  pages.push(1);

                  if (startPage > 2) {
                    pages.push("...");
                  }
                }

                for (let page = startPage; page <= endPage; page++) {
                  pages.push(page);
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push("...");
                  }

                  pages.push(totalPages);
                }

                return pages.map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-1 text-xs text-slate-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={[
                        "h-8 min-w-8 rounded-lg px-2 text-xs font-semibold",
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {page}
                    </button>
                  )
                );
              })()}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}