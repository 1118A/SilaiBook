import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <Link
            href="/en/dashboard"
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Terms of Service (શરતો / नियम और शर्तें)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              SilaiBook Piece-Rate Payroll System • Effective: October 2026
            </p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
              <span>1. Usage Scope & Unit Responsibilities</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              SilaiBook provides piece-rate entry, verification, and salary calculation tools for garment manufacturing units in India. Factory owners and supervisors are responsible for verifying tailor piece entries and confirming monthly rates before closing salary periods.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>2. Integer Money & Verified Entry Guarantee</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All financial calculations in SilaiBook are performed using exact integer paise arithmetic to eliminate floating-point rounding errors. Only verified entries approved by authorized managers count towards final salary payout calculations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>3. Offline Sync & Idempotency</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              SilaiBook includes offline IndexedDB queuing. Users agree that when reconnecting online, server verified entries take precedence. Duplicate submissions are automatically prevented using unique idempotency keys.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
