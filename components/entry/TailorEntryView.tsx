"use client";

import { useTranslations } from "next-intl";
import { UserCheck, Phone, FileText, TrendingUp, Award } from "lucide-react";
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
      {/* Profile Info Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t("home.forTailors")}</span>
          </div>
          <h2 className="text-2xl font-black text-white">{tailor.name}</h2>
          {tailor.phone && (
            <p className="text-slate-400 text-xs font-semibold mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-500" />
              <span>{tailor.phone}</span>
            </p>
          )}
        </div>

        <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <Award className="w-6 h-6" />
        </div>
      </div>

      {/* Large Today Total Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {t("entry.totalPiecesToday")}
          </div>
          <div className="text-4xl font-extrabold text-violet-400">
            {todaysTotalPieces}
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t("entry.totalEarningsToday")}</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {formatINR(todaysEstEarningsPaise)}
          </div>
        </div>
      </div>

      {/* Tailor's Entry Log */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400" />
          <h3 className="text-lg font-bold text-white">
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
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white text-sm">
                      {lot ? `${lot.lot_no} (${lot.style})` : "Lot"}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                      {op ? op.name : "Operation"} • {entry.work_date}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-violet-400">
                      {entry.pieces} pcs
                    </div>
                    <div className="text-xs font-semibold text-emerald-400">
                      {formatINR(totalAmount)}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 ${
                        entry.status === "verified"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                          : entry.status === "rejected"
                          ? "bg-rose-950 text-rose-300 border border-rose-800/50"
                          : "bg-amber-950 text-amber-300 border border-amber-800/50"
                      }`}
                    >
                      {entry.status === "verified"
                        ? t("common.verified")
                        : entry.status === "rejected"
                        ? t("common.rejected")
                        : t("common.pending")}
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
