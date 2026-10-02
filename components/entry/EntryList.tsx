"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PieceEntry, Tailor, Lot, Operation } from "@/lib/types/payroll";
import { formatINR, fromPaise, multiplyPaise } from "@/lib/money";

interface EntryListProps {
  entries: PieceEntry[];
  tailors: Tailor[];
  lots: Lot[];
  operations: Operation[];
}

export function EntryList({ entries, tailors, lots, operations }: EntryListProps) {
  const t = useTranslations();

  const [selectedTailorId, setSelectedTailorId] = useState<string>("all");
  const [selectedLotId, setSelectedLotId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchDate, setSearchDate] = useState<string>("");

  const filteredEntries = entries.filter((entry) => {
    if (selectedTailorId !== "all" && entry.tailor_id !== selectedTailorId) return false;
    if (selectedLotId !== "all" && entry.lot_id !== selectedLotId) return false;
    if (selectedStatus !== "all" && entry.status !== selectedStatus) return false;
    if (searchDate && entry.work_date !== searchDate) return false;
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          📋 {t("nav.entries")} ({filteredEntries.length})
        </h2>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Tailor Filter */}
          <select
            value={selectedTailorId}
            onChange={(e) => setSelectedTailorId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
          >
            <option value="all">{t("common.all")} {t("nav.tailors")}</option>
            {tailors.map((tailor) => (
              <option key={tailor.id} value={tailor.id}>
                {tailor.name}
              </option>
            ))}
          </select>

          {/* Lot Filter */}
          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
          >
            <option value="all">{t("common.all")} {t("nav.lots")}</option>
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.lot_no}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
          >
            <option value="all">{t("common.all")} {t("common.status")}</option>
            <option value="pending">{t("common.pending")}</option>
            <option value="verified">{t("common.verified")}</option>
            <option value="rejected">{t("common.rejected")}</option>
          </select>

          {/* Date Search */}
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Entries Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 tracking-wider">
              <th className="py-3 px-4">{t("entry.workDate")}</th>
              <th className="py-3 px-4">{t("nav.tailors")}</th>
              <th className="py-3 px-4">{t("nav.lots")}</th>
              <th className="py-3 px-4">{t("nav.operations")}</th>
              <th className="py-3 px-4 text-center">{t("entry.piecesCount")}</th>
              <th className="py-3 px-4 text-right">{t("entry.ratePerPiece")}</th>
              <th className="py-3 px-4 text-right">{t("entry.totalEarnings")}</th>
              <th className="py-3 px-4 text-center">{t("common.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 font-normal">
                  {t("common.noResults")}
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => {
                const tailor = tailors.find((t) => t.id === entry.tailor_id);
                const lot = lots.find((l) => l.id === entry.lot_id);
                const op = operations.find((o) => o.id === entry.operation_id);
                const totalPaise = multiplyPaise(entry.rate_paise, entry.pieces);

                return (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">{entry.work_date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{tailor ? tailor.name : "—"}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{lot ? `${lot.lot_no}` : "—"}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{op ? op.name : "—"}</td>
                    <td className="py-3 px-4 text-center font-black text-violet-600 dark:text-violet-400">{entry.pieces}</td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      ₹{fromPaise(entry.rate_paise).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                      {formatINR(totalPaise)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          entry.status === "verified"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : entry.status === "rejected"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {t(`common.${entry.status}` as any)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
