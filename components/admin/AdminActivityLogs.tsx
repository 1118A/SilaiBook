"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  Building2,
  FileCheck2,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { formatDate } from "@/lib/format";

export interface PlatformActivityEvent {
  id: string;
  category: "AUTH" | "ROLE_UPDATE" | "VERIFICATION" | "UNIT" | "SYSTEM" | "SALARY";
  actorName: string;
  actorEmail: string;
  actionTitle: string;
  targetResource: string;
  details?: string;
  timestamp: string;
  status: "success" | "warning" | "info";
}

const INITIAL_ACTIVITY_LOGS: PlatformActivityEvent[] = [
  {
    id: "act_101",
    category: "ROLE_UPDATE",
    actorName: "Super Admin (Platform)",
    actorEmail: "admin@silaibook.com",
    actionTitle: "Assigned Role 'manager' to Ramesh Manager",
    targetResource: "usr_mgr_01",
    details: "Unit: Radhe Krishna Garments (Surat)",
    timestamp: "2026-10-03T14:45:00Z",
    status: "success",
  },
  {
    id: "act_102",
    category: "UNIT",
    actorName: "Pravinbhai Patel",
    actorEmail: "owner@radhegarments.com",
    actionTitle: "Created Garment Unit 'Radhe Krishna Garments'",
    targetResource: "unit_surat_01",
    details: "Cluster: Surat Textile Market, Gujarat",
    timestamp: "2026-10-03T14:10:00Z",
    status: "success",
  },
  {
    id: "act_103",
    category: "VERIFICATION",
    actorName: "Ramesh Manager",
    actorEmail: "manager@silaibook.com",
    actionTitle: "Bulk Verified 45 piece entries for Day Shift",
    targetResource: "entries_batch_09",
    details: "Tailor: Suresh Kumar (Lot: LOT-2026-001)",
    timestamp: "2026-10-03T13:30:00Z",
    status: "success",
  },
  {
    id: "act_104",
    category: "SYSTEM",
    actorName: "Super Admin (Platform)",
    actorEmail: "admin@silaibook.com",
    actionTitle: "Updated Global 2FA Policy for Managers",
    targetResource: "security_policy",
    details: "Enforced OTP validation on manager login",
    timestamp: "2026-10-03T11:15:00Z",
    status: "info",
  },
  {
    id: "act_105",
    category: "AUTH",
    actorName: "Suresh Tailor",
    actorEmail: "tailor@silaibook.com",
    actionTitle: "Tailor Mobile Login from Android PWA",
    targetResource: "usr_tailor_01",
    details: "IP: 103.212.144.18 (Surat)",
    timestamp: "2026-10-03T09:00:00Z",
    status: "success",
  },
  {
    id: "act_106",
    category: "SALARY",
    actorName: "Ramesh Manager",
    actorEmail: "manager@silaibook.com",
    actionTitle: "Locked & Closed Salary Month 2026-09",
    targetResource: "salary_month_2026_09",
    details: "Verified Payroll Total: ₹3,84,200.00",
    timestamp: "2026-10-02T19:00:00Z",
    status: "success",
  },
  {
    id: "act_107",
    category: "AUTH",
    actorName: "Unknown User",
    actorEmail: "intruder@unknown.com",
    actionTitle: "Failed Login Attempt (Invalid Password)",
    targetResource: "auth_gateway",
    details: "3 consecutive failures detected",
    timestamp: "2026-10-02T16:20:00Z",
    status: "warning",
  },
];

export function AdminActivityLogs() {
  const t = useTranslations();
  const [logs] = useState<PlatformActivityEvent[]>(INITIAL_ACTIVITY_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesCategory =
      selectedCategory === "ALL" || log.category === selectedCategory;
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: PlatformActivityEvent["category"]) => {
    switch (category) {
      case "AUTH":
        return <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "ROLE_UPDATE":
        return <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "UNIT":
        return <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "VERIFICATION":
        return <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "SYSTEM":
        return <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case "SALARY":
        return <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <History className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4">
      {/* Header & Filter Bar */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>{t("admin.activityLogTitle")}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("admin.activityLogDesc")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
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

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none pr-2 py-1"
            >
              <option value="ALL">{t("admin.allActions")}</option>
              <option value="AUTH">Authentication / Logins</option>
              <option value="ROLE_UPDATE">Role Modifications</option>
              <option value="UNIT">Garment Units & Tenants</option>
              <option value="VERIFICATION">Piece Verifications</option>
              <option value="SALARY">Salary Calculations & Closes</option>
              <option value="SYSTEM">System & Security</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4">{t("admin.eventAction")}</th>
              <th className="py-3.5 px-4">{t("admin.actor")}</th>
              <th className="py-3.5 px-4">{t("admin.target")}</th>
              <th className="py-3.5 px-4">{t("admin.timestamp")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  {t("common.noResults")}
                </td>
              </tr>
            ) : (
              filteredLogs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{item.actionTitle}</span>
                          {item.status === "warning" && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px] flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Warning</span>
                            </span>
                          )}
                        </div>
                        {item.details && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.details}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.actorName}
                    </div>
                    <div className="text-[11px] text-slate-400">{item.actorEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-indigo-900 dark:text-indigo-400 font-medium">
                    {item.targetResource}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] tabular-nums whitespace-nowrap">
                    {formatDate(item.timestamp, "en", "long")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
