"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Tailor, Lot, Operation, PieceEntry } from "@/lib/types/payroll";
import { NumberPad } from "./NumberPad";
import { formatINR, fromPaise, toPaise, multiplyPaise } from "@/lib/money";
import { pieceEntrySchema } from "@/lib/validations/entry";

interface QuickEntryFormProps {
  tailors: Tailor[];
  lots: Lot[];
  operations: Operation[];
  lastEntry: Partial<PieceEntry> | null;
  onSave: (entry: Omit<PieceEntry, "id" | "unit_id" | "status" | "created_at">) => void;
}

export function QuickEntryForm({ tailors, lots, operations, lastEntry, onSave }: QuickEntryFormProps) {
  const t = useTranslations();

  const [tailorId, setTailorId] = useState<string>(tailors[0]?.id || "");
  const [lotId, setLotId] = useState<string>(lots[0]?.id || "");
  const [operationId, setOperationId] = useState<string>(operations[0]?.id || "");
  const [pieces, setPieces] = useState<number>(0);
  const [rateRupees, setRateRupees] = useState<number>(
    operations[0] ? fromPaise(operations[0].default_rate_paise) : 0
  );
  const [workDate, setWorkDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-fill default rate when operation changes
  const handleOperationChange = (opId: string) => {
    setOperationId(opId);
    const selectedOp = operations.find((o) => o.id === opId);
    if (selectedOp) {
      setRateRupees(fromPaise(selectedOp.default_rate_paise));
    }
  };

  const currentRatePaise = toPaise(rateRupees);
  const totalValuePaise = multiplyPaise(currentRatePaise, pieces);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      tailor_id: tailorId,
      lot_id: lotId,
      operation_id: operationId,
      work_date: workDate,
      pieces,
      rate_paise: currentRatePaise,
    };

    const validation = pieceEntrySchema.safeParse(payload);

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      const translatedError = firstIssue ? t(firstIssue.message as "validation.piecesPositive") : "Invalid input";
      setErrorMsg(translatedError);
      return;
    }

    onSave(payload);
    setSuccessMsg(t("entry.entrySavedSuccess"));
    setPieces(0);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleRepeatLast = () => {
    if (!lastEntry) return;
    if (lastEntry.tailor_id) setTailorId(lastEntry.tailor_id);
    if (lastEntry.lot_id) setLotId(lastEntry.lot_id);
    if (lastEntry.operation_id) setOperationId(lastEntry.operation_id);
    if (lastEntry.rate_paise !== undefined) setRateRupees(fromPaise(lastEntry.rate_paise));
    if (lastEntry.pieces !== undefined) setPieces(lastEntry.pieces);

    setSuccessMsg(t("entry.lastEntryRepeated"));
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          ⚡ {t("entry.quickEntryTitle")}
        </h2>
        {lastEntry && (
          <button
            type="button"
            onClick={handleRepeatLast}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 hover:bg-violet-200 active:scale-95 transition"
          >
            {t("entry.repeatLast")}
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 rounded-xl text-sm font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300 rounded-xl text-sm font-semibold">
          ✅ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tailor Select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {t("entry.selectTailor")}
          </label>
          <select
            value={tailorId}
            onChange={(e) => setTailorId(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-violet-500"
          >
            <option value="">-- {t("entry.selectTailor")} --</option>
            {tailors.filter(t => t.active).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lot Select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {t("entry.selectLot")}
          </label>
          <select
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-violet-500"
          >
            <option value="">-- {t("entry.selectLot")} --</option>
            {lots.filter(l => l.status === "active").map((l) => (
              <option key={l.id} value={l.id}>
                {l.lot_no} ({l.style})
              </option>
            ))}
          </select>
        </div>

        {/* Operation & Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t("entry.selectOperation")}
            </label>
            <select
              value={operationId}
              onChange={(e) => handleOperationChange(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-violet-500"
            >
              <option value="">-- {t("entry.selectOperation")} --</option>
              {operations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t("entry.ratePerPiece")}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={rateRupees}
              onChange={(e) => setRateRupees(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Date selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {t("entry.workDate")}
          </label>
          <input
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700"
          />
        </div>

        {/* Display Current Pieces & Total Value */}
        <div className="p-4 rounded-2xl bg-violet-950/80 text-white flex items-center justify-between border border-violet-800 shadow-inner">
          <div>
            <div className="text-xs uppercase font-semibold text-violet-300 tracking-wider">
              {t("entry.piecesCount")}
            </div>
            <div className="text-4xl font-black">{pieces}</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase font-semibold text-violet-300 tracking-wider">
              {t("entry.totalEarnings")}
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {formatINR(totalValuePaise)}
            </div>
          </div>
        </div>

        {/* Big Number Pad */}
        <NumberPad value={pieces} onChange={(val) => setPieces(val)} />

        {/* Save Button */}
        <button
          type="submit"
          className="w-full h-16 mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xl shadow-lg shadow-emerald-500/25 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2"
        >
          💾 {t("entry.saveEntry")}
        </button>
      </form>
    </div>
  );
}
