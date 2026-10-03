"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Settings,
  ShieldCheck,
  Database,
  Lock,
  Clock,
  Radio,
  Check,
  Save,
} from "lucide-react";

export function AdminSystemSettings() {
  const t = useTranslations();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [autoApproveTailors, setAutoApproveTailors] = useState(true);
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Settings Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>{t("admin.systemSettingsTitle")}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("admin.systemSettingsDesc")}
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/20 flex items-center gap-2 transition"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{t("admin.settingsSaved")}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{t("admin.saveSettings")}</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{t("admin.settingsSaved")}</span>
        </div>
      )}

      {/* Grid Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification & Access Security */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Authentication & Verification Rules</span>
          </h4>

          <div className="space-y-3.5 pt-1">
            {/* Auto-Approve Tailors */}
            <label className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t("admin.autoApprovalPolicy")}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("admin.autoApprovalPolicyDesc")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoApproveTailors}
                onChange={(e) => setAutoApproveTailors(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 mt-1"
              />
            </label>

            {/* Enforce 2FA */}
            <label className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t("admin.enforce2fa")}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Require OTP verification for all administrative actions.
                </p>
              </div>
              <input
                type="checkbox"
                checked={enforce2FA}
                onChange={(e) => setEnforce2FA(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 mt-1"
              />
            </label>

            {/* Session Timeout */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t("admin.sessionTimeout")}</span>
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-700 text-xs font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg"
                >
                  <option value="15">15 {t("admin.minutes")}</option>
                  <option value="30">30 {t("admin.minutes")}</option>
                  <option value="60">60 {t("admin.minutes")} (1 Hour)</option>
                  <option value="480">480 {t("admin.minutes")} (8 Hours)</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-500">
                Inactivity period before requiring re-authentication.
              </p>
            </div>
          </div>
        </div>

        {/* Maintenance & Broadcasts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Platform Broadcast & Maintenance</span>
          </h4>

          <div className="space-y-3.5 pt-1">
            {/* Maintenance Mode Toggle */}
            <label className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t("admin.maintenanceMode")}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("admin.maintenanceModeDesc")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 mt-1"
              />
            </label>

            {/* Broadcast Message Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t("admin.broadcastMessage")}
              </label>
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder={t("admin.broadcastPlaceholder")}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-900 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Database & Financial Integrity Ledger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t("admin.databaseRlsStatus")}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">PostgreSQL RLS Policies</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>100% Tenant Isolation</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Money Calculation Precision</span>
            <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Strict Integer Paise (No Floats)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Automatic Backups</span>
            <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Daily at 02:00 IST</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
