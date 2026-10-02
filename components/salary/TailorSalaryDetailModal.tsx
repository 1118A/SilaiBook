"use client";

import { X, Calendar, Scissors, FileText } from "lucide-react";
import { PieceEntry, Adjustment, Lot, Operation } from "@/lib/types/payroll";
import { formatINR, multiplyPaise } from "@/lib/money";

interface TailorSalaryDetailModalProps {
  tailorName: string;
  month: string;
  entries: PieceEntry[];
  adjustments: Adjustment[];
  lots: Lot[];
  operations: Operation[];
  onClose: () => void;
}

export function TailorSalaryDetailModal({
  tailorName,
  month,
  entries,
  adjustments,
  lots,
  operations,
  onClose,
}: TailorSalaryDetailModalProps) {

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-white">{tailorName}</h3>
            <p className="text-xs text-slate-400 font-medium">Itemized Breakdown • {month}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entries Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-violet-400" />
            <span>Verified Work Log ({entries.length})</span>
          </h4>

          {entries.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No verified work entries in this month.</p>
          ) : (
            <div className="space-y-2">
              {entries.map((e) => {
                const lot = lots.find((l) => l.id === e.lot_id);
                const op = operations.find((o) => o.id === e.operation_id);
                const total = multiplyPaise(e.rate_paise, e.pieces);

                return (
                  <div
                    key={e.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{lot?.lot_no || "Lot"}</span>
                        <span className="text-slate-400 font-normal">({lot?.style})</span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-2">
                        <span><Scissors className="w-3 h-3 inline mr-1" />{op?.name}</span>
                        <span>•</span>
                        <span><Calendar className="w-3 h-3 inline mr-1" />{e.work_date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-violet-400">{e.pieces} pcs</div>
                      <div className="font-bold text-emerald-400">{formatINR(total)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Adjustments Section */}
        <div className="space-y-3 border-t border-slate-800 pt-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Adjustments ({adjustments.length})
          </h4>

          {adjustments.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">No advances, bonuses, or deductions recorded.</p>
          ) : (
            <div className="space-y-2">
              {adjustments.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span
                      className={`font-bold uppercase px-2 py-0.5 rounded-full text-[10px] ${
                        a.type === "bonus"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                          : a.type === "advance"
                          ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                          : "bg-rose-950 text-rose-300 border border-rose-800/50"
                      }`}
                    >
                      {a.type}
                    </span>
                    {a.note && <span className="ml-2 text-slate-300">{a.note}</span>}
                  </div>
                  <div className="font-extrabold text-white">
                    {a.type === "bonus" ? "+" : "−"} {formatINR(a.amount_paise)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
