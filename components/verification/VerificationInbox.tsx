"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  XCircle,
  CheckCheck,
  ShieldCheck,
  Sliders,
  AlertCircle,
  User,
  Calendar,
} from "lucide-react";
import { PieceEntry, Tailor, Lot, Operation } from "@/lib/types/payroll";
import { formatINR, fromPaise, multiplyPaise } from "@/lib/money";

interface VerificationInboxProps {
  entries: PieceEntry[];
  tailors: Tailor[];
  lots: Lot[];
  operations: Operation[];
  autoVerifyManager: boolean;
  onToggleAutoVerify: (val: boolean) => void;
  onVerify: (entryId: string) => void;
  onReject: (entryId: string, reasonNote: string) => void;
  onBulkVerify: (tailorId: string, workDate: string) => void;
}

export function VerificationInbox({
  entries,
  tailors,
  lots,
  operations,
  autoVerifyManager,
  onToggleAutoVerify,
  onVerify,
  onReject,
  onBulkVerify,
}: VerificationInboxProps) {
  const t = useTranslations();

  const [rejectingEntryId, setRejectingEntryId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState<string>("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const pendingEntries = entries.filter((e) => e.status === "pending");

  // Group pending entries by tailor_id and work_date
  const groupedPending: Record<string, PieceEntry[]> = {};
  pendingEntries.forEach((entry) => {
    const key = `${entry.tailor_id}_${entry.work_date}`;
    if (!groupedPending[key]) {
      groupedPending[key] = [];
    }
    groupedPending[key].push(entry);
  });

  const handleOpenRejectModal = (entryId: string) => {
    setRejectingEntryId(entryId);
    setRejectNote("");
  };

  const handleConfirmReject = () => {
    if (!rejectingEntryId) return;
    onReject(rejectingEntryId, rejectNote || t("verification.presetCountMismatch"));
    setRejectingEntryId(null);
    setRejectNote("");
    setSuccessToast(t("verification.rejectedSuccess"));
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const presetChips = [
    t("verification.presetCountMismatch"),
    t("verification.presetQualityFlaw"),
    t("verification.presetWrongOp"),
    t("verification.presetDuplicate"),
  ];

  return (
    <div className="space-y-6">
      {/* Header & Settings Bar */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{t("verification.inboxTitle")}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-600 text-white shadow-sm">
                {pendingEntries.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t("verification.pendingCount")}</p>
          </div>
        </div>

        {/* Auto verify toggle */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
          <Sliders className="w-4 h-4 text-violet-400 ml-1" />
          <span className="text-xs font-semibold text-slate-300">
            {t("verification.autoVerifyToggle")}
          </span>
          <button
            type="button"
            onClick={() => onToggleAutoVerify(!autoVerifyManager)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              autoVerifyManager ? "bg-violet-600" : "bg-slate-800"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                autoVerifyManager ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Inbox Body */}
      {Object.keys(groupedPending).length === 0 ? (
        <div className="bg-slate-900 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">All caught up!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are no pending piece entries requiring verification right now.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPending).map(([key, groupEntries]) => {
            const first = groupEntries[0];
            const tailor = tailors.find((t) => t.id === first.tailor_id);
            const totalGroupPieces = groupEntries.reduce((acc, curr) => acc + curr.pieces, 0);
            const totalGroupPaise = groupEntries.reduce(
              (acc, curr) => acc + multiplyPaise(curr.rate_paise, curr.pieces),
              0
            );

            return (
              <div
                key={key}
                className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4"
              >
                {/* Group Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{tailor?.name || "Tailor"}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {first.work_date}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-violet-400">{totalGroupPieces} pieces</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-400">{formatINR(totalGroupPaise)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Verify Button */}
                  <button
                    type="button"
                    onClick={() => {
                      onBulkVerify(first.tailor_id, first.work_date);
                      setSuccessToast(t("verification.bulkVerifiedSuccess"));
                      setTimeout(() => setSuccessToast(null), 3000);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>{t("verification.verifyAll")}</span>
                  </button>
                </div>

                {/* Individual Entry Rows */}
                <div className="space-y-3">
                  {groupEntries.map((entry) => {
                    const lot = lots.find((l) => l.id === entry.lot_id);
                    const op = operations.find((o) => o.id === entry.operation_id);
                    const totalPaise = multiplyPaise(entry.rate_paise, entry.pieces);

                    return (
                      <div
                        key={entry.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-white text-sm">
                            {lot ? `${lot.lot_no} — ${lot.style}` : "Lot"}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            {op ? op.name : "Operation"} • {entry.pieces} pcs @ ₹{fromPaise(entry.rate_paise)}/pc
                          </div>
                          <div className="text-sm font-extrabold text-emerald-400">
                            {formatINR(totalPaise)}
                          </div>
                        </div>

                        {/* Action Buttons: Big Green Approve & Big Red Reject */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onVerify(entry.id);
                              setSuccessToast(t("verification.verifiedSuccess"));
                              setTimeout(() => setSuccessToast(null), 3000);
                            }}
                            className="flex-1 sm:flex-initial h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t("verification.approve")}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenRejectModal(entry.id)}
                            className="flex-1 sm:flex-initial h-11 px-5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>{t("verification.reject")}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingEntryId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">{t("verification.rejectTitle")}</h3>
            </div>

            <p className="text-xs text-slate-400">{t("verification.selectPresetReason")}</p>

            {/* Preset chips */}
            <div className="flex flex-wrap gap-2">
              {presetChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setRejectNote(chip)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    rejectNote === chip
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Free text input */}
            <textarea
              rows={3}
              placeholder="Or write additional details for tailor..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:border-violet-500 focus:outline-none"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingEntryId(null)}
                className="flex-1 h-10 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
              >
                {t("common.cancel")}
              </button>

              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
