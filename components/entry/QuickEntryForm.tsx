"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Zap,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  User,
  Scissors,
  Minus,
  Plus,
} from "lucide-react";
import { Tailor, Lot, Operation, PieceEntry } from "@/lib/types/payroll";
import { formatINR, fromPaise, toPaise, multiplyPaise } from "@/lib/money";
import { pieceEntrySchema } from "@/lib/validations/entry";
import { useAuth } from "@/lib/context/AuthContext";

interface QuickEntryFormProps {
  tailors: Tailor[];
  lots: Lot[];
  operations: Operation[];
  lastEntry: Partial<PieceEntry> | null;
  onSave: (entry: Omit<PieceEntry, "id" | "unit_id" | "status" | "created_at">) => void;
}

export function QuickEntryForm({ tailors, lots, operations, lastEntry, onSave }: QuickEntryFormProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const isTailor = user?.role === "tailor";

  // If user is tailor, match their tailor ID or default to their profile
  const matchedTailor = isTailor
    ? tailors.find((t) => t.id === user.tailor_id || t.name.toLowerCase().includes(user.name.toLowerCase())) || tailors[0]
    : undefined;

  const [tailorId, setTailorId] = useState<string>(
    matchedTailor ? matchedTailor.id : tailors[0]?.id || ""
  );
  const [lotId, setLotId] = useState<string>(lots[0]?.id || "");
  const [operationId, setOperationId] = useState<string>(operations[0]?.id || "");
  const [pieces, setPieces] = useState<number>(10);
  const [rateRupees, setRateRupees] = useState<number>(
    operations[0] ? fromPaise(operations[0].default_rate_paise) : 0
  );
  const [workDate, setWorkDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([30]);
      } catch {
        // ignore
      }
    }
    setSuccessMsg(t("entry.entrySavedSuccess"));
    setPieces(10);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleRepeatLast = () => {
    if (!lastEntry) return;
    if (lastEntry.tailor_id) setTailorId(lastEntry.tailor_id);
    if (lastEntry.lot_id) setLotId(lastEntry.lot_id);
    if (lastEntry.operation_id) setOperationId(lastEntry.operation_id);
    if (lastEntry.rate_paise !== undefined) setRateRupees(fromPaise(lastEntry.rate_paise));
    if (lastEntry.pieces !== undefined) setPieces(lastEntry.pieces);

    if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([15]);
      } catch {
        // ignore
      }
    }
    setSuccessMsg(t("entry.lastEntryRepeated"));
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-[#1E2340] border-2 border-indigo-900/20 dark:border-indigo-500/30 shadow-xl shadow-indigo-900/5 dark:shadow-indigo-950/40 p-5 rounded-3xl max-w-md mx-auto space-y-4 font-sans">
      {/* Visual Priority Indigo & Amber Banner Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-800 text-white p-4 rounded-2xl flex items-center justify-between shadow-md border border-indigo-800/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/30 backdrop-blur-md text-amber-400 font-bold">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight leading-tight flex items-center gap-1.5">
              <span>{t("entry.quickEntryTitle")}</span>
            </h2>
            <p className="text-[11px] text-indigo-200 font-medium">
              High-priority piece-rate entry log
            </p>
          </div>
        </div>

        {lastEntry && (
          <button
            type="button"
            onClick={handleRepeatLast}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition shadow-sm border border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repeat</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Tailor & Lot Selection Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              <User className="w-3 h-3 text-indigo-900 dark:text-indigo-400" />
              <span>
                {isTailor ? t("profile.tailorLockedIdentity") : t("entry.selectTailor")}
              </span>
            </label>
            {isTailor ? (
              <div className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span>{matchedTailor?.name || user?.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {t("profile.you")}
                </span>
              </div>
            ) : (
              <select
                value={tailorId}
                onChange={(e) => setTailorId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-800 focus:border-indigo-900 dark:focus:border-indigo-400 focus:outline-none"
              >
                <option value="">-- {t("entry.selectTailor")} --</option>
                {tailors
                  .filter((t) => t.active)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              <Layers className="w-3 h-3 text-indigo-900 dark:text-indigo-400" />
              <span>{t("entry.selectLot")}</span>
            </label>
            <select
              value={lotId}
              onChange={(e) => setLotId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-800 focus:border-indigo-900 dark:focus:border-indigo-400 focus:outline-none"
            >
              <option value="">-- {t("entry.selectLot")} --</option>
              {lots.filter((l) => l.status === "active").map((l) => (
                <option key={l.id} value={l.id}>
                  {l.lot_no} ({l.style})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Operation & Rate Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              <Scissors className="w-3 h-3 text-indigo-900 dark:text-indigo-400" />
              <span>{t("entry.selectOperation")}</span>
            </label>
            <select
              value={operationId}
              onChange={(e) => handleOperationChange(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-800 focus:border-indigo-900 dark:focus:border-indigo-400 focus:outline-none"
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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t("entry.ratePerPiece")} (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={rateRupees}
              inputMode="none"
              onChange={(e) => setRateRupees(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-800 focus:border-indigo-900 dark:focus:border-indigo-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Work Date Selection */}
        <div>
          <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            <Calendar className="w-3 h-3 text-indigo-900 dark:text-indigo-400" />
            <span>{t("entry.workDate")}</span>
          </label>
          <input
            type="date"
            value={workDate}
            inputMode="none"
            onChange={(e) => setWorkDate(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-800 focus:border-indigo-900 dark:focus:border-indigo-400 focus:outline-none"
          />
        </div>

        {/* Compact Pieces Input Control with Steppers */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              {t("entry.piecesCount")}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Total: {formatINR(totalValuePaise)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* -1 button */}
            <button
              type="button"
              onClick={() => setPieces((p) => Math.max(1, p - 1))}
              className="h-11 w-11 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition flex items-center justify-center select-none"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* piece count input */}
            <input
              type="number"
              min="1"
              value={pieces}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setPieces(isNaN(val) || val < 1 ? 1 : val);
              }}
              className="flex-1 min-w-0 h-11 px-2 rounded-xl bg-white dark:bg-slate-900 text-center text-2xl font-black text-indigo-900 dark:text-amber-400 border border-slate-300 dark:border-slate-700 focus:border-indigo-900 dark:focus:border-indigo-400 focus:outline-none"
            />

            {/* +1 button */}
            <button
              type="button"
              onClick={() => setPieces((p) => p + 1)}
              className="h-11 w-11 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition flex items-center justify-center select-none"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* High Priority Save Button */}
        <button
          type="submit"
          className="w-full h-12 rounded-2xl bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-500 active:bg-indigo-950 text-white font-black text-sm shadow-lg shadow-indigo-900/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{t("entry.saveEntry")}</span>
        </button>
      </form>
    </div>
  );
}
