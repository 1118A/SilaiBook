"use client";

import { useTranslations } from "next-intl";
import { History, Clock } from "lucide-react";
import { AuditLog } from "@/lib/types/payroll";

interface AuditLogViewProps {
  logs: AuditLog[];
}

export function AuditLogView({ logs }: AuditLogViewProps) {
  const t = useTranslations();

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <History className="w-4 h-4" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          {t("verification.auditTrailTitle")} ({logs.length})
        </h2>
      </div>

      <div className="space-y-3">
        {logs.length === 0 ? (
          <p className="text-center text-slate-500 text-xs py-6">No audit records logged yet.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.action.includes("VERIFY")
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                        : log.action.includes("REJECT")
                        ? "bg-rose-950 text-rose-300 border border-rose-800/50"
                        : "bg-violet-950 text-violet-300 border border-violet-800/50"
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: {log.record_id}</span>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  {log.new_data?.note ? (
                    <span className="text-rose-300">Note: &quot;{String(log.new_data.note)}&quot;</span>
                  ) : (
                    <span>Status changed to: {String(log.new_data?.status || "updated")}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{new Date(log.created_at).toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
