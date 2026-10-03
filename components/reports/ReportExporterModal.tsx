"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  FileSpreadsheet,
  Download,
  Share2,
  Printer,
  Database,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PieceEntry, Tailor, Lot, Operation, Adjustment, AuditLog } from "@/lib/types/payroll";
import { TailorMonthlySalary } from "@/lib/salary/engine";
import { exportSalarySummaryCSV, exportPieceEntriesCSV, exportFullDataBackup } from "@/lib/reports/csv";
import { openSalarySlipPrintWindow } from "@/lib/reports/pdf";
import { shareSalarySlipViaWebShare } from "@/lib/reports/share";

interface ReportExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthStr: string;
  salarySummaries: TailorMonthlySalary[];
  entries: PieceEntry[];
  tailors: Tailor[];
  lots: Lot[];
  operations: Operation[];
  adjustments: Adjustment[];
  closedMonths: string[];
  auditLogs: AuditLog[];
  unitId: string;
  onRestoreBackup?: (backupData: Partial<{ tailors: Tailor[]; lots: Lot[]; operations: Operation[]; entries: PieceEntry[]; adjustments: Adjustment[] }>) => void;
}

export function ReportExporterModal({
  isOpen,
  onClose,
  monthStr,
  salarySummaries,
  entries,
  tailors,
  lots,
  operations,
  adjustments,
  closedMonths,
  auditLogs,
  unitId,
  onRestoreBackup,
}: ReportExporterModalProps) {
  const t = useTranslations();
  const [selectedTailorId, setSelectedTailorId] = useState<string>(tailors[0]?.id || "");
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportSalaryCSV = () => {
    exportSalarySummaryCSV(salarySummaries, monthStr);
  };

  const handleExportEntriesCSV = () => {
    exportPieceEntriesCSV(entries, tailors, lots, operations);
  };

  const handleExportBackup = () => {
    exportFullDataBackup({
      unit_id: unitId,
      tailors,
      lots,
      operations,
      entries,
      adjustments,
      closedMonths,
      auditLogs,
    });
  };

  const handlePrintSlip = () => {
    const summary = salarySummaries.find((s) => s.tailorId === selectedTailorId);
    if (!summary) return;
    openSalarySlipPrintWindow({
      summary,
      monthStr,
      locale: "en",
    });
  };

  const handleShareSlip = async () => {
    const summary = salarySummaries.find((s) => s.tailorId === selectedTailorId);
    const tailor = tailors.find((t) => t.id === selectedTailorId);
    if (!summary) return;

    setShareStatus("Preparing share...");
    const res = await shareSalarySlipViaWebShare({ summary, monthStr, phone: tailor?.phone });
    if (res.success) {
      setShareStatus(res.method === "whatsapp" ? "Opened in WhatsApp" : res.method === "share" ? "Shared successfully" : "Copied text to clipboard");
    } else {
      setShareStatus("Failed to share");
    }

    setTimeout(() => setShareStatus(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        if (json.version && (json.tailors || json.entries)) {
          if (onRestoreBackup) {
            onRestoreBackup(json);
            setRestoreMessage("Backup data restored successfully!");
          } else {
            setRestoreMessage("Valid backup loaded successfully.");
          }
        } else {
          setRestoreMessage("Invalid backup file format.");
        }
      } catch {
        setRestoreMessage("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-900 dark:bg-indigo-600 text-white font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Reports & Data Backup Center
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate PDF slips, export CSV logs, share via WhatsApp, & backup unit data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-900 dark:text-slate-100">
          {/* Section 1: PDF Salary Slip & Share */}
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
                <span>PDF Salary Slip & Direct Share</span>
              </h4>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300">
                {monthStr}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                  Select Tailor
                </label>
                <select
                  value={selectedTailorId}
                  onChange={(e) => setSelectedTailorId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-900"
                >
                  {tailors.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex items-end gap-2 pt-4 sm:pt-0">
                <button
                  onClick={handlePrintSlip}
                  className="flex-1 h-11 px-4 rounded-xl bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF Slip</span>
                </button>

                <button
                  onClick={handleShareSlip}
                  className="flex-1 h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share WhatsApp</span>
                </button>
              </div>
            </div>

            {shareStatus && (
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{shareStatus}</span>
              </div>
            )}
          </div>

          {/* Section 2: CSV Exports */}
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>CSV Spreadsheet Exports</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportSalaryCSV}
                className="h-12 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-900 dark:text-white font-bold text-xs shadow-sm transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Salary Summary CSV</span>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={handleExportEntriesCSV}
                className="h-12 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-900 dark:text-white font-bold text-xs shadow-sm transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Piece Entries Log CSV</span>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Section 3: Full Data Backup & Restore */}
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Factory Owner Backup & Restore</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download complete unit database backup (tailors, lots, piece entries, rate history) as JSON
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleExportBackup}
                className="h-12 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Backup</span>
              </button>

              <label className="h-12 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-900 dark:text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4 text-amber-500" />
                <span>Restore JSON Backup</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {restoreMessage && (
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{restoreMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="h-10 px-6 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
