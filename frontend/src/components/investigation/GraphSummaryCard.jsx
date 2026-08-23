import React, { useMemo, useState } from "react";
import {
  Share2,
  GitBranch,
  Flag,
  Users,
  Monitor,
  Globe,
  CreditCard,
  Store,
  AlertTriangle,
  X,
} from "lucide-react";

const TYPE_CONFIG = {
  Account: {
    icon: Users,
    label: "Account",
  },
  Device: {
    icon: Monitor,
    label: "Device",
  },
  IP: {
    icon: Globe,
    label: "IP Address",
  },
  Transaction: {
    icon: CreditCard,
    label: "Transaction",
  },
  Merchant: {
    icon: Store,
    label: "Merchant",
  },
};

const STATS = [
  { key: "nodes", label: "Nodes", icon: Share2 },
  { key: "edges", label: "Relationships", icon: GitBranch },
  { key: "flagged_entities", label: "Flagged Entities", icon: Flag },
  { key: "suspicious_accounts", label: "Suspicious Accounts", icon: Users },
];

function getNodePositions(nodes, width, height) {
  const groups = {
    Account: [],
    Device: [],
    IP: [],
    Transaction: [],
    Merchant: [],
    Other: [],
  };

  nodes.forEach((node) => {
    const type = groups[node.type] ? node.type : "Other";
    groups[type].push(node);
  });

  const positions = {};

  const placeGroup = (group, y, columns = 3) => {
    if (!group.length) return;

    const spacing = width / (Math.min(group.length, columns) + 1);

    group.forEach((node, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const itemsInRow = Math.min(
        columns,
        group.length - row * columns
      );

      const rowSpacing = width / (itemsInRow + 1);

      positions[node.id] = {
        x: rowSpacing * (column + 1),
        y: y + row * 85,
      };
    });
  };

  placeGroup(groups.Merchant, 55, 2);
  placeGroup(groups.Account, 155, 3);
  placeGroup(groups.Device, 270, 3);
  placeGroup(groups.IP, 385, 2);
  placeGroup(groups.Transaction, 500, 3);

  placeGroup(groups.Other, 610, 3);

  return positions;
}

function truncate(value, length = 18) {
  if (!value) return "";
  return value.length > length
    ? `${value.slice(0, length - 1)}…`
    : value;
}

export default function GraphSummaryCard({ networkIntelligence }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const simulation = networkIntelligence?.simulation;

  if (!simulation?.available) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Network Investigation
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Network relationships are not available in the supplied
              dataset.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
          The dataset does not contain sufficient persistent entity
          identifiers for reliable graph reconstruction.
        </div>
      </div>
    );
  }

  const nodes = simulation.nodes || [];
  const edges = simulation.edges || [];
  const summary = simulation.summary || {};

  const WIDTH = 760;
  const HEIGHT = 650;

  const positions = useMemo(
    () => getNodePositions(nodes, WIDTH, HEIGHT),
    [nodes]
  );

  const selectedDetails = selectedNode
    ? nodes.find((node) => node.id === selectedNode)
    : null;

  const getNodeConfig = (type) =>
    TYPE_CONFIG[type] || {
      icon: Share2,
      label: type || "Entity",
    };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Network Investigation
            </h2>

            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
              Simulated
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Prototype network investigation for the selected case.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="rounded-xl border border-slate-100 bg-slate-50 p-4"
          >
            <Icon
              className="h-4 w-4 text-blue-600"
              strokeWidth={2}
            />

            <p className="mt-2 text-xl font-semibold text-slate-900">
              {summary[key] ?? "—"}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-xs font-semibold text-slate-800">
              Entity Relationship View
            </p>
            <p className="text-[11px] text-slate-500">
              Click an entity to inspect its investigation evidence.
            </p>
          </div>

          <div className="hidden items-center gap-3 text-[10px] text-slate-500 sm:flex">
            <span>● Account</span>
            <span>● Device</span>
            <span>● IP</span>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="min-w-[680px] w-full"
            role="img"
            aria-label="Illustrative investigation network"
          >
            {/* Edges */}
            <g>
              {edges.map((edge, index) => {
                const source = positions[edge.source];
                const target = positions[edge.target];

                if (!source || !target) return null;

                const isSelected =
                  selectedNode === edge.source ||
                  selectedNode === edge.target;

                return (
                  <g key={`${edge.source}-${edge.target}-${index}`}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={
                        isSelected
                          ? "#2563eb"
                          : "#cbd5e1"
                      }
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 5}
                      textAnchor="middle"
                      className="fill-slate-400"
                      fontSize="9"
                    >
                      {truncate(
                        edge.relationship?.replaceAll("_", " "),
                        20
                      )}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {nodes.map((node) => {
                const position = positions[node.id];

                if (!position) return null;

                const config = getNodeConfig(node.type);
                const isSelected = selectedNode === node.id;
                const isFlagged = Boolean(node.flagged);

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={isSelected ? 29 : 25}
                      fill={isFlagged ? "#fff7ed" : "#ffffff"}
                      stroke={
                        isFlagged
                          ? "#f97316"
                          : isSelected
                          ? "#2563eb"
                          : "#94a3b8"
                      }
                      strokeWidth={
                        isFlagged || isSelected ? 2.5 : 1.5
                      }
                    />

                    {isFlagged && (
                      <circle
                        cx={position.x + 18}
                        cy={position.y - 18}
                        r="7"
                        fill="#dc2626"
                      />
                    )}

                    <text
                      x={position.x}
                      y={position.y + 4}
                      textAnchor="middle"
                      className="fill-slate-700"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {truncate(node.id, 14)}
                    </text>

                    <text
                      x={position.x}
                      y={position.y + 42}
                      textAnchor="middle"
                      className="fill-slate-400"
                      fontSize="9"
                    >
                      {config.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Selected node */}
      {selectedDetails && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                {selectedDetails.id}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                {selectedDetails.type}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
              aria-label="Close entity details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {selectedDetails.flagged && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />

              <div>
                <p className="text-xs font-semibold text-orange-800">
                  Flagged Entity
                </p>

                <p className="mt-0.5 text-xs text-orange-700">
                  Suspicion score:{" "}
                  {Number(
                    selectedDetails.suspicion_score || 0
                  ).toFixed(0)}
                </p>
              </div>
            </div>
          )}

          {selectedDetails.reasons?.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Investigation Evidence
              </p>

              <ul className="mt-2 space-y-1.5">
                {selectedDetails.reasons.map(
                  (reason, index) => (
                    <li
                      key={`${reason}-${index}`}
                      className="text-xs text-slate-600"
                    >
                      • {reason}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

          <div>
            <p className="text-xs font-semibold text-amber-800">
              Illustrative Network Simulation
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              This network uses synthetic investigation entities.
              The supplied transaction dataset does not contain
              sufficient persistent entity identifiers for reliable
              graph reconstruction. The visualization demonstrates
              the network-investigation workflow that can be applied
              when relationship data is available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}