"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Package,
  Zap,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NumberPad } from "@/components/entry/NumberPad";

export default function DesignShowcasePage() {
  const [padVal, setPadVal] = useState<number>(125);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-4 sm:p-8 space-y-8 font-sans">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/en/dashboard" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              SilaiBook Design System — &quot;Ledger Meets Fabric&quot;
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Tactile, high-contrast, mobile-first piece-rate payroll components
            </p>
          </div>
        </div>

        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Color Tokens Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-dashed border-slate-300 dark:border-slate-800 pb-2">
            1. Brand & Theme Color Tokens
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-[#2B3A8C] text-white space-y-1 shadow-sm">
              <div className="text-xs font-mono font-bold">#2B3A8C</div>
              <div className="text-xs font-semibold opacity-90">Deep Indigo</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#E9A21B] text-slate-950 space-y-1 shadow-sm">
              <div className="text-xs font-mono font-bold">#E9A21B</div>
              <div className="text-xs font-semibold opacity-90">Turmeric Amber</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FBF6EC] border border-amber-200 text-slate-950 space-y-1 shadow-sm">
              <div className="text-xs font-mono font-bold">#FBF6EC</div>
              <div className="text-xs font-semibold opacity-90">Cloth Cream</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#14172B] text-white space-y-1 shadow-sm">
              <div className="text-xs font-mono font-bold">#14172B</div>
              <div className="text-xs font-semibold opacity-90">Night Ink</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#B3382A] text-white space-y-1 shadow-sm">
              <div className="text-xs font-mono font-bold">#B3382A</div>
              <div className="text-xs font-semibold opacity-90">Madder Red (Reject)</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#2E7D4F] text-white space-y-1 shadow-sm">
              <div className="text-xs font-mono font-bold">#2E7D4F</div>
              <div className="text-xs font-semibold opacity-90">Leaf Green (Verify)</div>
            </div>
          </div>
        </section>

        {/* Buttons & Touch Targets */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-dashed border-slate-300 dark:border-slate-800 pb-2">
            2. High-Touch Target Buttons (Min 48px height)
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <button className="h-12 px-6 rounded-xl bg-indigo-900 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Primary Action (48px)</span>
            </button>

            <button className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve / Verify</span>
            </button>

            <button className="h-12 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md transition flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>Reject Entry</span>
            </button>

            <button className="h-12 px-6 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Secondary Action</span>
            </button>
          </div>
        </section>

        {/* Tactile Progress & Tape Measure */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-dashed border-slate-300 dark:border-slate-800 pb-2">
            3. Signature Motif — Stitched Dividers & Tape Measure Progress
          </h2>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
                <span>Tape Measure Progress (LOT-2026-001)</span>
              </span>
              <span className="text-indigo-900 dark:text-indigo-400">75% Complete</span>
            </div>

            {/* Tape measure styled progress bar */}
            <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-300 dark:border-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-900 via-amber-500 to-emerald-500 rounded-full" style={{ width: "75%" }} />
            </div>
          </div>
        </section>

        {/* On-Screen Touch Number Pad Component */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-dashed border-slate-300 dark:border-slate-800 pb-2">
            4. Tailor Rapid Number Pad Component
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-sm">
              <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Current Output Value</div>
              <div className="text-5xl font-black text-indigo-900 dark:text-indigo-400">{padVal} pcs</div>
            </div>

            <NumberPad value={padVal} onChange={(v) => setPadVal(v)} />
          </div>
        </section>
      </div>
    </div>
  );
}
