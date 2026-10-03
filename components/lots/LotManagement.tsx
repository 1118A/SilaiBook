"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Package, Plus, X } from "lucide-react";
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
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-900 dark:text-indigo-400">
            <Package className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("lots.title")} ({lots.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition"
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>{t("lots.addNew")}</span>
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t("lots.addNew")}</h3>
          {errorMsg && <div className="text-rose-600 dark:text-rose-400 font-semibold text-xs">{errorMsg}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{t("lots.lotNo")}</label>
              <input
                type="text"
                placeholder="e.g. LOT-2026-004"
                value={lotNo}
                onChange={(e) => setLotNo(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-sm focus:border-indigo-900 dark:focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{t("lots.style")}</label>
              <input
                type="text"
                placeholder="e.g. Denim Jeans"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-sm focus:border-indigo-900 dark:focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{t("lots.totalPieces")}</label>
              <input
                type="number"
                min="1"
                value={totalPieces}
                onChange={(e) => setTotalPieces(parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-sm focus:border-indigo-900 dark:focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition"
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
