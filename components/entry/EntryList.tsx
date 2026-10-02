"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList, Filter } from "lucide-react";
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
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t("nav.entries")} ({filteredEntries.length})
          </h2>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <select
            value={selectedTailorId}
            onChange={(e) => setSelectedTailorId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-950 text-xs font-semibold text-white border border-slate-800"
          >
            <option value="all">{t("common.all")} {t("nav.tailors")}</option>
            {tailors.map((tailor) => (
              <option key={tailor.id} value={tailor.id}>
                {tailor.name}
              </option>
            ))}
          </select>

          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-950 text-xs font-semibold text-white border border-slate-800"
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
            className="h-10 px-3 rounded-xl bg-slate-950 text-xs font-semibold text-white border border-slate-800"
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
            className="h-10 px-3 rounded-xl bg-slate-950 text-xs font-semibold text-white border border-slate-800"
          />
        </div>
      </div>

      {/* Entries Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
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
          <tbody className="divide-y divide-slate-800/60 text-sm font-medium">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 font-normal">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Filter className="w-5 h-5 text-slate-600 mb-1" />
                    <span>{t("common.noResults")}</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => {
                const tailor = tailors.find((t) => t.id === entry.tailor_id);
                const lot = lots.find((l) => l.id === entry.lot_id);
                const op = operations.find((o) => o.id === entry.operation_id);
                const totalPaise = multiplyPaise(entry.rate_paise, entry.pieces);

                return (
                  <tr key={entry.id} className="hover:bg-slate-950/60 transition">
                    <td className="py-3 px-4 text-slate-400 font-medium text-xs">{entry.work_date}</td>
                    <td className="py-3 px-4 font-bold text-white">{tailor ? tailor.name : "—"}</td>
                    <td className="py-3 px-4 text-slate-300">{lot ? `${lot.lot_no}` : "—"}</td>
                    <td className="py-3 px-4 text-slate-300">{op ? op.name : "—"}</td>
                    <td className="py-3 px-4 text-center font-extrabold text-violet-400">{entry.pieces}</td>
                    <td className="py-3 px-4 text-right text-slate-400 text-xs">
                      ₹{fromPaise(entry.rate_paise).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-400">
                      {formatINR(totalPaise)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
