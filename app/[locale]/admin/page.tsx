"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  LogOut,
  ExternalLink,
  Shield,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AccessDeniedCard } from "@/components/auth/AccessDeniedCard";
import { MainAdminDashboard } from "@/components/admin/MainAdminDashboard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageDropdown } from "@/components/ui/LanguageDropdown";
import { BrandLogo } from "@/components/ui/BrandLogo";
import dynamic from "next/dynamic";

const UserProfileModal = dynamic(
  () => import("@/components/profile/UserProfileModal").then((m) => m.UserProfileModal),
  { ssr: false }
);

function AdminDashboardContent() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Strict RBAC Guard: Only main_admin can access the dedicated Admin Dashboard
  if (user && user.role !== "main_admin") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <AccessDeniedCard
          currentRole={user.role}
          requestedSection="main_admin_overview"
          onNavigateToAllowed={() => router.push(`/${locale}/dashboard`)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Super Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand + Super Admin Tag */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showTagline={false} href={`/${locale}/admin`} />
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{t("admin.superAdminConsole")}</span>
            </div>
          </div>

          {/* Center / Fast Link: Switch to Factory Floor View */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
              title="Open shop floor factory dashboard"
            >
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">{t("nav.dashboard")}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>

          {/* Right: Controls & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageDropdown direction="down" />
            <ThemeToggle />

            {/* Profile Avatar & Details */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition text-left"
              title={t("profile.editProfileTitle")}
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.name?.[0] || "A"}
              </div>
              <div className="hidden lg:block text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase">
                  {t("auth.mainAdmin")}
                </p>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition"
              title={t("auth.signOut")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Console Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <MainAdminDashboard />
      </main>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
