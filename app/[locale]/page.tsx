"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ClipboardCheck,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageDropdown } from "@/components/ui/LanguageDropdown";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useAuth } from "@/lib/context/AuthContext";

export default function HomePage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dashboardTarget = isAuthenticated ? `/${locale}/dashboard` : `/${locale}/auth/signin?redirect=${encodeURIComponent(`/${locale}/dashboard`)}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EC]/70 text-slate-900 dark:bg-[#14172B] dark:text-slate-100 font-sans selection:bg-indigo-900 selection:text-white transition-colors duration-200">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(43,58,140,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(142,155,255,0.08),rgba(0,0,0,0))] pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="relative z-50 border-b border-[#E8DFC8] dark:border-slate-800/80 bg-white/80 dark:bg-[#1E2340]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left Side: Mobile Hamburger Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <BrandLogo size="md" showTagline={false} href={`/${locale}`} />
          </div>

          {/* Desktop Right Navigation Menu */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageDropdown direction="down" />
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/dashboard`}
                  className="px-4 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold transition shadow-sm hover:shadow-indigo-900/20"
                >
                  {t("nav.dashboard")}
                </Link>
                <button
                  onClick={logout}
                  title={t("auth.signOut")}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/auth/signin`}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                >
                  {t("auth.signIn")}
                </Link>
                <Link
                  href={`/${locale}/auth/signup`}
                  className="px-4 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold transition shadow-sm hover:shadow-indigo-900/20"
                >
                  {t("auth.signUp")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link
                href={`/${locale}/dashboard`}
                className="px-3 py-1.5 rounded-xl bg-indigo-900 text-white text-xs font-semibold"
              >
                {t("nav.dashboard")}
              </Link>
            ) : (
              <Link
                href={`/${locale}/auth/signin`}
                className="px-3 py-1.5 rounded-xl bg-indigo-900 text-white text-xs font-semibold"
              >
                {t("auth.signIn")}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer / Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-4 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Language Selection
              </span>
              <LanguageDropdown direction="down" />
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
              >
                <span>{t("nav.dashboard")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex justify-around pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <Link href={`/${locale}/privacy`} onClick={() => setIsMobileMenuOpen(false)}>
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href={`/${locale}/terms`} onClick={() => setIsMobileMenuOpen(false)}>
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Modern Piece-Rate Payroll System for India</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Piece-rate payroll <br />
            <span className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-amber-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-amber-400 bg-clip-text text-transparent">
              built for speed & accuracy
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
            {t("home.description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={dashboardTarget}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-semibold text-sm shadow-lg shadow-indigo-900/25 transition-all flex items-center justify-center gap-2 group"
              id="btn-get-started"
            >
              <span>{t("home.getStarted")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {/* Manager Card */}
          <div className="rounded-2xl border border-[#E8DFC8] dark:border-slate-800 bg-white dark:bg-[#1E2340] p-6 backdrop-blur-sm shadow-sm transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t("home.forManagers")}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t("home.managersDescription")}
            </p>
          </div>

          {/* Tailor Card */}
          <div className="rounded-2xl border border-[#E8DFC8] dark:border-slate-800 bg-white dark:bg-[#1E2340] p-6 backdrop-blur-sm shadow-sm transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t("home.forTailors")}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t("home.tailorsDescription")}
            </p>
          </div>

          {/* Enterprise Card */}
          <div className="rounded-2xl border border-[#E8DFC8] dark:border-slate-800 bg-white dark:bg-[#1E2340] p-6 backdrop-blur-sm shadow-sm transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Multi-Unit Isolation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Row Level Security ensures unit data is 100% isolated, audited, and secure.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
          <span>{t("common.appName")} &mdash; {t("common.tagline")}</span>
        </div>
      </footer>
    </div>
  );
}
