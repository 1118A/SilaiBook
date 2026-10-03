import { PieceEntry, Tailor, Lot, Operation, Adjustment, AuditLog } from "@/lib/types/payroll";
import { TailorMonthlySalary } from "@/lib/salary/engine";
import { formatINR } from "@/lib/money";

export function exportSalarySummaryCSV(summaries: TailorMonthlySalary[], monthStr: string) {
  const headers = [
    "Tailor Name",
    "Payroll Month",
    "Verified Pieces",
    "Gross Earnings (₹)",
    "Bonus (₹)",
    "Advance (₹)",
    "Deductions (₹)",
    "Net Payable (₹)",
  ];

  const rows = summaries.map((s) => [
    `"${s.tailorName.replace(/"/g, '""')}"`,
    `"${monthStr}"`,
    s.verifiedPieces,
    formatINR(s.grossPaise),
    formatINR(s.bonusPaise),
    formatINR(s.advancePaise),
    formatINR(s.deductionPaise),
    formatINR(s.netPaise),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csvContent, `silaibook_salary_summary_${monthStr}.csv`, "text/csv;charset=utf-8;");
}

export function exportPieceEntriesCSV(
  entries: PieceEntry[],
  tailors: Tailor[],
  lots: Lot[],
  operations: Operation[]
) {
  const headers = [
    "Entry ID",
    "Date",
    "Tailor Name",
    "Lot Number",
    "Style",
    "Operation",
    "Pieces",
    "Rate (Paise)",
    "Total (₹)",
    "Status",
    "Note",
  ];

  const tailorMap = new Map(tailors.map((t) => [t.id, t.name]));
  const lotMap = new Map(lots.map((l) => [l.id, l]));
  const opMap = new Map(operations.map((o) => [o.id, o.name]));

  const rows = entries.map((e) => {
    const lot = lotMap.get(e.lot_id);
    const totalPaise = e.pieces * e.rate_paise;

    return [
      `"${e.id}"`,
      `"${e.work_date}"`,
      `"${(tailorMap.get(e.tailor_id) || "").replace(/"/g, '""')}"`,
      `"${(lot?.lot_no || "").replace(/"/g, '""')}"`,
      `"${(lot?.style || "").replace(/"/g, '""')}"`,
      `"${(opMap.get(e.operation_id) || "").replace(/"/g, '""')}"`,
      e.pieces,
      e.rate_paise,
      formatINR(totalPaise),
      `"${e.status}"`,
      `"${(e.note || "").replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csvContent, `silaibook_entries_export_${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
}

export interface FullBackupData {
  version: "1.0";
  exported_at: string;
  unit_id: string;
  tailors: Tailor[];
  lots: Lot[];
  operations: Operation[];
  entries: PieceEntry[];
  adjustments: Adjustment[];
  closedMonths: string[];
  auditLogs: AuditLog[];
}

export function exportFullDataBackup(data: Omit<FullBackupData, "version" | "exported_at">) {
  const backup: FullBackupData = {
    version: "1.0",
    exported_at: new Date().toISOString(),
    ...data,
  };

  const jsonString = JSON.stringify(backup, null, 2);
  const fileName = `silaibook_full_backup_${new Date().toISOString().split("T")[0]}.json`;
  downloadBlob(jsonString, fileName, "application/json");
}

function downloadBlob(content: string, fileName: string, mimeType: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
