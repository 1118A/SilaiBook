"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Users, Plus, X, Phone } from "lucide-react";
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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-900 dark:text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("tailors.title")} ({tailors.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-500 text-white font-semibold text-xs transition"
        >
          {showAdd ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>{t("tailors.addNew")}</span>
            </>
          )}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          {errorMsg && <div className="text-rose-600 dark:text-rose-400 font-semibold text-xs">{errorMsg}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t("tailors.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs focus:border-indigo-900 dark:focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t("tailors.phone")}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs focus:border-indigo-900 dark:focus:border-indigo-500 focus:outline-none"
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
        {tailors.map((tailor) => (
          <div
            key={tailor.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">{tailor.name}</div>
              {tailor.phone && (
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>{tailor.phone}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onToggleActive(tailor.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border transition ${tailor.active
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"
                : "bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800"
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
// hello
