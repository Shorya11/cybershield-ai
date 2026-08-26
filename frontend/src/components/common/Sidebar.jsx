import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  ShieldAlert,
  BarChart3,
  Info,
  Circle,
} from "lucide-react";
import argusLogo from "../../assets/argus-logo.png";

const navItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    to: "/transactions",
    icon: ReceiptText,
  },
  {
    label: "Investigation",
    to: "/investigation",
    icon: ShieldAlert,
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: BarChart3,
  },
  {
    label: "About",
    to: "/about",
    icon: Info,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-80 flex-col border-r border-slate-200 bg-white">
      {/* ARGUS Branding */}
      <div className="border-b border-slate-200 px-7 py-6">
        <div className="flex items-center">
          <img
            src={argusLogo}
            alt="ARGUS"
            className="h-11 w-auto object-contain object-left"
          />
        </div>

        <div className="mt-1 flex items-center gap-2 pl-0.5">
          <p className="truncate text-xs text-slate-500">
            Financial Crime Investigation
          </p>

          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
            v2.0
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-l-4 border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={[
                        "h-[18px] w-[18px] shrink-0",
                        isActive ? "text-blue-600" : "text-slate-400",
                      ].join(" ")}
                      strokeWidth={2}
                    />
                    <span className="truncate">{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-slate-200 px-4 py-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              AI Model
            </span>
            <span className="text-xs font-semibold text-slate-800">
              XGBoost v1.0
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Backend
            </span>
            <span className="flex items-center gap-1.5">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">
                Connected
              </span>
            </span>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          PSBs CyberShield Hackathon 2026
        </p>
      </div>
    </aside>
  );
}
