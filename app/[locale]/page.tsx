"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const [showToast, setShowToast] = useState(false);

  const locales = [
    { code: "en", label: "English" },
    { code: "gu", label: "ગુજરાતી" },
    { code: "hi", label: "हिन्दी" },
  ];

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧵</span>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              {t("common.appName")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {locales.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}`}
                className={`px-2.5 py-1 rounded-md text-sm font-medium transition-colors ${
                  locale === l.code
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          {/* Logo / Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/25">
            🧵
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              {t("home.welcome")}
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            {t("home.description")}
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-base shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              id="btn-get-started"
              onClick={() => setShowToast(true)}
            >
              {t("home.getStarted")}
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div id="features" className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
          {/* Manager Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-violet-300 dark:hover:border-violet-700 transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xl mb-3">
                📋
              </div>
              <h2 className="font-bold text-lg mb-1.5">{t("home.forManagers")}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("home.managersDescription")}
              </p>
            </div>
          </div>

          {/* Tailor Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/40 flex items-center justify-center text-xl mb-3">
                ✂️
              </div>
              <h2 className="font-bold text-lg mb-1.5">{t("home.forTailors")}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("home.tailorsDescription")}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          {t("common.appName")} &mdash; {t("common.tagline")}
        </p>
      </footer>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xl text-sm font-medium">
            <span className="text-lg">🚀</span>
            <span>Sign-in coming soon — stay tuned!</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-white/60 dark:text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
