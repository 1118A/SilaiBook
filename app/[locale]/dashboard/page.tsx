"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Scissors,
  Zap,
  User,
  Package,
  ClipboardList,
  Settings,
  Building2,
  Globe,
  ShieldCheck,
  History,
  DollarSign,
} from "lucide-react";
import { usePayrollStore } from "@/lib/store/payroll-store";
import { QuickEntryForm } from "@/components/entry/QuickEntryForm";
import { TailorEntryView } from "@/components/entry/TailorEntryView";
import { EntryList } from "@/components/entry/EntryList";
import { VerificationInbox } from "@/components/verification/VerificationInbox";
import { AuditLogView } from "@/components/verification/AuditLogView";
import { SalarySummaryTable } from "@/components/salary/SalarySummaryTable";
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
    adjustments,
    auditLogs,
    autoVerifyManager,
    setAutoVerifyManager,
    lastEntry,
    isMonthClosed,
    closeMonth,
    reopenMonth,
    addAdjustment,
    getLotProgress,
    addEntry,
    verifyEntry,
    rejectEntry,
    bulkVerifyTailorDay,
    resubmitEntry,
    addLot,
    toggleLotStatus,
    addTailor,
    toggleTailorActive,
    addOperation,
  } = usePayrollStore();

  const [activeTab, setActiveTab] = useState<"salary" | "verification" | "quickEntry" | "tailorView" | "entries" | "lots" | "audit" | "manage">("salary");
  const [selectedTailorForView, setSelectedTailorForView] = useState<string>(tailors[0]?.id || "");

  const activeTailors = tailors.filter((t) => t.active);
  const currentTailor = tailors.find((t) => t.id === selectedTailorForView) || tailors[0];
  const pendingCount = entries.filter((e) => e.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Scissors className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              {t("common.appName")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Shree Ganesh Garments</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              {["en", "gu", "hi"].map((l) => (
                <Link
                  key={l}
                  href={`/${l}/dashboard`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    locale === l
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
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
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab("salary")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
              activeTab === "salary"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>{t("nav.salary")}</span>
          </button>

          <button
            onClick={() => setActiveTab("verification")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
              activeTab === "verification"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-violet-300" />
            <span>{t("nav.verificationInbox")}</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500 text-white">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("quickEntry")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
              activeTab === "quickEntry"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <Zap className="w-4 h-4 text-violet-300" />
            <span>{t("nav.quickEntry")}</span>
          </button>

          <button
            onClick={() => setActiveTab("tailorView")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
              activeTab === "tailorView"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t("nav.myEntries")}</span>
          </button>

          <button
            onClick={() => setActiveTab("lots")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
              activeTab === "lots"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t("nav.lots")}</span>
          </button>

          <button
            onClick={() => setActiveTab("entries")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
              activeTab === "entries"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>{t("nav.entries")}</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
              activeTab === "audit"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t("nav.auditLog")}</span>
          </button>

          <button
            onClick={() => setActiveTab("manage")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
              activeTab === "manage"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t("nav.tailors")} & {t("nav.operations")}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "salary" && (
          <SalarySummaryTable
            tailors={tailors}
            entries={entries}
            adjustments={adjustments}
            lots={lots}
            operations={operations}
            isMonthClosed={isMonthClosed("2026-09")}
            onAddAdjustment={addAdjustment}
            onCloseMonth={closeMonth}
            onReopenMonth={reopenMonth}
          />
        )}

        {activeTab === "verification" && (
          <VerificationInbox
            entries={entries}
            tailors={tailors}
            lots={lots}
            operations={operations}
            autoVerifyManager={autoVerifyManager}
            onToggleAutoVerify={setAutoVerifyManager}
            onVerify={verifyEntry}
            onReject={rejectEntry}
            onBulkVerify={bulkVerifyTailorDay}
          />
        )}

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
            <div className="flex items-center justify-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 max-w-xl mx-auto">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("entry.selectTailor")}:</label>
              <select
                value={selectedTailorForView}
                onChange={(e) => setSelectedTailorForView(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-sm font-semibold text-white border border-slate-700"
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
                onResubmit={resubmitEntry}
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

        {activeTab === "audit" && <AuditLogView logs={auditLogs} />}

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
