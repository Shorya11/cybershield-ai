import React, { useEffect, useRef, useState } from "react";
import { Upload, FileText, X, BrainCircuit, ShieldCheck, } from "lucide-react";

export default function UploadCard({ onUpload, dashboardData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const [uploadStage, setUploadStage] = useState(0);

  const uploadStages = [
    "Uploading dataset...",
    "Reading transactions...",
    "Running AI fraud detection...",
    "Analyzing risk patterns...",
    "Building investigation cases...",
  ];

  useEffect(() => {
    if (!uploading) {
      setUploadStage(0);
      return;
    }

    const interval = setInterval(() => {
      setUploadStage((current) =>
        current < uploadStages.length - 1 ? current + 1 : current
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [uploading]);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) return;
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleBrowseChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUploadClick = async () => {
    if (!selectedFile || uploading) return;

    try {
      setUploading(true);
      setUploadStage(0);

      await onUpload(selectedFile);
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div 
    id="upload-dataset"
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left side */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Upload Transaction Dataset
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Upload a CSV file for AI-powered fraud detection and
            investigation.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={[
              "mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 bg-slate-50",
            ].join(" ")}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Upload className="h-5 w-5 text-blue-600" strokeWidth={2} />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700">
              Drag & Drop CSV here
            </p>
            <p className="mt-1 text-xs text-slate-400">or</p>

            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="mt-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Browse Files
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={handleBrowseChange}
              className="hidden"
            />

            {selectedFile && (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <FileText className="h-4 w-4 text-slate-400" strokeWidth={2} />
                <span className="text-xs font-medium text-slate-700">
                  {selectedFile.name}
                </span>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-5 overflow-hidden rounded-xl border border-blue-100 bg-blue-50/60">
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <BrainCircuit
                      className="h-5 w-5 text-blue-600"
                      strokeWidth={2}
                    />

                    <span className="absolute inset-0 animate-ping rounded-full border border-blue-300 opacity-40" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      CyberShield AI is analyzing your dataset
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {uploadStages[uploadStage]}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">
                      AI Analysis
                    </span>

                    <span className="font-semibold text-blue-600">
                      Processing
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />

                  <span>
                    Detecting suspicious transactions and risk patterns
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!selectedFile || uploading}
              onClick={handleUploadClick}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Analyzing...
                </span>
              ) : (
                "Upload Dataset"
              )}
            </button>

            {selectedFile && (
              <button
                type="button"
                disabled={uploading}
                onClick={handleRemove}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" strokeWidth={2} />
                Remove File
              </button>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-800">
            Dataset Information
          </p>

          <dl className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-xs font-medium text-slate-500">
                Status
              </dt>

              <dd className="text-xs font-semibold text-slate-700">
                {selectedFile
                  ? "Ready To Upload"
                  : dashboardData
                  ? "Dataset Loaded"
                  : "No Dataset Loaded"}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-xs font-medium text-slate-500">
                CSV Name
              </dt>

              <dd className="max-w-[60%] truncate text-xs font-semibold text-slate-700">
                {selectedFile?.name ||
                  dashboardData?.filename ||
                  "—"}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-xs font-medium text-slate-500">
                Upload Time
              </dt>

              <dd className="text-xs font-semibold text-slate-700">
                {dashboardData?.uploadTime
                  ? new Date(dashboardData.uploadTime).toLocaleTimeString()
                  : selectedFile
                  ? new Date().toLocaleTimeString()
                  : "—"}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-xs font-medium text-slate-500">
                Transactions
              </dt>

              <dd className="text-xs font-semibold text-slate-700">
                {dashboardData?.summary?.total_transactions ??
                  "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}