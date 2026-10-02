"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Scissors, Plus, X } from "lucide-react";
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
      setErrorMsg(t(validation.error.issues[0]?.message as "validation.nameRequired"));
      return;
    }

    onAddOperation({ name, default_rate_paise });
    setName("");
    setRateRupees(5.0);
    setShowAdd(false);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Scissors className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t("operations.title")} ({operations.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition"
        >
          {showAdd ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>{t("operations.addNew")}</span>
            </>
          )}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          {errorMsg && <div className="text-rose-400 font-semibold text-xs">{errorMsg}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">{t("operations.name")}</label>
              <input
                type="text"
                placeholder="e.g. Button Attach"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-900 font-semibold text-white border border-slate-800 text-xs focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">{t("operations.defaultRate")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={rateRupees}
                onChange={(e) => setRateRupees(parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 rounded-xl bg-slate-900 font-bold text-white border border-slate-800 text-xs focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
          >
            {t("common.save")}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {operations.map((op) => (
          <div
            key={op.id}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
          >
            <div className="font-bold text-white text-sm">{op.name}</div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">{t("operations.defaultRate")}</span>
              <span className="text-base font-extrabold text-violet-400">
                ₹{fromPaise(op.default_rate_paise).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// hello