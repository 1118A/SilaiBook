"use client";

import { useTranslations } from "next-intl";
import { LotProgress } from "@/lib/types/payroll";

interface LotProgressCardProps {
  progress: LotProgress;
  onArchiveToggle?: (lotId: string, status: "active" | "completed" | "cancelled") => void;
}

export function LotProgressCard({ progress, onArchiveToggle }: LotProgressCardProps) {
  const t = useTranslations();
  const { lot, done_pieces, remaining_pieces, percentage } = progress;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2.5 py-1 rounded-full">
            {lot.lot_no}
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{lot.style}</h3>
        </div>

        {onArchiveToggle && (
          <button
            type="button"
            onClick={() =>
              onArchiveToggle(lot.id, lot.status === "active" ? "completed" : "active")
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              lot.status === "active"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-200"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200"
            }`}
          >
            {lot.status === "active" ? `📦 ${t("common.archive")}` : `🔄 Reactivate`}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm font-bold mb-1">
          <span className="text-slate-600 dark:text-slate-400">{t("lots.progress")}</span>
          <span className="text-violet-600 dark:text-violet-400 font-extrabold">{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t("lots.totalPieces")}</div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-200">{lot.total_pieces}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t("lots.completedPieces")}</div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{done_pieces}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t("lots.remainingPieces")}</div>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400">{remaining_pieces}</div>
        </div>
      </div>
    </div>
  );
}
