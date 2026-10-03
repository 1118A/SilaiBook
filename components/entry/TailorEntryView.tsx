"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { UserCheck, Phone, FileText, TrendingUp, Award, RotateCcw, AlertTriangle } from "lucide-react";
import { PieceEntry, Tailor, Lot, Operation } from "@/lib/types/payroll";
import { formatINR, multiplyPaise } from "@/lib/money";

interface TailorEntryViewProps {
  tailor: Tailor;
  entries: PieceEntry[];
  lots: Lot[];
  operations: Operation[];
  onResubmit?: (entryId: string, pieces?: number, note?: string) => void;
}

export function TailorEntryView({ tailor, entries, lots, operations, onResubmit }: TailorEntryViewProps) {
  const t = useTranslations();
  const today = new Date().toISOString().split("T")[0];

  const [resubmittingEntryId, setResubmittingEntryId] = useState<string | null>(null);
  const [resubmitPieces, setResubmitPieces] = useState<number>(0);

  const tailorEntries = entries.filter((e) => e.tailor_id === tailor.id);
  const todaysEntries = tailorEntries.filter((e) => e.work_date === today);

  const todaysTotalPieces = todaysEntries.reduce((acc, curr) => acc + curr.pieces, 0);
  const todaysEstEarningsPaise = todaysEntries.reduce(
    (acc, curr) => acc + multiplyPaise(curr.rate_paise, curr.pieces),
    0
  );

  const handleOpenResubmit = (entry: PieceEntry) => {
    setResubmittingEntryId(entry.id);
    setResubmitPieces(entry.pieces);
  };

  const handleConfirmResubmit = () => {
    if (!resubmittingEntryId || !onResubmit) return;
    onResubmit(resubmittingEntryId, resubmitPieces, "Resubmitted by tailor");
    setResubmittingEntryId(null);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Profile Info Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-slate-900 dark:text-white shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t("home.forTailors")}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{tailor.name}</h2>
          {tailor.phone && (
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>{tailor.phone}</span>
            </p>
          )}
        </div>

        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-900 dark:text-indigo-400">
          <Award className="w-6 h-6" />
        </div>
      </div>

      {/* Large Today Total Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {t("entry.totalPiecesToday")}
          </div>
          <div className="text-4xl font-extrabold text-indigo-900 dark:text-amber-400">
            {todaysTotalPieces}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t("entry.totalEarningsToday")}</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(todaysEstEarningsPaise)}
          </div>
        </div>
      </div>

      {/* Tailor's Entry Log */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("nav.myEntries")} ({tailorEntries.length})
          </h3>
        </div>

        {tailorEntries.length === 0 ? (
          <p className="text-center text-slate-500 py-8 text-sm">
            {t("common.noResults")}
          </p>
        ) : (
          <div className="space-y-3">
            {tailorEntries.map((entry) => {
              const lot = lots.find((l) => l.id === entry.lot_id);
              const op = operations.find((o) => o.id === entry.operation_id);
              const totalAmount = multiplyPaise(entry.rate_paise, entry.pieces);

              return (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {lot ? `${lot.lot_no} (${lot.style})` : "Lot"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {op ? op.name : "Operation"} • {entry.work_date}
                      </div>
                    </div>                    <div className="text-right">
                      <div className="text-lg font-extrabold text-indigo-900 dark:text-amber-400">
                        {entry.pieces} pcs
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatINR(totalAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-900 pt-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${entry.status === "verified"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                          : entry.status === "rejected"
                            ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                        }`}
                    >
                      {entry.status === "verified"
                        ? t("common.verified")
                        : entry.status === "rejected"
                          ? t("common.rejected")
                          : t("common.pending")}
                    </span>

                    {entry.status === "rejected" && (
                      <div className="flex items-center gap-2">
                        {entry.note && (
                          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {entry.note}
                          </span>
                        )}
                        {onResubmit && (
                          <button
                            type="button"
                            onClick={() => handleOpenResubmit(entry)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 text-white transition shadow"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{t("entry.resubmit")}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resubmit Modal */}
      {resubmittingEntryId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t("entry.resubmit")}</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                {t("entry.piecesCount")}
              </label>
              <input
                type="number"
                min="1"
                value={resubmitPieces}
                onChange={(e) => setResubmitPieces(parseInt(e.target.value) || 0)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-base border border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResubmittingEntryId(null)}
                className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmResubmit}
                className="flex-1 h-10 rounded-xl bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 text-white font-bold text-xs shadow"
              >
                {t("common.submit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
