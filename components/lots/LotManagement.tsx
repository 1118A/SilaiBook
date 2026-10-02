"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Lot, LotProgress } from "@/lib/types/payroll";
import { LotProgressCard } from "./LotProgressCard";
import { lotSchema } from "@/lib/validations/entry";

interface LotManagementProps {
  lots: Lot[];
  getLotProgress: (lotId: string) => LotProgress | null;
  onAddLot: (lotData: { lot_no: string; style: string; total_pieces: number }) => void;
  onToggleStatus: (lotId: string, status: Lot["status"]) => void;
}

export function LotManagement({ lots, getLotProgress, onAddLot, onToggleStatus }: LotManagementProps) {
  const t = useTranslations();
  const [showAddForm, setShowAddForm] = useState(false);
  const [lotNo, setLotNo] = useState("");
  const [style, setStyle] = useState("");
  const [totalPieces, setTotalPieces] = useState<number>(100);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validation = lotSchema.safeParse({ lot_no: lotNo, style, total_pieces: totalPieces });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || "Invalid input");
      return;
    }

    onAddLot({ lot_no: lotNo, style, total_pieces: totalPieces });
    setLotNo("");
    setStyle("");
    setTotalPieces(100);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          📦 {t("lots.title")}
        </h2>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition"
        >
          {showAddForm ? "❌ Close" : `➕ ${t("lots.addNew")}`}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">➕ {t("lots.addNew")}</h3>
          {errorMsg && <div className="text-rose-600 font-semibold text-sm">{errorMsg}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t("lots.lotNo")}</label>
              <input
                type="text"
                placeholder="e.g. LOT-2026-004"
                value={lotNo}
                onChange={(e) => setLotNo(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t("lots.style")}</label>
              <input
                type="text"
                placeholder="e.g. Denim Jeans"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t("lots.totalPieces")}</label>
              <input
                type="number"
                min="1"
                value={totalPieces}
                onChange={(e) => setTotalPieces(parseInt(e.target.value) || 0)}
                className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow"
          >
            {t("common.save")}
          </button>
        </form>
      )}

      {/* Lot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lots.map((lot) => {
          const progress = getLotProgress(lot.id);
          if (!progress) return null;
          return (
            <LotProgressCard
              key={lot.id}
              progress={progress}
              onArchiveToggle={onToggleStatus}
            />
          );
        })}
      </div>
    </div>
  );
}
