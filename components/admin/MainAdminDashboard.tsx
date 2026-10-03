"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/context/AuthContext";
import { formatCurrency, formatPieces } from "@/lib/format";
import {
  loadUserRegistry,
  updateUserStatus,
  saveUserRegistry,
  RegisteredUser,
  UserStatus,
} from "@/lib/auth/userRegistry";
import { Role } from "@/lib/types/payroll";
import {
  ShieldAlert,
  Building2,
  Users,
  Scissors,
  IndianRupee,
  TrendingUp,
  UserCheck,
  History,
  Settings,
  CheckCircle2,
} from "lucide-react";

import { GrowthAnalyticsReport } from "./GrowthAnalyticsReport";
import { AdminUserManagement } from "./AdminUserManagement";
import { AdminUnitsManagement, MockUnitData } from "./AdminUnitsManagement";
import { AdminActivityLogs } from "./AdminActivityLogs";
import { AdminSystemSettings } from "./AdminSystemSettings";

const INITIAL_UNITS: MockUnitData[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    name: "Radhe Krishna Garments (સુરત)",
    cluster: "Surat Textile Market, Gujarat",
    ownerName: "Pravinbhai Patel",
    ownerEmail: "owner@radhegarments.com",
    tailorsCount: 12,
    activeLotsCount: 8,
    verifiedPieces: 45200,
    totalVolumePaise: 38420000, // ₹3,84,200.00
    status: "active",
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    name: "Ambica Stitching Works (અમદાવાદ)",
    cluster: "Narol Industrial Zone, Ahmedabad",
    ownerName: "Hasmukh Shah",
    ownerEmail: "hasmukh@ambicastitch.com",
    tailorsCount: 8,
    activeLotsCount: 5,
    verifiedPieces: 28400,
    totalVolumePaise: 24140000, // ₹2,41,400.00
    status: "active",
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    name: "Shree Ganesh Fashion Hub (સુરત)",
    cluster: "Udhna GIDC, Surat",
    ownerName: "Bhavin Desai",
    ownerEmail: "bhavin@shreeganesh.com",
    tailorsCount: 15,
    activeLotsCount: 11,
    verifiedPieces: 62100,
    totalVolumePaise: 52785000, // ₹5,27,850.00
    status: "trial",
  },
  {
    id: "a0000000-0000-0000-0000-000000000004",
    name: "Maruti Tex Fab (તિરૂપુર)",
    cluster: "Tirupur Apparel Park, Tamil Nadu",
    ownerName: "Ketan Vaghasiya",
    ownerEmail: "ketan@marutitex.com",
    tailorsCount: 22,
    activeLotsCount: 14,
    verifiedPieces: 98000,
    totalVolumePaise: 83300000, // ₹8,33,000.00
    status: "active",
  },
];

type AdminTab = "growth" | "users" | "units" | "activity" | "settings";

export function MainAdminDashboard() {
  const t = useTranslations();
  const { user, switchUnit } = useAuth();

  const [units, setUnits] = useState<MockUnitData[]>(INITIAL_UNITS);
  const [usersList, setUsersList] = useState<RegisteredUser[]>(() => loadUserRegistry());
  const [activeTab, setActiveTab] = useState<AdminTab>("growth");
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // High-level Aggregated Stats
  const totalUnits = units.length;
  const totalTailors = units.reduce((acc, u) => acc + u.tailorsCount, 0);
  const totalPieces = units.reduce((acc, u) => acc + u.verifiedPieces, 0);
  const totalVolumePaise = units.reduce((acc, u) => acc + u.totalVolumePaise, 0);

  const pendingUsersCount = usersList.filter((u) => u.status === "pending_verification").length;

  const handleCreateUnit = (newUnitData: Omit<MockUnitData, "id">) => {
    const newUnit: MockUnitData = {
      ...newUnitData,
      id: `a0000000-0000-0000-0000-00000000000${units.length + 1}`,
    };
    setUnits([newUnit, ...units]);
    setSuccessBanner(t("admin.unitRegisteredSuccess"));
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleSetUserStatus = (userId: string, status: UserStatus, userName: string) => {
    const updated = updateUserStatus(userId, status);
    setUsersList(updated);
    setSuccessBanner(
      status === "approved"
        ? `${userName} (${t("admin.approvedAndActivated")})`
        : `${userName} (${t("admin.accountRejected")})`
    );
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleUpdateRole = (userId: string, newRole: Role) => {
    const updated = usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setUsersList(updated);
    saveUserRegistry(updated);
    setSuccessBanner(`Role updated to ${newRole}`);
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-500/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
              <span>{t("admin.superAdminConsole")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t("admin.title")}
            </h1>
            <p className="text-purple-200/80 text-sm mt-1 max-w-xl">
              {t("admin.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t("admin.allSystemsOperational")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Global Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("admin.totalGarmentUnits")}
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {totalUnits}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold ml-2">
              4 clusters
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("admin.totalActiveTailors")}
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {formatPieces(totalTailors)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-2">
              across India
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("admin.totalVerifiedPieces")}
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Scissors className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {formatPieces(totalPieces)}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold ml-2">
              99.2% rate
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("admin.platformPayrollVolume")}
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalVolumePaise)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-2">
              paise precision
            </span>
          </div>
        </div>
      </div>

      {/* Restructured Main Admin Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("growth")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "growth"
              ? "bg-purple-900 text-white shadow-md shadow-purple-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>{t("admin.growthAnalyticsTab")}</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "users"
              ? "bg-purple-900 text-white shadow-md shadow-purple-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t("admin.userManagementTab")} ({usersList.length})</span>
          {pendingUsersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px]">
              {pendingUsersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("units")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "units"
              ? "bg-purple-900 text-white shadow-md shadow-purple-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t("admin.garmentUnitsTab")} ({units.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "activity"
              ? "bg-purple-900 text-white shadow-md shadow-purple-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t("admin.activityLogsTab")}</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "settings"
              ? "bg-purple-900 text-white shadow-md shadow-purple-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t("admin.systemSettingsTab")}</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "growth" && (
        <GrowthAnalyticsReport totalTailorsCount={totalTailors} />
      )}

      {activeTab === "users" && (
        <AdminUserManagement
          usersList={usersList}
          onSetUserStatus={handleSetUserStatus}
          onUpdateRole={handleUpdateRole}
        />
      )}

      {activeTab === "units" && (
        <AdminUnitsManagement
          units={units}
          currentUnitId={user?.unit_id}
          onSwitchUnit={switchUnit}
          onCreateUnit={handleCreateUnit}
        />
      )}

      {activeTab === "activity" && <AdminActivityLogs />}

      {activeTab === "settings" && <AdminSystemSettings />}
    </div>
  );
}
