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
} from "lucide-react";
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
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t("entry.quickEntryTitle")}
          </h2>
        </div>

        {lastEntry && (
          <button
            type="button"
            onClick={handleRepeatLast}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("entry.repeatLast")}</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-900/60 text-rose-300 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tailor Select */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{t("entry.selectTailor")}</span>
          </label>
          <select
            value={tailorId}
            onChange={(e) => setTailorId(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-slate-950 text-white font-semibold text-sm border border-slate-800 focus:border-violet-500 focus:outline-none"
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
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>{t("entry.selectLot")}</span>
          </label>
          <select
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-slate-950 text-white font-semibold text-sm border border-slate-800 focus:border-violet-500 focus:outline-none"
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
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              <Scissors className="w-3.5 h-3.5 text-slate-500" />
              <span>{t("entry.selectOperation")}</span>
            </label>
            <select
              value={operationId}
              onChange={(e) => handleOperationChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-950 text-white font-semibold text-sm border border-slate-800 focus:border-violet-500 focus:outline-none"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              {t("entry.ratePerPiece")}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={rateRupees}
              onChange={(e) => setRateRupees(parseFloat(e.target.value) || 0)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-950 text-white font-bold text-sm border border-slate-800 focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{t("entry.workDate")}</span>
          </label>
          <input
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-slate-950 text-white font-semibold text-sm border border-slate-800 focus:border-violet-500 focus:outline-none"
          />
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
              {t("entry.piecesCount")}
            </div>
            <div className="text-3xl font-extrabold text-violet-400">{pieces}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
              {t("entry.totalEarnings")}
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {formatINR(totalValuePaise)}
            </div>
          </div>
        </div>

        {/* Number Pad */}
        <NumberPad value={pieces} onChange={(val) => setPieces(val)} />

        {/* Save Button */}
        <button
          type="submit"
          className="w-full h-14 mt-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base shadow-lg shadow-violet-600/25 active:scale-98 transition flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>{t("entry.saveEntry")}</span>
        </button>
      </form>
    </div>
  );
}
