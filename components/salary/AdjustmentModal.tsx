"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DollarSign, Plus, X } from "lucide-react";
import { AdjustmentType } from "@/lib/types/payroll";
import { toPaise } from "@/lib/money";

interface AdjustmentModalProps {
  tailorId: string;
  tailorName: string;
  month: string;
  onClose: () => void;
  onSave: (data: { tailor_id: string; month: string; type: AdjustmentType; amount_paise: number; note?: string }) => void;
}

export function AdjustmentModal({ tailorId, tailorName, month, onClose, onSave }: AdjustmentModalProps) {
  const t = useTranslations();

  const [type, setType] = useState<AdjustmentType>("advance");
  const [amountRupees, setAmountRupees] = useState<number>(500);
  const [note, setNote] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountRupees <= 0) {
      setErrorMsg("Amount must be greater than 0");
      return;
    }

    onSave({
      tailor_id: tailorId,
      month: `${month}-01`,
      type,
      amount_paise: toPaise(amountRupees),
      note,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-900 dark:text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t("salary.addAdjustment")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tailorName} • {month}</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && <div className="text-rose-600 dark:text-rose-400 text-xs font-semibold">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              {t("salary.adjustmentType")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AdjustmentType)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-800"
            >
              <option value="advance">{t("salary.advance")}</option>
              <option value="bonus">{t("salary.bonus")}</option>
              <option value="deduction">{t("salary.deduction")}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              {t("salary.amountRupees")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={amountRupees}
              onChange={(e) => setAmountRupees(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              {t("salary.noteOptional")}
            </label>
            <input
              type="text"
              placeholder="e.g. Festival advance / Performance bonus"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>{t("common.save")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
