"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  Search,
  Check,
  UserX,
  Clock,
  Shield,
  Filter,
} from "lucide-react";
import { RegisteredUser, UserStatus } from "@/lib/auth/userRegistry";
import { Role } from "@/lib/types/payroll";
import { formatDate } from "@/lib/format";

interface AdminUserManagementProps {
  usersList: RegisteredUser[];
  onSetUserStatus: (userId: string, status: UserStatus, userName: string) => void;
  onUpdateRole: (userId: string, newRole: Role) => void;
}

export function AdminUserManagement({
  usersList,
  onSetUserStatus,
  onUpdateRole,
}: AdminUserManagementProps) {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const pendingUsers = usersList.filter((u) => u.status === "pending_verification");

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.unit_name && u.unit_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Pending Approvals Callout (If any) */}
      {pendingUsers.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t("admin.pendingApprovalsTitle")} ({pendingUsers.length})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t("admin.pendingApprovalsDesc")}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200 font-bold text-xs">
              {t("admin.awaitingReview")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {pendingUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{u.name}</div>
                  <div className="text-[11px] text-slate-400">{u.email}</div>
                  <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                    {u.unit_name || "New Garment Unit"} • Role: {t(`auth.${u.role}`)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onSetUserStatus(u.id, "approved", u.name)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t("admin.approve")}</span>
                  </button>
                  <button
                    onClick={() => onSetUserStatus(u.id, "rejected", u.name)}
                    className="px-3 py-1.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200 font-bold text-xs rounded-xl transition"
                  >
                    {t("admin.reject")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main User Directory & Access Management */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>{t("admin.globalUserDirectory")}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("admin.globalUserDirectoryDesc")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("common.search")}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-900"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none pr-2 py-1"
              >
                <option value="all">{t("common.all")} Roles</option>
                <option value="main_admin">{t("auth.mainAdmin")}</option>
                <option value="owner">{t("auth.owner")}</option>
                <option value="manager">{t("auth.manager")}</option>
                <option value="tailor">{t("auth.tailor")}</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{t("common.all")} Statuses</option>
              <option value="approved">{t("common.active")} (Approved)</option>
              <option value="pending_verification">{t("common.pending")}</option>
              <option value="rejected">Suspended / Rejected</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">{t("admin.userName")}</th>
                <th className="py-3.5 px-4">{t("admin.assignedUnit")}</th>
                <th className="py-3.5 px-4">{t("auth.role")}</th>
                <th className="py-3.5 px-4 text-center">{t("admin.status")}</th>
                <th className="py-3.5 px-4">{t("admin.registeredAt")}</th>
                <th className="py-3.5 px-4 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {t("common.noResults")}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.role === "main_admin" && (
                          <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {u.unit_name || "Radhe Krishna Garments"}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => onUpdateRole(u.id, e.target.value as Role)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none transition ${
                          u.role === "main_admin"
                            ? "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800"
                            : u.role === "owner"
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                            : u.role === "manager"
                            ? "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800"
                            : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                        }`}
                      >
                        <option value="main_admin">{t("auth.mainAdmin")}</option>
                        <option value="owner">{t("auth.owner")}</option>
                        <option value="manager">{t("auth.manager")}</option>
                        <option value="tailor">{t("auth.tailor")}</option>
                      </select>
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
                        {u.status === "approved"
                          ? t("common.active")
                          : u.status === "pending_verification"
                          ? t("common.pending")
                          : "Suspended"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {formatDate(u.created_at, "en", "short")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.status === "pending_verification" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSetUserStatus(u.id, "approved", u.name)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition"
                          >
                            <Check className="w-3 h-3" />
                            <span>{t("admin.approve")}</span>
                          </button>
                          <button
                            onClick={() => onSetUserStatus(u.id, "rejected", u.name)}
                            className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200 font-bold text-[11px] rounded-lg transition"
                          >
                            {t("admin.reject")}
                          </button>
                        </div>
                      ) : u.status === "approved" ? (
                        <button
                          onClick={() => onSetUserStatus(u.id, "rejected", u.name)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-600 dark:text-slate-400 hover:text-rose-600 font-bold text-[11px] rounded-lg transition flex items-center gap-1 ml-auto"
                        >
                          <UserX className="w-3 h-3" />
                          <span>{t("admin.suspend")}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSetUserStatus(u.id, "approved", u.name)}
                          className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 font-bold text-[11px] rounded-lg transition flex items-center gap-1 ml-auto"
                        >
                          <Check className="w-3 h-3" />
                          <span>{t("admin.reactivate")}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
