"use client";

import React, { useState, Suspense } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useTranslations } from "next-intl";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageDropdown } from "@/components/ui/LanguageDropdown";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Lock, Mail, UserCheck, Shield, ArrowRight, AlertCircle, Clock } from "lucide-react";

function SignInForm() {
  const t = useTranslations();
  const { login } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || "en";
  const redirectUrl = searchParams.get("redirect") || `/${locale}/dashboard`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPendingVerification, setIsPendingVerification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsPendingVerification(false);

    const result = login(email, password);
    if (result.success) {
      router.push(redirectUrl);
    } else if (result.status === "pending_verification") {
      setIsPendingVerification(true);
    } else if (result.status === "rejected") {
      setErrorMessage(t("auth.accountRejectedNotice"));
    } else {
      setErrorMessage(t("auth.invalidCredentials"));
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setErrorMessage(null);
    setIsPendingVerification(false);
    setEmail(demoEmail);
    const result = login(demoEmail);
    if (result.success) {
      router.push(redirectUrl);
    } else if (result.status === "pending_verification") {
      setIsPendingVerification(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC]/60 dark:bg-[#14172B] flex flex-col justify-between text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#E8DFC8] dark:border-slate-800 bg-white/80 dark:bg-[#1E2340]/80 backdrop-blur-md">
        <BrandLogo size="md" showTagline={false} href={`/${locale}`} />
        <div className="flex items-center gap-3">
          <LanguageDropdown direction="down" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="bg-white dark:bg-[#1E2340] p-8 rounded-3xl shadow-xl border border-[#E8DFC8] dark:border-slate-800 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-400 mb-1">
                <Lock className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {t("auth.loginTitle")}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("home.description")}
              </p>
            </div>

            {/* Pending Verification Notice */}
            {isPendingVerification && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs space-y-1.5 animate-fade-in">
                <div className="font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{t("auth.pendingApprovalTitle")}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/80">
                  {t("auth.pendingApprovalNotice")}
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t("auth.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@silaibook.com / 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 dark:focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 dark:focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-900/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>{t("auth.signInButton")}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t("auth.demoLogin")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin@silaibook.com")}
                  className="py-2 px-2 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 font-semibold text-xs rounded-xl border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{t("auth.loginAsMainAdmin")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("manager@silaibook.com")}
                  className="py-2 px-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-300 font-semibold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{t("auth.loginAsManager")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("tailor@silaibook.com")}
                  className="py-2 px-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{t("auth.loginAsTailor")}</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{t("auth.noAccount")} </span>
              <Link
                href={`/${locale}/auth/signup`}
                className="font-bold text-indigo-900 dark:text-indigo-400 hover:underline"
              >
                {t("auth.signUp")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-[#E8DFC8] dark:border-slate-800">
        &copy; {new Date().getFullYear()} SilaiBook &mdash; All Rights Reserved
      </footer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-900 border-t-transparent"></div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
