"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ShieldX, ArrowRight, Lock } from "lucide-react";
import { Role } from "@/lib/types/payroll";
import { getDefaultSection, getRoleBadgeInfo, SectionKey } from "@/lib/auth/permissions";

interface AccessDeniedCardProps {
  currentRole: Role;
  requestedSection: SectionKey;
  onNavigateToAllowed: (section: SectionKey) => void;
}

export function AccessDeniedCard({
  currentRole,
  requestedSection,
  onNavigateToAllowed,
}: AccessDeniedCardProps) {
  const t = useTranslations();
  const defaultSec = getDefaultSection(currentRole);
  const badge = getRoleBadgeInfo(currentRole);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto text-center shadow-lg my-8">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
        <ShieldX className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 border ${badge.borderClass} ${badge.bgClass} ${badge.textClass}">
        <Lock className="w-3.5 h-3.5" />
        <span>{t("auth.restrictedAccess")}</span>
      </div>

      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
        {t("auth.accessDeniedTitle")}
      </h2>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
        {t("auth.accessDeniedDescription", {
          role: t(badge.labelKey),
          section: requestedSection,
        })}
      </p>

      <div className="mt-6">
        <button
          onClick={() => onNavigateToAllowed(defaultSec)}
          className="w-full py-3 px-4 bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 transition"
        >
          <span>{t("auth.returnToAllowedSection")}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
