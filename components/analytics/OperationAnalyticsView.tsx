"use client";

import { useTranslations } from "next-intl";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Scissors } from "lucide-react";
import { OperationAnalyticsMetric } from "@/lib/analytics/engine";
import { fromPaise } from "@/lib/money";

interface OperationAnalyticsViewProps {
  metrics: OperationAnalyticsMetric[];
}

export function OperationAnalyticsView({ metrics }: OperationAnalyticsViewProps) {
  const t = useTranslations();

  const chartData = metrics.map((op) => ({
    name: op.operationName,
    pieces: op.totalPieces,
    rateRupees: fromPaise(op.avgRatePaise),
  }));

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-900 dark:text-indigo-400">
          <Scissors className="w-4 h-4" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("analytics.operationDistribution")}
        </h2>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-800" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#14172B", borderColor: "rgba(255,255,255,0.12)", borderRadius: "8px", fontSize: "12px", color: "#f8fafc" }}
              itemStyle={{ color: "#8E9BFF" }}
            />
            <Bar dataKey="pieces" fill="#2B3A8C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((op) => (
          <div key={op.operationId} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="font-bold text-slate-900 dark:text-white mb-1">{op.operationName}</div>
            <div className="text-slate-500 dark:text-slate-400 font-medium">Output: <span className="text-indigo-900 dark:text-indigo-400 font-bold">{op.totalPieces} pcs</span></div>
            <div className="text-slate-500 dark:text-slate-400 font-medium">Avg Rate: <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{fromPaise(op.avgRatePaise).toFixed(2)}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
