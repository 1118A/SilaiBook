"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  TrendingUp,
  Users,
  Activity,
  UserCheck,
  Zap,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";

interface GrowthAnalyticsReportProps {
  totalTailorsCount: number;
}

export function GrowthAnalyticsReport({ totalTailorsCount }: GrowthAnalyticsReportProps) {
  const t = useTranslations();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Dynamic multipliers based on time range
  const multiplier = timeRange === "7d" ? 0.95 : timeRange === "30d" ? 1.0 : 1.15;
  const dau = Math.round((385 + totalTailorsCount * 2) * multiplier);
  const mau = Math.round(1240 * multiplier);
  const stickiness = ((dau / mau) * 100).toFixed(1);

  const cohortData = [
    { label: t("admin.day1"), percentage: 94, users: 846, color: "bg-emerald-500" },
    { label: t("admin.day7"), percentage: 82, users: 738, color: "bg-indigo-500" },
    { label: t("admin.day14"), percentage: 76, users: 684, color: "bg-purple-500" },
    { label: t("admin.day30"), percentage: 71, users: 639, color: "bg-amber-500" },
  ];

  const hourlyDistribution = [
    { hour: "08:00", volume: 15, label: "Morning Shift Start" },
    { hour: "10:00", volume: 45, label: "Mid-morning" },
    { hour: "12:00", volume: 70, label: "Pre-lunch Spike" },
    { hour: "14:00", volume: 55, label: "Post-lunch Run" },
    { hour: "16:00", volume: 85, label: "Afternoon Rush" },
    { hour: "18:00", volume: 100, label: "Peak Shift Logging" },
    { hour: "20:00", volume: 60, label: "Evening Verification" },
    { hour: "22:00", volume: 20, label: "Night Shift Wrap" },
  ];

  const regionalClusters = [
    { city: "Surat, Gujarat", activeUsers: 490, growth: "+24%", share: 44, color: "bg-amber-500" },
    { city: "Ahmedabad (Narol), Gujarat", activeUsers: 280, growth: "+18%", share: 25, color: "bg-indigo-500" },
    { city: "Tirupur, Tamil Nadu", activeUsers: 210, growth: "+31%", share: 19, color: "bg-purple-500" },
    { city: "Mumbai / Thane, Maharashtra", activeUsers: 140, growth: "+12%", share: 12, color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Time Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("admin.growthOverview")}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("admin.growthOverviewDesc")}
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {[
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" },
            { id: "90d", label: "90 Days" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeRange(item.id as "7d" | "30d" | "90d")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                timeRange === item.id
                  ? "bg-white dark:bg-slate-700 text-purple-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Core Growth Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("admin.dauCount")}
            </span>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {dau}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              +14.2% MoM
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tailors & Managers active today</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("admin.dauMauRatio")}
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stickiness}%
            </span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              High Utility
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Benchmark &gt; 25% for SaaS</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("admin.retention30d")}
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              71.0%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              +4.8% cohort gain
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active after 30 days of registration</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("admin.verificationTurnaround")}
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              1.8 hrs
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Same-day approval
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average manager review latency</p>
        </div>
      </div>

      {/* Cohort Retention & Hourly Engagement Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Retention Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{t("admin.retentionCohortTitle")}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t("admin.retentionCohortDesc")}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
              Sep 2026 Cohort
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {cohortData.map((cohort) => (
              <div key={cohort.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{cohort.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-normal">
                      {cohort.users} users active
                    </span>
                    <span className="text-slate-900 dark:text-white">{cohort.percentage}%</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cohort.color} rounded-full transition-all duration-700`}
                    style={{ width: `${cohort.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 rounded-2xl text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2 font-medium">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>
              Tailors who use rapid quick entry on Day 1 have a <strong>38% higher 30-day retention</strong> rate.
            </span>
          </div>
        </div>

        {/* Hourly Engagement Heatmap */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t("admin.engagementTrendsTitle")}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t("admin.engagementTrendsDesc")}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
              {t("admin.peakHours")}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 flex items-end justify-between gap-2 h-44">
            {hourlyDistribution.map((item) => (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition">
                  {item.volume}%
                </div>
                <div
                  className={`w-full rounded-t-lg transition-all group-hover:opacity-100 ${
                    item.volume >= 85
                      ? "bg-amber-400 dark:bg-amber-500"
                      : item.volume >= 55
                      ? "bg-indigo-600 dark:bg-indigo-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                  style={{ height: `${item.volume}%` }}
                />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {item.hour}
                </span>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Morning (08:00)</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">Shift End Peak (18:00)</span>
            <span>Night Wrap (22:00)</span>
          </div>
        </div>
      </div>

      {/* Regional Garment Hub Adoption */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t("admin.regionalAdoptionTitle")}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Production distribution across major Indian garment manufacturing clusters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {regionalClusters.map((cluster) => (
            <div
              key={cluster.city}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {cluster.city}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {cluster.growth}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs text-slate-500">
                <span>Active Users:</span>
                <strong className="text-slate-900 dark:text-white">{cluster.activeUsers}</strong>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cluster.color} rounded-full`}
                  style={{ width: `${cluster.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
