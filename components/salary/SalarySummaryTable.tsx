"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  DollarSign,
  Download,
  Printer,
  Plus,
  Lock,
  Unlock,
  AlertTriangle,
  Eye,
  Calendar,
  Layers,
  TrendingUp,
} from "lucide-react";
import { Tailor, PieceEntry, Adjustment, Lot, Operation, AdjustmentType } from "@/lib/types/payroll";
import { calculateMonthlySalary, TailorMonthlySalary } from "@/lib/salary/engine";
import { generateSalaryCSV, downloadCSV, printTailorPayslip } from "@/lib/salary/exports";
import { formatINR, fromPaise } from "@/lib/money";
import { AdjustmentModal } from "./AdjustmentModal";
import { TailorSalaryDetailModal } from "./TailorSalaryDetailModal";

interface SalarySummaryTableProps {
  tailors: Tailor[];
  entries: PieceEntry[];
  adjustments: Adjustment[];
  lots: Lot[];
  operations: Operation[];
  isMonthClosed: boolean;
  onAddAdjustment: (data: { tailor_id: string; month: string; type: AdjustmentType; amount_paise: number; note?: string }) => void;
  onCloseMonth: (month: string) => void;
  onReopenMonth: (month: string) => void;
}

export function SalarySummaryTable({
  tailors,
  entries,
  adjustments,
  lots,
  operations,
  isMonthClosed,
  onAddAdjustment,
  onCloseMonth,
  onReopenMonth,
}: SalarySummaryTableProps) {
  const t = useTranslations();

  const [selectedMonth, setSelectedMonth] = useState<string>("2026-09");
  const [selectedTailorForAdjustment, setSelectedTailorForAdjustment] = useState<Tailor | null>(null);
  const [selectedTailorForDetail, setSelectedTailorForDetail] = useState<TailorMonthlySalary | null>(null);

  const summary = calculateMonthlySalary(tailors, entries, adjustments, selectedMonth);

  const handleExportCSV = () => {
    const csvContent = generateSalaryCSV(summary);
    downloadCSV(`SilaiBook_Salary_Sheet_${selectedMonth}.csv`, csvContent);
  };

  return (
    <div className="space-y-6">
      {/* Month Selector & Action Bar */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t("salary.title")}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-950 text-xs font-bold text-white px-2 py-1 rounded-lg border border-slate-800 focus:border-violet-500 focus:outline-none"
              >
                <option value="2026-09">September 2026</option>
                <option value="2026-10">October 2026</option>
                <option value="2026-08">August 2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Export & Month Lock Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition"
          >
            <Download className="w-4 h-4 text-violet-400" />
            <span>{t("salary.downloadCSV")}</span>
          </button>

          {isMonthClosed ? (
            <button
              type="button"
              onClick={() => onReopenMonth(selectedMonth)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/60 text-amber-300 font-semibold text-xs transition"
            >
              <Unlock className="w-4 h-4" />
              <span>{t("salary.reopenMonth")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onCloseMonth(selectedMonth)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow transition"
            >
              <Lock className="w-4 h-4" />
              <span>{t("salary.closeMonth")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Month Closed Banner if locked */}
      {isMonthClosed && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0" />
          <span>{t("salary.monthLocked")}. Verified entries & adjustments are locked.</span>
        </div>
      )}

      {/* Overall KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Verified Pieces
          </div>
          <div className="text-2xl font-extrabold text-violet-400 mt-1">
            {summary.totalVerifiedPieces}
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {t("salary.totalGross")}
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatINR(summary.totalGrossPaise)}
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {t("salary.totalNet")}
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatINR(summary.totalNetPaise)}
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {t("salary.pendingVisibility")}
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {formatINR(summary.totalPendingPaise)}
          </div>
        </div>
      </div>

      {/* Main Salary Table */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-3 px-4">{t("tailors.name")}</th>
                <th className="py-3 px-4 text-center">Verified Pieces</th>
                <th className="py-3 px-4 text-right">{t("salary.grossSalary")}</th>
                <th className="py-3 px-4 text-right">{t("salary.bonus")}</th>
                <th className="py-3 px-4 text-right">{t("salary.advance")}</th>
                <th className="py-3 px-4 text-right">{t("salary.deduction")}</th>
                <th className="py-3 px-4 text-right">{t("salary.netPayable")}</th>
                <th className="py-3 px-4 text-right">{t("salary.pendingVisibility")}</th>
                <th className="py-3 px-4 text-center">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-semibold">
              {summary.tailors.map((tailor) => (
                <tr key={tailor.tailorId} className="hover:bg-slate-950/60 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                    <span>{tailor.tailorName}</span>
                    {tailor.negativeNetWarning && (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" title={t("salary.negativeNetWarning")} />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-violet-400 font-extrabold">{tailor.verifiedPieces}</td>
                  <td className="py-3 px-4 text-right text-slate-300">₹{fromPaise(tailor.grossPaise).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    {tailor.bonusPaise > 0 ? `+₹${fromPaise(tailor.bonusPaise).toFixed(2)}` : "—"}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-400">
                    {tailor.advancePaise > 0 ? `−₹${fromPaise(tailor.advancePaise).toFixed(2)}` : "—"}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400">
                    {tailor.deductionPaise > 0 ? `−₹${fromPaise(tailor.deductionPaise).toFixed(2)}` : "—"}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-extrabold ${
                      tailor.netPaise < 0 ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {formatINR(tailor.netPaise)}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-400/80 font-medium">
                    {tailor.pendingPaise > 0 ? `₹${fromPaise(tailor.pendingPaise).toFixed(2)}` : "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* Add Adjustment Button */}
                      <button
                        type="button"
                        disabled={isMonthClosed}
                        onClick={() => {
                          const originalTailor = tailors.find((t) => t.id === tailor.tailorId);
                          if (originalTailor) setSelectedTailorForAdjustment(originalTailor);
                        }}
                        title={t("salary.addAdjustment")}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      {/* Detail Breakdown Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedTailorForDetail(tailor)}
                        title="View Detailed Breakdown"
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-violet-400"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Print Payslip Button */}
                      <button
                        type="button"
                        onClick={() => printTailorPayslip(tailor, selectedMonth)}
                        title={t("salary.printPayslip")}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-emerald-400"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedTailorForAdjustment && (
        <AdjustmentModal
          tailorId={selectedTailorForAdjustment.id}
          tailorName={selectedTailorForAdjustment.name}
          month={selectedMonth}
          onClose={() => setSelectedTailorForAdjustment(null)}
          onSave={onAddAdjustment}
        />
      )}

      {selectedTailorForDetail && (
        <TailorSalaryDetailModal
          tailorName={selectedTailorForDetail.tailorName}
          month={selectedMonth}
          entries={entries.filter(
            (e) => e.tailor_id === selectedTailorForDetail.tailorId && e.work_date.startsWith(selectedMonth) && e.status === "verified"
          )}
          adjustments={adjustments.filter(
            (a) => a.tailor_id === selectedTailorForDetail.tailorId && a.month.startsWith(selectedMonth)
          )}
          lots={lots}
          operations={operations}
          onClose={() => setSelectedTailorForDetail(null)}
        />
      )}
    </div>
  );
}
