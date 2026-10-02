"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Operation } from "@/lib/types/payroll";
import { fromPaise, toPaise } from "@/lib/money";
import { operationSchema } from "@/lib/validations/entry";

interface OperationManagementProps {
  operations: Operation[];
  onAddOperation: (data: { name: string; default_rate_paise: number }) => void;
}

export function OperationManagement({ operations, onAddOperation }: OperationManagementProps) {
  const t = useTranslations();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [rateRupees, setRateRupees] = useState<number>(5.0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const default_rate_paise = toPaise(rateRupees);
    const validation = operationSchema.safeParse({ name, default_rate_paise });
    if (!validation.success) {
      setErrorMsg(t(validation.error.issues[0]?.message as any));
      return;
    }

    onAddOperation({ name, default_rate_paise });
    setName("");
    setRateRupees(5.0);
    setShowAdd(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          ✂️ {t("operations.title")} ({operations.length})
        </h2>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm"
        >
          {showAdd ? "❌ Cancel" : `➕ ${t("operations.addNew")}`}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-3">
          {errorMsg && <div className="text-rose-600 font-semibold text-xs">{errorMsg}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t("operations.name")}</label>
              <input
                type="text"
                placeholder="e.g. Button Attach"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t("operations.defaultRate")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={rateRupees}
                onChange={(e) => setRateRupees(parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm"
          >
            {t("common.save")}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {operations.map((op) => (
          <div
            key={op.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
          >
            <div className="font-bold text-slate-900 dark:text-white text-base">{op.name}</div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-semibold uppercase block">{t("operations.defaultRate")}</span>
              <span className="text-lg font-black text-violet-600 dark:text-violet-400">
                ₹{fromPaise(op.default_rate_paise).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
