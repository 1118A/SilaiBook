import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Server } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              Privacy Policy (ગોપનીયતા નીતિ / गोपनीयता नीति)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              SilaiBook Piece-Rate Payroll System • Last updated: October 2026
            </p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-6 h-6 shrink-0" />
            <p className="text-xs font-semibold">
              SilaiBook is designed for Indian garment manufacturing units. We prioritize strict data isolation, integer-based accuracy, and zero unauthorized data access.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
              <span>1. Data We Collect</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We collect minimal data required to manage factory piece-rate operations:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-2">
              <li><strong>Tailor & Worker Information:</strong> Name, optional mobile number, active status, unit assignment.</li>
              <li><strong>Garment Production Data:</strong> Lot numbers, style names, operation names, piece counts, rate per piece (in integer paise).</li>
              <li><strong>Verification Audit Trail:</strong> Entry status (pending, verified, rejected), manager timestamps, and review notes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
              <span>2. Storage & Security</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All factory data is isolated per manufacturing unit using Row Level Security (RLS) on PostgreSQL database instances. Data transmitted over the network is encrypted using TLS 1.3 / HTTPS. Offline entries are stored locally on your device in browser IndexedDB with idempotency keys.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
              <span>3. Data Ownership & WhatsApp Sharing</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Factory owners retain 100% ownership of their payroll data. Salary slips generated or shared via WhatsApp are initiated strictly on-demand by factory managers using the browser&apos;s Web Share API. We never sell, monetize, or share worker data with third-party advertisers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
