"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageDropdown } from "@/components/ui/LanguageDropdown";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { UserPlus, Mail, User, Lock, ArrowRight, Clock } from "lucide-react";
import { Role } from "@/lib/types/payroll";

export default function SignUpPage() {
  const t = useTranslations();
  const { signup } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("owner");
  const [isPendingVerification, setIsPendingVerification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signup(name || "New User", email || "user@silaibook.com", role);
    if (result.success) {
      router.push(`/${locale}/dashboard`);
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
          <div className="bg-white dark:bg-[#1E2340] p-8 rounded-3xl shadow-xl border border-[#E8DFC8] dark:border-slate-800 space-y-6">
            {isPendingVerification ? (
              <div className="text-center space-y-4 py-4 animate-fade-in">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {t("auth.pendingApprovalTitle")}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed px-2">
                  {t("auth.pendingApprovalNotice")}
                </p>
                <div className="pt-4">
                  <Link
                    href={`/${locale}/auth/signin`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-lg transition"
                  >
                    <span>{t("auth.signIn")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-400 mb-1">
                    <UserPlus className="h-7 w-7" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                    {t("auth.signupTitle")}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Register your unit or tailor account
                  </p>
                </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ramesh Patel"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 dark:focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t("auth.role")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["owner", "manager", "tailor"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-2.5 text-xs font-semibold rounded-xl border transition-all capitalize ${
                        role === r
                          ? "bg-indigo-900 dark:bg-indigo-600 text-white border-indigo-900 dark:border-indigo-600 shadow-md scale-[1.02]"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {t(`auth.${r}`)}
                    </button>
                  ))}
                </div>
              </div>

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
                    placeholder="manager@silaibook.com / 9876543210"
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
                <span>{t("auth.createAccount")}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{t("auth.haveAccount")} </span>
              <Link
                href={`/${locale}/auth/signin`}
                className="font-bold text-indigo-900 dark:text-indigo-400 hover:underline"
              >
                {t("auth.signIn")}
              </Link>
            </div>
          </>
        )}
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
