"use client";

import { useTranslations } from "next-intl";
import { Package, Clock, Users, DollarSign, Calendar } from "lucide-react";
import { LotAnalyticsMetric } from "@/lib/analytics/engine";
import { formatINR, fromPaise } from "@/lib/money";

interface LotAnalyticsViewProps {
  metrics: LotAnalyticsMetric[];
}

export function LotAnalyticsView({ metrics }: LotAnalyticsViewProps) {
  const t = useTranslations();

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <Package className="w-4 h-4" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Lot Analytics & Labor Cost Breakdown
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((lot) => (
          <div
            key={lot.lotId}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-violet-400 bg-violet-950 border border-violet-800/60 px-2.5 py-0.5 rounded-full">
                  {lot.lotNo}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{lot.style}</h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-violet-400">{lot.percentage}%</span>
                <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mt-1">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${lot.percentage}%` }} />
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">{t("analytics.lotCost")}</span>
                <span className="text-sm font-extrabold text-emerald-400">
                  ₹{fromPaise(lot.costPerPiecePaise).toFixed(2)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">{t("analytics.recentPace")}</span>
                <span className="text-sm font-extrabold text-white">
                  {lot.recentDailyPace} pcs/day
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">{t("analytics.projectedDate")}</span>
                  <span className="text-xs font-bold text-violet-300">
                    {lot.projectedCompletionDate} ({lot.projectedDaysRemaining} days remaining)
                  </span>
                </div>
                <Calendar className="w-4 h-4 text-violet-400" />
              </div>
            </div>

            {/* Tailors Worked */}
            <div className="pt-2 border-t border-slate-900 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                {lot.tailorCount} Tailors assigned
              </span>
              <span className="font-semibold text-slate-300">
                Total Labour: {formatINR(lot.totalLaborCostPaise)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
