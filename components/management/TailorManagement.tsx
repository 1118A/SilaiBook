"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Tailor } from "@/lib/types/payroll";
import { tailorSchema } from "@/lib/validations/entry";

interface TailorManagementProps {
  tailors: Tailor[];
  onAddTailor: (data: { name: string; phone?: string }) => void;
  onToggleActive: (tailorId: string) => void;
}

export function TailorManagement({ tailors, onAddTailor, onToggleActive }: TailorManagementProps) {
  const t = useTranslations();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validation = tailorSchema.safeParse({ name, phone });
    if (!validation.success) {
      setErrorMsg(t(validation.error.issues[0]?.message as "validation.nameRequired"));
      return;
    }

    onAddTailor({ name, phone });
    setName("");
    setPhone("");
    setShowAdd(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          🧵 {t("tailors.title")} ({tailors.length})
        </h2>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm"
        >
          {showAdd ? "❌ Cancel" : `➕ ${t("tailors.addNew")}`}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-3">
          {errorMsg && <div className="text-rose-600 font-semibold text-xs">{errorMsg}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t("tailors.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t("tailors.phone")}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm"
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
        {tailors.map((tailor) => (
          <div
            key={tailor.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-base">{tailor.name}</div>
              {tailor.phone && <div className="text-xs text-slate-500">📞 {tailor.phone}</div>}
            </div>

            <button
              type="button"
              onClick={() => onToggleActive(tailor.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                tailor.active
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {tailor.active ? t("tailors.active") : t("tailors.archived")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
