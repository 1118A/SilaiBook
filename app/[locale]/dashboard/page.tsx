"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePayrollStore } from "@/lib/store/payroll-store";
import { QuickEntryForm } from "@/components/entry/QuickEntryForm";
import { TailorEntryView } from "@/components/entry/TailorEntryView";
import { EntryList } from "@/components/entry/EntryList";
import { LotManagement } from "@/components/lots/LotManagement";
import { TailorManagement } from "@/components/management/TailorManagement";
import { OperationManagement } from "@/components/management/OperationManagement";

export default function DashboardPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const {
    tailors,
    lots,
    operations,
    entries,
    lastEntry,
    getLotProgress,
    addEntry,
    addLot,
    toggleLotStatus,
    addTailor,
    toggleTailorActive,
    addOperation,
  } = usePayrollStore();

  const [activeTab, setActiveTab] = useState<"quickEntry" | "tailorView" | "entries" | "lots" | "manage">("quickEntry");
  const [selectedTailorForView, setSelectedTailorForView] = useState<string>(tailors[0]?.id || "");

  const activeTailors = tailors.filter((t) => t.active);
  const currentTailor = tailors.find((t) => t.id === selectedTailorForView) || tailors[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-2xl">🪡</span>
            <span className="text-xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              {t("common.appName")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              🟢 Shree Ganesh Garments
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {["en", "gu", "hi"].map((l) => (
                <Link
                  key={l}
                  href={`/${l}/dashboard`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    locale === l
                      ? "bg-violet-600 text-white shadow"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("quickEntry")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition ${
              activeTab === "quickEntry"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            }`}
          >
            ⚡ {t("nav.quickEntry")}
          </button>

          <button
            onClick={() => setActiveTab("tailorView")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition ${
              activeTab === "tailorView"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            }`}
          >
            👤 {t("nav.myEntries")}
          </button>

          <button
            onClick={() => setActiveTab("lots")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition ${
              activeTab === "lots"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            }`}
          >
            📦 {t("nav.lots")}
          </button>

          <button
            onClick={() => setActiveTab("entries")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition ${
              activeTab === "entries"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            }`}
          >
            📋 {t("nav.entries")}
          </button>

          <button
            onClick={() => setActiveTab("manage")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition ${
              activeTab === "manage"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            }`}
          >
            ⚙️ {t("nav.tailors")} & {t("nav.operations")}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "quickEntry" && (
          <QuickEntryForm
            tailors={activeTailors}
            lots={lots}
            operations={operations}
            lastEntry={lastEntry}
            onSave={addEntry}
          />
        )}

        {activeTab === "tailorView" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow max-w-xl mx-auto">
              <label className="text-xs font-bold text-slate-500 uppercase">{t("entry.selectTailor")}:</label>
              <select
                value={selectedTailorForView}
                onChange={(e) => setSelectedTailorForView(e.target.value)}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold"
              >
                {tailors.map((tailor) => (
                  <option key={tailor.id} value={tailor.id}>
                    {tailor.name}
                  </option>
                ))}
              </select>
            </div>

            {currentTailor && (
              <TailorEntryView
                tailor={currentTailor}
                entries={entries}
                lots={lots}
                operations={operations}
              />
            )}
          </div>
        )}

        {activeTab === "lots" && (
          <LotManagement
            lots={lots}
            getLotProgress={getLotProgress}
            onAddLot={addLot}
            onToggleStatus={toggleLotStatus}
          />
        )}

        {activeTab === "entries" && (
          <EntryList
            entries={entries}
            tailors={tailors}
            lots={lots}
            operations={operations}
          />
        )}

        {activeTab === "manage" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TailorManagement
              tailors={tailors}
              onAddTailor={addTailor}
              onToggleActive={toggleTailorActive}
            />
            <OperationManagement
              operations={operations}
              onAddOperation={addOperation}
            />
          </div>
        )}
      </main>
    </div>
  );
}
