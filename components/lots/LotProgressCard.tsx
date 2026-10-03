"use client";

import { useTranslations } from "next-intl";
import { Package, RotateCcw, Archive } from "lucide-react";
import { LotProgress } from "@/lib/types/payroll";

interface LotProgressCardProps {
  progress: LotProgress;
  onArchiveToggle?: (lotId: string, status: "active" | "completed" | "cancelled") => void;
}

export function LotProgressCard({ progress, onArchiveToggle }: LotProgressCardProps) {
  const t = useTranslations();
  const { lot, done_pieces, remaining_pieces, percentage } = progress;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-1 rounded-full">
            <Package className="w-3 h-3" />
            <span>{lot.lot_no}</span>
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">{lot.style}</h3>
        </div>

        {onArchiveToggle && (
          <button
            type="button"
            onClick={() =>
              onArchiveToggle(lot.id, lot.status === "active" ? "completed" : "active")
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              lot.status === "active"
                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50 hover:bg-amber-200 dark:hover:bg-amber-900/60"
                : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/60"
            }`}
          >
            {lot.status === "active" ? (
              <>
                <Archive className="w-3.5 h-3.5" />
                <span>{t("common.archive")}</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reactivate</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-500 dark:text-slate-400">{t("lots.progress")}</span>
          <span className="text-indigo-900 dark:text-amber-400 font-extrabold">{percentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-900 via-indigo-700 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-center">
        <div>
          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("lots.totalPieces")}</div>
          <div className="text-base font-bold text-slate-900 dark:text-white">{lot.total_pieces}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("lots.completedPieces")}</div>
          <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{done_pieces}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("lots.remainingPieces")}</div>
          <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">{remaining_pieces}</div>
        </div>
      </div>
    </div>
  );
}
