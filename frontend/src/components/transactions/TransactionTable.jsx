import React from "react";
import TransactionRow from "./TransactionRow";

const COLUMNS = [
  "Transaction ID",
  "Prediction",
  "Risk Level",
  "Confidence",
  "Recommended Action",
  "Investigation",
];

export default function TransactionTable({ transactions = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {transactions.length === 0 ? (
        <div className="flex items-center justify-center px-6 py-16">
          <p className="text-sm text-slate-400">No transactions uploaded.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.transaction_id}
                  transaction={transaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}