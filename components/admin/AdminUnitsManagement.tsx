"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Building2,
  Search,
  Plus,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, formatPieces } from "@/lib/format";

export interface MockUnitData {
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

interface AdminUnitsManagementProps {
  units: MockUnitData[];
  currentUnitId?: string;
  onSwitchUnit: (unitId: string) => void;
  onCreateUnit: (unit: Omit<MockUnitData, "id">) => void;
}

export function AdminUnitsManagement({
  units,
  currentUnitId,
  onSwitchUnit,
  onCreateUnit,
}: AdminUnitsManagementProps) {
  const t = useTranslations();
  const [unitSearch, setUnitSearch] = useState("");
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitCluster, setNewUnitCluster] = useState("");
  const [newUnitOwnerName, setNewUnitOwnerName] = useState("");
  const [newUnitOwnerEmail, setNewUnitOwnerEmail] = useState("");

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.cluster.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.ownerName.toLowerCase().includes(unitSearch.toLowerCase())
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) return;

    onCreateUnit({
      name: newUnitName.trim(),
      cluster: newUnitCluster.trim() || "Gujarat Apparel Zone",
      ownerName: newUnitOwnerName.trim() || "Unit Owner",
      ownerEmail: newUnitOwnerEmail.trim() || "owner@unit.com",
      tailorsCount: 1,
      activeLotsCount: 1,
      verifiedPieces: 0,
      totalVolumePaise: 0,
      status: "active",
    });

    setNewUnitName("");
    setNewUnitCluster("");
    setNewUnitOwnerName("");
    setNewUnitOwnerEmail("");
    setShowAddUnitModal(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4">
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>{t("admin.garmentUnitsTab")} ({units.length})</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of multi-tenant factory clusters across India.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={unitSearch}
              onChange={(e) => setUnitSearch(e.target.value)}
              placeholder={t("admin.searchUnitsPlaceholder")}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-900"
            />
          </div>

          <button
            onClick={() => setShowAddUnitModal(true)}
            className="px-3.5 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t("admin.createNewUnit")}</span>
          </button>
        </div>
      </div>

      {/* Units Table */}
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
              const isCurrentUnit = currentUnitId === u.id;
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
                      onClick={() => onSwitchUnit(u.id)}
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

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-3.5">
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
