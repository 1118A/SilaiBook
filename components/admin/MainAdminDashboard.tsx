"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/context/AuthContext";
import { formatCurrency, formatPieces, formatDate } from "@/lib/format";
import {
  loadUserRegistry,
  updateUserStatus,
  RegisteredUser,
  UserStatus,
} from "@/lib/auth/userRegistry";
import {
  ShieldAlert,
  Building2,
  Users,
  Scissors,
  IndianRupee,
  Plus,
  Search,
  ArrowRight,
  Database,
  Globe2,
  Check,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface MockUnitData {
  id: string;
  name: string;
  cluster: string;
  ownerName: string;
  ownerEmail: string;
  tailorsCount: number;
  activeLotsCount: number;
  verifiedPieces: number;
  totalVolumePaise: number;
  status: "active" | "trial" | "suspended";
}

export function MainAdminDashboard() {
  const t = useTranslations();
  const { user, switchUnit } = useAuth();

  const [units, setUnits] = useState<MockUnitData[]>([
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
  ]);

  const [usersList, setUsersList] = useState<RegisteredUser[]>(() => loadUserRegistry());
  const [activeTab, setActiveTab] = useState<"units" | "users" | "verifications" | "health">("verifications");
  const [unitSearch, setUnitSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitCluster, setNewUnitCluster] = useState("");
  const [newUnitOwnerName, setNewUnitOwnerName] = useState("");
  const [newUnitOwnerEmail, setNewUnitOwnerEmail] = useState("");
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Aggregate stats
  const totalUnits = units.length;
  const totalTailors = units.reduce((acc, u) => acc + u.tailorsCount, 0);
  const totalPieces = units.reduce((acc, u) => acc + u.verifiedPieces, 0);
  const totalVolumePaise = units.reduce((acc, u) => acc + u.totalVolumePaise, 0);

  const pendingUsers = usersList.filter((u) => u.status === "pending_verification");

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.cluster.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.ownerName.toLowerCase().includes(unitSearch.toLowerCase())
  );

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.unit_name && u.unit_name.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName) return;

    const newUnit: MockUnitData = {
      id: `a0000000-0000-0000-0000-00000000000${units.length + 1}`,
      name: newUnitName,
      cluster: newUnitCluster || "Gujarat Apparel Zone",
      ownerName: newUnitOwnerName || "Unit Owner",
      ownerEmail: newUnitOwnerEmail || "owner@unit.com",
      tailorsCount: 1,
      activeLotsCount: 1,
      verifiedPieces: 0,
      totalVolumePaise: 0,
      status: "active",
    };

    setUnits([newUnit, ...units]);
    setNewUnitName("");
    setNewUnitCluster("");
    setNewUnitOwnerName("");
    setNewUnitOwnerEmail("");
    setShowAddUnitModal(false);
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
            <button
              onClick={() => setShowAddUnitModal(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t("admin.createNewUnit")}</span>
            </button>
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

      {/* Main Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("verifications")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === "verifications"
              ? "bg-purple-900 text-white shadow-md shadow-purple-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{t("admin.pendingApprovalsTab")}</span>
          {pendingUsers.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px]">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("units")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === "units"
              ? "bg-purple-900 text-white shadow-md shadow-purple-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t("admin.garmentUnitsTab")} ({units.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === "users"
              ? "bg-purple-900 text-white shadow-md shadow-purple-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t("admin.usersAndRolesTab")} ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === "health"
              ? "bg-purple-900 text-white shadow-md shadow-purple-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{t("admin.systemHealthTab")}</span>
        </button>
      </div>

      {/* Tab 0: Pending Verifications (Managers & Units) */}
      {activeTab === "verifications" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{t("admin.pendingApprovalsTitle")}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t("admin.pendingApprovalsDesc")}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
              {pendingUsers.length} {t("admin.awaitingReview")}
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {t("admin.noPendingVerifications")}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t("admin.noPendingVerificationsDesc")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">{t("admin.applicant")}</th>
                    <th className="py-3.5 px-4">{t("auth.role")}</th>
                    <th className="py-3.5 px-4">{t("admin.assignedUnit")}</th>
                    <th className="py-3.5 px-4">{t("admin.registeredAt")}</th>
                    <th className="py-3.5 px-4 text-right">{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pendingUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-amber-50/40 dark:hover:bg-amber-950/10">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            u.role === "owner"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800"
                          }`}
                        >
                          {t(`auth.${u.role}`)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {u.unit_name || "Radhe Krishna Garments"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(u.created_at, "en", "short")}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSetUserStatus(u.id, "approved", u.name)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t("admin.approveAndActivate")}</span>
                          </button>
                          <button
                            onClick={() => handleSetUserStatus(u.id, "rejected", u.name)}
                            className="px-3 py-1.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>{t("admin.reject")}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Units Management */}
      {activeTab === "units" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                placeholder={t("admin.searchUnitsPlaceholder")}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-900"
              />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t("admin.activeTenantUnit")}: <strong className="text-slate-900 dark:text-white">{user?.unit_id}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">{t("admin.unitNameAndCluster")}</th>
                  <th className="py-3.5 px-4">{t("admin.owner")}</th>
                  <th className="py-3.5 px-4 text-center">{t("admin.tailors")}</th>
                  <th className="py-3.5 px-4 text-center">{t("admin.activeLots")}</th>
                  <th className="py-3.5 px-4 text-right">{t("admin.verifiedPieces")}</th>
                  <th className="py-3.5 px-4 text-right">{t("admin.payrollVolume")}</th>
                  <th className="py-3.5 px-4 text-center">{t("admin.status")}</th>
                  <th className="py-3.5 px-4 text-right">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUnits.map((u) => {
                  const isCurrentUnit = user?.unit_id === u.id;
                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition ${
                        isCurrentUnit ? "bg-purple-50/50 dark:bg-purple-950/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{u.name}</span>
                          {isCurrentUnit && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                              {t("admin.activeCurrent")}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>{u.cluster}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{u.ownerName}</div>
                        <div className="text-[11px] text-slate-400">{u.ownerEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {u.tailorsCount}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {u.activeLotsCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                        {formatPieces(u.verifiedPieces)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-900 dark:text-indigo-400">
                        {formatCurrency(u.totalVolumePaise)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            u.status === "active"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                              : u.status === "trial"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                              : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => switchUnit(u.id)}
                          disabled={isCurrentUnit}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ml-auto ${
                            isCurrentUnit
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default"
                              : "bg-purple-900 hover:bg-purple-800 text-white shadow-sm"
                          }`}
                        >
                          <span>{isCurrentUnit ? t("admin.switched") : t("admin.switchToUnit")}</span>
                          {!isCurrentUnit && <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Users & Role Auditor */}
      {activeTab === "users" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t("admin.globalUserDirectory")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t("admin.globalUserDirectoryDesc")}
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={t("common.search")}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">{t("admin.userName")}</th>
                  <th className="py-3.5 px-4">{t("admin.assignedUnit")}</th>
                  <th className="py-3.5 px-4">{t("auth.role")}</th>
                  <th className="py-3.5 px-4 text-center">{t("admin.status")}</th>
                  <th className="py-3.5 px-4 text-right">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {u.unit_name || "Radhe Krishna Garments"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === "main_admin"
                            ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                            : u.role === "owner"
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                            : u.role === "manager"
                            ? "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                            : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.status === "approved"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            : u.status === "pending_verification"
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                            : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.status === "pending_verification" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSetUserStatus(u.id, "approved", u.name)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition"
                          >
                            <Check className="w-3 h-3" />
                            <span>{t("admin.approve")}</span>
                          </button>
                          <button
                            onClick={() => handleSetUserStatus(u.id, "rejected", u.name)}
                            className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200 font-bold text-[11px] rounded-lg transition"
                          >
                            {t("admin.reject")}
                          </button>
                        </div>
                      ) : u.status === "approved" ? (
                        <button
                          onClick={() => handleSetUserStatus(u.id, "rejected", u.name)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-600 dark:text-slate-400 hover:text-rose-600 font-bold text-[11px] rounded-lg transition"
                        >
                          {t("admin.suspend")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSetUserStatus(u.id, "approved", u.name)}
                          className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 font-bold text-[11px] rounded-lg transition"
                        >
                          {t("admin.reactivate")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: System Health */}
      {activeTab === "health" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>{t("admin.databaseRlsStatus")}</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Supabase Postgres RLS
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Enforced (100%)</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Daily Automated Backups
                </span>
                <span className="text-slate-500 font-medium">Daily at 02:00 IST</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Precision Money Integrity
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Zero Float Loss (Integer Paise)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-indigo-600" />
              <span>{t("admin.localeDistribution")}</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>ગુજરાતી (Gujarati)</span>
                  <span>58%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "58%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>हिन्दी (Hindi)</span>
                  <span>27%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "27%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>English</span>
                  <span>15%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "15%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Unit */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("admin.createNewUnit")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t("admin.createNewUnitDesc")}
            </p>

            <form onSubmit={handleCreateUnit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t("admin.unitName")}
                </label>
                <input
                  type="text"
                  required
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder="e.g. Radhe Krishna Garments"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t("admin.clusterLocation")}
                </label>
                <input
                  type="text"
                  value={newUnitCluster}
                  onChange={(e) => setNewUnitCluster(e.target.value)}
                  placeholder="e.g. Surat Textile Market, Gujarat"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t("admin.ownerName")}
                </label>
                <input
                  type="text"
                  value={newUnitOwnerName}
                  onChange={(e) => setNewUnitOwnerName(e.target.value)}
                  placeholder="e.g. Pravinbhai Patel"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t("admin.ownerEmail")}
                </label>
                <input
                  type="email"
                  value={newUnitOwnerEmail}
                  onChange={(e) => setNewUnitOwnerEmail(e.target.value)}
                  placeholder="owner@radhegarments.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUnitModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-900/25 transition"
                >
                  {t("admin.saveUnit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
