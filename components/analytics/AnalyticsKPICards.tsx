"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Calendar, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { OverallKPIs } from "@/lib/analytics/engine";
import { formatINR } from "@/lib/money";

interface AnalyticsKPICardsProps {
  kpis: OverallKPIs;
}

export function AnalyticsKPICards({ kpis }: AnalyticsKPICardsProps) {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Pieces Today */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">{t("analytics.piecesToday")}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpis.piecesToday}</div>
      </div>

      {/* Pieces This Month */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">{t("analytics.piecesMonth")}</span>
          <Calendar className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
        </div>
        <div className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-400">{kpis.piecesThisMonth}</div>
      </div>

      {/* Payroll So Far */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">{t("analytics.payrollMonth")}</span>
          <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatINR(kpis.payrollSoFarPaise)}</div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">{t("analytics.pendingCount")}</span>
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{kpis.pendingReviewsCount}</div>
      </div>

      {/* Rejection Rate % */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">{t("analytics.rejectionRate")}</span>
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        </div>
        <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{kpis.rejectionRatePercent}%</div>
      </div>
    </div>
  );
}
