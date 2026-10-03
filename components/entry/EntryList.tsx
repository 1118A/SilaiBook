"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList, Filter } from "lucide-react";
import { PieceEntry, Tailor, Lot, Operation } from "@/lib/types/payroll";
import { formatINR, fromPaise, multiplyPaise } from "@/lib/money";
import { useAuth } from "@/lib/context/AuthContext";

interface EntryListProps {
  entries: PieceEntry[];
  tailors: Tailor[];
  lots: Lot[];
  operations: Operation[];
}

export function EntryList({ entries, tailors, lots, operations }: EntryListProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const isTailor = user?.role === "tailor";

  const matchedTailor = isTailor
    ? tailors.find((t) => t.id === user.tailor_id || t.name.toLowerCase().includes(user.name.toLowerCase())) || tailors[0]
    : undefined;

  const [selectedTailorId, setSelectedTailorId] = useState<string>(
    isTailor && matchedTailor ? matchedTailor.id : "all"
  );
  const [selectedLotId, setSelectedLotId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchDate, setSearchDate] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(25);

  const filteredEntries = entries.filter((entry) => {
    // Strict Tailor Data Isolation: If tailor, enforce own entries only!
    if (isTailor && matchedTailor && entry.tailor_id !== matchedTailor.id) return false;
    if (!isTailor && selectedTailorId !== "all" && entry.tailor_id !== selectedTailorId) return false;
    if (selectedLotId !== "all" && entry.lot_id !== selectedLotId) return false;
    if (selectedStatus !== "all" && entry.status !== selectedStatus) return false;
    if (searchDate && entry.work_date !== searchDate) return false;
    return true;
  });

  const displayedEntries = filteredEntries.slice(0, visibleCount);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-900 dark:text-indigo-400">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("nav.entries")} ({filteredEntries.length})
          </h2>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {isTailor ? (
            <div className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="truncate">{matchedTailor?.name || user?.name}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0 ml-1">
                {t("profile.you")}
              </span>
            </div>
          ) : (
            <select
              value={selectedTailorId}
              onChange={(e) => setSelectedTailorId(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
            >
              <option value="all">{t("common.all")} {t("nav.tailors")}</option>
              {tailors.map((tailor) => (
                <option key={tailor.id} value={tailor.id}>
                  {tailor.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
          >
            <option value="all">{t("common.all")} {t("nav.lots")}</option>
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.lot_no}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
          >
            <option value="all">{t("common.all")} {t("common.status")}</option>
            <option value="pending">{t("common.pending")}</option>
            <option value="verified">{t("common.verified")}</option>
            <option value="rejected">{t("common.rejected")}</option>
          </select>

          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      {/* Entries Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
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
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm font-medium">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 font-normal">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Filter className="w-5 h-5 text-slate-400 dark:text-slate-600 mb-1" />
                    <span>{t("common.noResults")}</span>
                  </div>
                </td>
              </tr>
            ) : (
              displayedEntries.map((entry) => {
                const tailor = tailors.find((t) => t.id === entry.tailor_id);
                const lot = lots.find((l) => l.id === entry.lot_id);
                const op = operations.find((o) => o.id === entry.operation_id);
                const totalPaise = multiplyPaise(entry.rate_paise, entry.pieces);

                return (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition">
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium text-xs">{entry.work_date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{tailor ? tailor.name : "—"}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{lot ? `${lot.lot_no}` : "—"}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{op ? op.name : "—"}</td>
                    <td className="py-3 px-4 text-center font-extrabold text-indigo-900 dark:text-indigo-300">{entry.pieces}</td>
                    <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 text-xs">
                      ₹{fromPaise(entry.rate_paise).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatINR(totalPaise)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            entry.status === "verified"
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
                        {(entry as PieceEntry & { idempotencyKey?: string }).idempotencyKey && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                            Syncing
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredEntries.length > displayedEntries.length && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 25)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition shadow-sm"
          >
            Load More Entries ({filteredEntries.length - displayedEntries.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
