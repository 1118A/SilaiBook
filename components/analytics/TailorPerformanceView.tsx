"use client";

import { useTranslations } from "next-intl";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { UserCheck } from "lucide-react";
import { TailorPerformanceMetric } from "@/lib/analytics/engine";
import { formatINR } from "@/lib/money";

interface TailorPerformanceViewProps {
  metrics: TailorPerformanceMetric[];
}

export function TailorPerformanceView({ metrics }: TailorPerformanceViewProps) {
  const t = useTranslations();

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-900 dark:text-indigo-400">
          <UserCheck className="w-4 h-4" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("analytics.tailorPerformance")}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics.map((tailor) => (
          <div
            key={tailor.tailorId}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{tailor.tailorName}</h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Verified Pieces: <span className="text-indigo-900 dark:text-indigo-400 font-extrabold">{tailor.verifiedPieces}</span> • Total Earnings: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatINR(tailor.totalEarningsPaise)}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t("analytics.rejectionRate")}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                  tailor.rejectionRatePercent > 10 ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                }`}>
                  {tailor.rejectionRatePercent}%
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">{t("analytics.avgPerDay")}</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{tailor.avgPiecesPerDay} pcs/day</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">{t("analytics.bestDay")}</span>
                <span className="font-extrabold text-indigo-900 dark:text-indigo-400">
                  {tailor.bestDayPieces > 0 ? `${tailor.bestDayPieces} pcs (${tailor.bestDayDate})` : "—"}
                </span>
              </div>
            </div>

            {/* Recharts Daily Trend */}
            {tailor.dailyTrend.length > 0 ? (
              <div className="h-40 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tailor.dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`colorPieces_${tailor.tailorId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2B3A8C" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2B3A8C" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#14172B", borderColor: "rgba(255,255,255,0.12)", borderRadius: "8px", fontSize: "12px" }}
                      itemStyle={{ color: "#8E9BFF" }}
                    />
                    <Area type="monotone" dataKey="pieces" stroke="#2B3A8C" strokeWidth={2} fillOpacity={1} fill={`url(#colorPieces_${tailor.tailorId})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">No daily work trends recorded for this month.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
