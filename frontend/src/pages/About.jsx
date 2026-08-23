import React from "react";
import {
  ShieldCheck,
  BrainCircuit,
  Search,
  Network,
  Activity,
  FileSearch,
  Database,
  Cpu,
  Layers3,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

function CapabilityCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
        <Icon
          className="h-5 w-5 text-blue-600"
          strokeWidth={2}
        />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

      {/* Hero */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
          
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <ShieldCheck
                  className="h-6 w-6 text-white"
                  strokeWidth={2}
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Financial Crime Investigation Platform
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  ARGUS
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600">
              ARGUS is an AI-powered investigation platform designed
              to detect suspicious financial transactions and provide
              investigators with explainable risk intelligence,
              behavioral signals, case prioritization, and network
              investigation capabilities.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                AI / ML Detection
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                Explainable AI
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                Behavioral Intelligence
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                Network Investigation
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-blue-600 shadow-sm">
              <ShieldCheck
                className="h-24 w-24 text-white"
                strokeWidth={1.4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
            <AlertTriangle
              className="h-5 w-5 text-red-600"
              strokeWidth={2}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              The Investigation Problem
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Financial crime monitoring systems can generate large
              volumes of alerts while investigators still need to
              determine which cases deserve immediate attention,
              why a transaction was flagged, and whether suspicious
              activity may be connected to a wider pattern.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Core Intelligence
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            ARGUS combines machine learning with investigator-focused
            intelligence layers.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CapabilityCard
            icon={BrainCircuit}
            title="ML Fraud Detection"
            description="XGBoost-based classification identifies transactions with elevated fraud or mule-account risk."
          />

          <CapabilityCard
            icon={FileSearch}
            title="Explainable Risk Intelligence"
            description="SHAP-based transaction explanations identify the features contributing most strongly to model decisions."
          />

          <CapabilityCard
            icon={Activity}
            title="Behavioral Intelligence"
            description="Transaction velocity, fund-flow changes, activity shifts, deviations, alert correlation, and related behavioral signals are consolidated into an investigation view."
          />

          <CapabilityCard
            icon={Search}
            title="Investigation Prioritization"
            description="High-risk and critical cases are surfaced for investigator review with risk scores, confidence, evidence, and recommended actions."
          />

          <CapabilityCard
            icon={Network}
            title="Network Investigation"
            description="The prototype provides an illustrative entity-network investigation workflow for exploring suspicious account relationships."
          />

          <CapabilityCard
            icon={ShieldCheck}
            title="Action-Oriented Investigation"
            description="Risk intelligence is translated into recommended operational actions such as review, escalation, or immediate transaction blocking."
          />
        </div>
      </section>

      {/* Workflow */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Investigation Workflow
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            From transaction ingestion to investigator action.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Step
            number="1"
            title="Ingest"
            description="Upload a transaction dataset for batch analysis."
          />

          <Step
            number="2"
            title="Detect"
            description="Apply the trained ML model to identify suspicious transactions."
          />

          <Step
            number="3"
            title="Explain"
            description="Expose model contributions and behavioral evidence behind the risk decision."
          />

          <Step
            number="4"
            title="Investigate"
            description="Explore case intelligence and illustrative network relationships."
          />

          <Step
            number="5"
            title="Act"
            description="Prioritize the case and follow the recommended investigation response."
          />
        </div>
      </section>

      {/* Technology */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Technology Foundation
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Technologies used to build the current prototype.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Machine Learning", "XGBoost"],
            ["Explainability", "SHAP"],
            ["Backend", "Python + FastAPI"],
            ["Frontend", "React + Tailwind CSS"],
            ["Data Processing", "Pandas"],
            ["Network Analysis", "NetworkX"],
            ["Visualization", "React / SVG"],
            ["API Architecture", "REST"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-[11px] font-medium text-slate-500">
                {label}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
            strokeWidth={2}
          />

          <div>
            <h2 className="text-sm font-semibold text-amber-900">
              Prototype Transparency
            </h2>

            <p className="mt-2 text-xs leading-5 text-amber-800">
              ARGUS currently operates in batch investigation mode
              using uploaded transaction data. The supplied dataset
              does not contain sufficient persistent entity identifiers
              for reliable graph reconstruction. Therefore, the
              network visualization is explicitly labelled as a
              simulated prototype network rather than being presented
              as a real reconstructed banking network.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          <div>
            <p className="text-sm font-semibold text-slate-900">
              ARGUS
            </p>

            <p className="mt-1 text-xs text-slate-500">
              AI-powered financial crime investigation prototype
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Database className="h-4 w-4" />
            <span>Bank of India Hackathon 2026</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;