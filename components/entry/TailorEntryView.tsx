"use client";

import { useTranslations } from "next-intl";
import { PieceEntry, Tailor, Lot, Operation } from "@/lib/types/payroll";
import { formatINR, multiplyPaise } from "@/lib/money";

interface TailorEntryViewProps {
  tailor: Tailor;
  entries: PieceEntry[];
  lots: Lot[];
  operations: Operation[];
}

export function TailorEntryView({ tailor, entries, lots, operations }: TailorEntryViewProps) {
  const t = useTranslations();
  const today = new Date().toISOString().split("T")[0];

  const tailorEntries = entries.filter((e) => e.tailor_id === tailor.id);
  const todaysEntries = tailorEntries.filter((e) => e.work_date === today);

  const todaysTotalPieces = todaysEntries.reduce((acc, curr) => acc + curr.pieces, 0);
  const todaysEstEarningsPaise = todaysEntries.reduce(
    (acc, curr) => acc + multiplyPaise(curr.rate_paise, curr.pieces),
    0
  );

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header Profile Info */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
        <div className="text-xs uppercase tracking-widest text-violet-200 font-bold mb-1">
          {t("home.forTailors")}
        </div>
        <h2 className="text-3xl font-black">{tailor.name}</h2>
        {tailor.phone && <p className="text-violet-200 text-sm font-medium mt-0.5">📞 {tailor.phone}</p>}
      </div>

      {/* Large Today Total Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {t("entry.totalPiecesToday")}
          </div>
          <div className="text-5xl font-black text-violet-600 dark:text-violet-400">
            {todaysTotalPieces}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {t("entry.totalEarningsToday")}
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {formatINR(todaysEstEarningsPaise)}
          </div>
        </div>
      </div>

      {/* Tailor's Entry Log */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          📜 {t("nav.myEntries")} ({tailorEntries.length})
        </h3>

        {tailorEntries.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8 font-medium">
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
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-base">
                      {lot ? `${lot.lot_no} (${lot.style})` : "Lot"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {op ? op.name : "Operation"} • {entry.work_date}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-violet-600 dark:text-violet-300">
                      {entry.pieces} pcs
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatINR(totalAmount)}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 ${
                        entry.status === "verified"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : entry.status === "rejected"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {t(`common.${entry.status}` as any)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
