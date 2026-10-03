"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { X, Printer, QrCode, Scissors } from "lucide-react";
import { Lot, Operation } from "@/lib/types/payroll";

interface BundleTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: Lot | null;
  operations: Operation[];
}

export function BundleTicketModal({
  isOpen,
  onClose,
  lot,
  operations,
}: BundleTicketModalProps) {
  const t = useTranslations();

  if (!isOpen || !lot) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col text-slate-900 dark:text-white animate-fade-in">
        {/* Modal Controls Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">
              {t("lots.bundleTicketTitle")}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Bundle Ticket Voucher Card */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/50">
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-purple-400/60 rounded-2xl p-5 shadow-sm space-y-4 text-center">
            {/* Factory Brand & Lot Number */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1">
                <Scissors className="w-3.5 h-3.5" />
                <span>Shree Ganesh Garments (સુરત)</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                {lot.lot_no}
              </h2>
              <div className="text-xs font-semibold text-slate-500">
                {lot.style}
              </div>
            </div>

            {/* Visual Simulated High-Contrast QR Code for Scanning */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="w-40 h-40 bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-md flex flex-col items-center justify-center relative">
                {/* SVG QR Code Pattern */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-slate-950"
                  fill="currentColor"
                >
                  {/* Top-left position marker */}
                  <rect x="10" y="10" width="25" height="25" fill="black" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="19" y="19" width="7" height="7" fill="black" />

                  {/* Top-right position marker */}
                  <rect x="65" y="10" width="25" height="25" fill="black" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="74" y="19" width="7" height="7" fill="black" />

                  {/* Bottom-left position marker */}
                  <rect x="10" y="65" width="25" height="25" fill="black" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="19" y="74" width="7" height="7" fill="black" />

                  {/* Data Modules */}
                  <rect x="42" y="12" width="6" height="6" fill="black" />
                  <rect x="52" y="18" width="6" height="6" fill="black" />
                  <rect x="42" y="28" width="6" height="6" fill="black" />
                  <rect x="12" y="44" width="6" height="6" fill="black" />
                  <rect x="22" y="48" width="6" height="6" fill="black" />
                  <rect x="32" y="42" width="6" height="6" fill="black" />
                  <rect x="45" y="45" width="10" height="10" fill="black" />
                  <rect x="62" y="42" width="6" height="6" fill="black" />
                  <rect x="78" y="48" width="6" height="6" fill="black" />
                  <rect x="45" y="65" width="6" height="6" fill="black" />
                  <rect x="55" y="72" width="6" height="6" fill="black" />
                  <rect x="72" y="65" width="6" height="6" fill="black" />
                  <rect x="65" y="78" width="6" height="6" fill="black" />
                  <rect x="82" y="82" width="6" height="6" fill="black" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="p-1 rounded-md bg-white border border-slate-900 text-[9px] font-mono font-black text-slate-950">
                    PALLA
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-slate-400 mt-2">
                ID: {lot.id.substring(0, 18)}…
              </span>
            </div>

            {/* Bundle Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Target Total
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {lot.total_pieces} pcs
                </span>
              </div>

              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60">
                <span className="text-[10px] text-purple-700 dark:text-purple-300 uppercase font-bold block">
                  Bundle Size
                </span>
                <span className="font-black text-purple-900 dark:text-purple-200">
                  25 Pieces / Chit
                </span>
              </div>
            </div>

            {/* Operations Covered */}
            <div className="text-left space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Standard Operations:
              </span>
              <div className="flex flex-wrap gap-1">
                {operations.slice(0, 3).map((op) => (
                  <span
                    key={op.id}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                  >
                    {op.name} (₹{(op.default_rate_paise / 100).toFixed(0)})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            {t("common.close")}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>{t("lots.printTicket")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
