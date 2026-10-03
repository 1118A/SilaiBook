"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import {
  Zap,
  User,
  Package,
  ClipboardList,
  Settings,
  Building2,
  ShieldCheck,
  History,
  DollarSign,
  BarChart3,
  FileSpreadsheet,
  Wifi,
  WifiOff,
  RefreshCw,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { usePayrollStore } from "@/lib/store/payroll-store";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageDropdown } from "@/components/ui/LanguageDropdown";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { InstallPromptBanner } from "@/components/pwa/InstallPromptBanner";
import dynamic from "next/dynamic";
import { TabLoadingSkeleton } from "@/components/ui/TabLoadingSkeleton";

const ReportExporterModal = dynamic(
  () => import("@/components/reports/ReportExporterModal").then((m) => m.ReportExporterModal),
  { ssr: false }
);
const UserProfileModal = dynamic(
  () => import("@/components/profile/UserProfileModal").then((m) => m.UserProfileModal),
  { ssr: false }
);
const MainAdminDashboard = dynamic(
  () => import("@/components/admin/MainAdminDashboard").then((m) => m.MainAdminDashboard),
  { loading: () => <TabLoadingSkeleton /> }
);
const SalarySummaryTable = dynamic(
  () => import("@/components/salary/SalarySummaryTable").then((m) => m.SalarySummaryTable),
  { loading: () => <TabLoadingSkeleton /> }
);
const LotManagement = dynamic(
  () => import("@/components/lots/LotManagement").then((m) => m.LotManagement),
  { loading: () => <TabLoadingSkeleton /> }
);
const TailorManagement = dynamic(
  () => import("@/components/management/TailorManagement").then((m) => m.TailorManagement),
  { loading: () => <TabLoadingSkeleton /> }
);
const OperationManagement = dynamic(
  () => import("@/components/management/OperationManagement").then((m) => m.OperationManagement),
  { loading: () => <TabLoadingSkeleton /> }
);
const AuditLogView = dynamic(
  () => import("@/components/verification/AuditLogView").then((m) => m.AuditLogView),
  { loading: () => <TabLoadingSkeleton /> }
);
const TailorPerformanceView = dynamic(
  () => import("@/components/analytics/TailorPerformanceView").then((m) => m.TailorPerformanceView),
  { loading: () => <TabLoadingSkeleton /> }
);
const LeaderboardView = dynamic(
  () => import("@/components/analytics/LeaderboardView").then((m) => m.LeaderboardView),
  { loading: () => <TabLoadingSkeleton /> }
);
const LotAnalyticsView = dynamic(
  () => import("@/components/analytics/LotAnalyticsView").then((m) => m.LotAnalyticsView),
  { loading: () => <TabLoadingSkeleton /> }
);
const OperationAnalyticsView = dynamic(
  () => import("@/components/analytics/OperationAnalyticsView").then((m) => m.OperationAnalyticsView),
  { loading: () => <TabLoadingSkeleton /> }
);

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/context/AuthContext";
import { useOfflineSync } from "@/lib/offline/useOfflineSync";
import { calculateMonthlySalary } from "@/lib/salary/engine";

import { QuickEntryForm } from "@/components/entry/QuickEntryForm";
import { TailorEntryView } from "@/components/entry/TailorEntryView";
import { EntryList } from "@/components/entry/EntryList";
import { VerificationInbox } from "@/components/verification/VerificationInbox";
import { AnalyticsKPICards } from "@/components/analytics/AnalyticsKPICards";
import {
  getOverallAnalytics,
  getTailorAnalytics,
  getLotAnalytics,
  getOperationAnalytics,
} from "@/lib/analytics/engine";
import { AccessDeniedCard } from "@/components/auth/AccessDeniedCard";
import { canAccessSection, SectionKey, getRoleBadgeInfo } from "@/lib/auth/permissions";

type TabType = "mainAdmin" | "salary" | "analytics" | "verification" | "quickEntry" | "tailorView" | "entries" | "lots" | "audit" | "manage";

const tabToSectionMap: Record<TabType, SectionKey> = {
  mainAdmin: "main_admin_overview",
  analytics: "manager_analytics",
  salary: "salary_engine",
  verification: "verification_inbox",
  quickEntry: "quick_entry",
  tailorView: "my_entries",
  lots: "lots",
  entries: "entries_log",
  audit: "audit_log",
  manage: "tailors",
};

function DashboardContent() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const { user, logout } = useAuth();
  const currentRole = user?.role || "manager";

  const {
    unitId,
    tailors,
    lots,
    operations,
    entries,
    adjustments,
    closedMonths,
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

  const getInitialTab = (): TabType => {
    if (currentRole === "main_admin") return "mainAdmin";
    if (currentRole === "owner") return "analytics";
    if (currentRole === "manager") return "verification";
    return "quickEntry";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());
  const [selectedTailorForView, setSelectedTailorForView] = useState<string>(tailors[0]?.id || "");
  const [analyticsMonth] = useState<string>("2026-09");
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { isOnline, pendingCount: offlinePendingCount, isSyncing, triggerSync } = useOfflineSync(entries, addEntry);

  const activeTailors = tailors.filter((t) => t.active);
  const isTailor = currentRole === "tailor";
  const matchedTailor = isTailor
    ? tailors.find((t) => t.id === user?.tailor_id || t.name.toLowerCase().includes(user?.name.toLowerCase() || "")) || tailors[0]
    : undefined;
  const currentTailor = isTailor ? matchedTailor : (tailors.find((t) => t.id === selectedTailorForView) || tailors[0]);
  const pendingCount = entries.filter((e) => e.status === "pending").length;

  const salarySummaries = calculateMonthlySalary(tailors, entries, adjustments, "2026-09").tailors;
  const overallKPIs = getOverallAnalytics(entries, analyticsMonth);
  const tailorPerformance = getTailorAnalytics(entries, tailors, analyticsMonth);
  const lotMetrics = getLotAnalytics(entries, lots, tailors);
  const operationMetrics = getOperationAnalytics(entries, operations);

  const allNavItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: "mainAdmin", label: t("nav.mainAdmin"), icon: ShieldCheck },
    { id: "analytics", label: t("nav.analytics"), icon: BarChart3 },
    { id: "salary", label: t("nav.salary"), icon: DollarSign },
    { id: "verification", label: t("nav.verificationInbox"), icon: ShieldCheck, badge: pendingCount },
    { id: "quickEntry", label: t("nav.quickEntry"), icon: Zap },
    { id: "tailorView", label: t("nav.myEntries"), icon: User },
    { id: "lots", label: t("nav.lots"), icon: Package },
    { id: "entries", label: t("nav.entries"), icon: ClipboardList },
    { id: "audit", label: t("nav.auditLog"), icon: History },
    { id: "manage", label: `${t("nav.tailors")} & ${t("nav.operations")}`, icon: Settings },
  ];

  const navItems = allNavItems.filter((item) =>
    canAccessSection(currentRole, tabToSectionMap[item.id])
  );

  const isCurrentTabAllowed = canAccessSection(currentRole, tabToSectionMap[activeTab]);
  const roleBadge = getRoleBadgeInfo(currentRole);

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans transition-colors duration-200">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden shrink-0 flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40">
        <BrandLogo size="sm" showTagline={false} href={`/${locale}`} />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Static Left Sidebar */}
      <aside
        className={`w-64 h-full shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 z-40 transition-all ${isMobileMenuOpen ? "fixed inset-y-0 left-0 w-72 shadow-2xl flex z-50" : "hidden md:flex"
          }`}
      >
        <div className="space-y-6 overflow-y-auto no-scrollbar">
          {/* Sidebar Header / Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-0.5">
              <BrandLogo size="md" showTagline={true} href={`/${locale}`} />
              <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 pl-0.5">
                <Building2 className="w-3 h-3" />
                <span>Shree Ganesh Garments</span>
              </div>
            </div>
            {isMobileMenuOpen && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${isActive
                      ? "bg-indigo-900 dark:bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? "bg-amber-400 text-slate-950" : "bg-amber-500 text-slate-950"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {user && (
            <div
              onClick={() => setIsProfileModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 cursor-pointer hover:border-indigo-500/50 transition group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-900 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-sm">
                  {user.avatar_url && user.avatar_url.startsWith("data:image") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.avatar_url || user.name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {user.name}
                  </p>
                  <p className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5 border ${roleBadge.bgClass} ${roleBadge.textClass} ${roleBadge.borderClass}`}>
                    {t(roleBadge.labelKey)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                  router.push(`/${locale}/auth/signin`);
                }}
                title={t("auth.signOut")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setIsReportModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full h-10 px-3 rounded-xl bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Reports & Backup</span>
          </button>

          <div className="flex items-center justify-between gap-2">
            <LanguageDropdown />
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Scrollable Right Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto min-w-0 p-4 sm:p-8 space-y-6">
        {/* PWA Install Banner */}
        <InstallPromptBanner />

        {/* Offline Network & Sync Status Bar */}
        {(!isOnline || offlinePendingCount > 0) && (
          <div className="bg-slate-900 border border-slate-800 text-white p-3.5 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Wifi className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <WifiOff className="w-4 h-4" />
                </div>
              )}
              <div>
                <h5 className="text-xs font-bold flex items-center gap-2">
                  <span>{isOnline ? "Online Mode" : "Offline Mode (Airplane Mode)"}</span>
                  {offlinePendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                      {offlinePendingCount} Pending Sync
                    </span>
                  )}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {isOnline
                    ? "Pending offline entries will sync with idempotency keys automatically."
                    : "Entries saved locally in IndexedDB. Will sync when connection is restored."}
                </p>
              </div>
            </div>

            {offlinePendingCount > 0 && isOnline && (
              <button
                onClick={triggerSync}
                disabled={isSyncing}
                className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
              </button>
            )}
          </div>
        )}

        {/* Active Tab Content with RBAC Protection */}
        {!isCurrentTabAllowed ? (
          <AccessDeniedCard
            currentRole={currentRole}
            requestedSection={tabToSectionMap[activeTab]}
            onNavigateToAllowed={(sec) => {
              const matchedTab = (Object.keys(tabToSectionMap) as TabType[]).find(
                (k) => tabToSectionMap[k] === sec
              );
              if (matchedTab) setActiveTab(matchedTab);
            }}
          />
        ) : (
          <>
            {activeTab === "mainAdmin" && <MainAdminDashboard />}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <AnalyticsKPICards kpis={overallKPIs} />
                <LeaderboardView metrics={tailorPerformance} />
                <TailorPerformanceView metrics={tailorPerformance} />
                <LotAnalyticsView metrics={lotMetrics} />
                <OperationAnalyticsView metrics={operationMetrics} />
              </div>
            )}

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
                {!isTailor && (
                  <div className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto shadow-sm">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("entry.selectTailor")}:</label>
                    <select
                      value={selectedTailorForView}
                      onChange={(e) => setSelectedTailorForView(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                    >
                      {tailors.map((tailor) => (
                        <option key={tailor.id} value={tailor.id}>
                          {tailor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
          </>
        )}
      </main>

      {/* Reports & Data Backup Exporter Modal */}
      <ReportExporterModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        monthStr="2026-09"
        salarySummaries={salarySummaries}
        entries={entries}
        tailors={tailors}
        lots={lots}
        operations={operations}
        adjustments={adjustments}
        closedMonths={closedMonths}
        auditLogs={auditLogs}
        unitId={unitId}
      />

      {/* User Profile & Role Settings Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
