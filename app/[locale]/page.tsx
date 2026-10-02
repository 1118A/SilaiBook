"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Scissors,
  ClipboardCheck,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const locales = [
    { code: "en", label: "English" },
    { code: "gu", label: "ગુજરાતી" },
    { code: "hi", label: "हिन्दी" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-white">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      {/* Navigation Bar */}
      <nav className="relative z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-sm">
              <Scissors className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {t("common.appName")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
              {locales.map((l) => (
                <Link
                  key={l.code}
                  href={`/${l.code}`}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    locale === l.code
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <Link
              href={`/${locale}/dashboard`}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition shadow-sm hover:shadow-violet-600/20"
            >
              {t("nav.dashboard")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Modern Piece-Rate Payroll System for India</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Piece-rate payroll <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
              built for speed & accuracy
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
            {t("home.description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={`/${locale}/dashboard`}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 group"
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
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-slate-700 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">{t("home.forManagers")}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("home.managersDescription")}
            </p>
          </div>

          {/* Tailor Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-slate-700 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">{t("home.forTailors")}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("home.tailorsDescription")}
            </p>
          </div>

          {/* Enterprise Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-slate-700 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Multi-Unit Isolation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Row Level Security ensures unit data is 100% isolated, audited, and secure.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{t("common.appName")} &mdash; {t("common.tagline")}</span>
        </div>
      </footer>
    </div>
  );
}
