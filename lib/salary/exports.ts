import { UnitMonthlySalarySummary, TailorMonthlySalary } from "./engine";
import { fromPaise } from "@/lib/money";

/**
 * Generate CSV string for unit salary sheet.
 */
export function generateSalaryCSV(summary: UnitMonthlySalarySummary): string {
  const headers = [
    "Tailor Name",
    "Verified Pieces",
    "Gross Salary (INR)",
    "Bonus (INR)",
    "Advance (INR)",
    "Deduction (INR)",
    "Net Payable (INR)",
    "Pending Amount (INR)",
  ];

  const rows = summary.tailors.map((t) => [
    `"${t.tailorName.replace(/"/g, '""')}"`,
    t.verifiedPieces,
    fromPaise(t.grossPaise).toFixed(2),
    fromPaise(t.bonusPaise).toFixed(2),
    fromPaise(t.advancePaise).toFixed(2),
    fromPaise(t.deductionPaise).toFixed(2),
    fromPaise(t.netPaise).toFixed(2),
    fromPaise(t.pendingPaise).toFixed(2),
  ]);

  const csvContent = [
    `SilaiBook Monthly Salary Sheet - ${summary.month}`,
    headers.join(","),
    ...rows.map((r) => r.join(",")),
    "",
    [
      "TOTALS",
      summary.totalVerifiedPieces,
      fromPaise(summary.totalGrossPaise).toFixed(2),
      fromPaise(summary.totalBonusPaise).toFixed(2),
      fromPaise(summary.totalAdvancePaise).toFixed(2),
      fromPaise(summary.totalDeductionPaise).toFixed(2),
      fromPaise(summary.totalNetPaise).toFixed(2),
      fromPaise(summary.totalPendingPaise).toFixed(2),
    ].join(","),
  ].join("\n");

  return csvContent;
}

/**
 * Trigger client-side browser download for CSV file.
 */
export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate HTML string for printable PDF payslip.
 */
export function printTailorPayslip(tailor: TailorMonthlySalary, month: string): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payslip - ${tailor.tailorName} - ${month}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 40px; color: #0f172a; }
          .header { border-b: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #4c1d95; }
          .subtitle { font-size: 14px; color: #64748b; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
          .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
          .value { font-size: 20px; font-weight: bold; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
          .total-row { font-weight: bold; background: #f1f5f9; }
          .net { font-size: 22px; color: #059669; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Shree Ganesh Garments — SilaiBook</div>
          <div class="subtitle">Official Piece-Rate Salary Slip for Month: ${month}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <strong>Tailor Name:</strong> ${tailor.tailorName}<br/>
          <strong>Date Generated:</strong> ${new Date().toLocaleDateString("en-IN")}
        </div>

        <div class="grid">
          <div class="card">
            <div class="label">Verified Work Done</div>
            <div class="value">${tailor.verifiedPieces} pieces</div>
          </div>
          <div class="card">
            <div class="label">Gross Salary</div>
            <div class="value">₹${fromPaise(tailor.grossPaise).toFixed(2)}</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gross Piece Rate Earnings</td>
              <td style="text-align: right;">₹${fromPaise(tailor.grossPaise).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Bonus (+)</td>
              <td style="text-align: right;">+ ₹${fromPaise(tailor.bonusPaise).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Salary Advance (−)</td>
              <td style="text-align: right;">− ₹${fromPaise(tailor.advancePaise).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Other Deductions (−)</td>
              <td style="text-align: right;">− ₹${fromPaise(tailor.deductionPaise).toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td>Net Payable Salary</td>
              <td style="text-align: right;" class="net">₹${fromPaise(tailor.netPaise).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        ${
          tailor.pendingPaise > 0
            ? `<p style="font-size: 12px; color: #d97706; margin-top: 20px;">* Pending verification: ₹${fromPaise(tailor.pendingPaise).toFixed(2)} (${tailor.pendingPieces} pieces)</p>`
            : ""
        }

        <div style="margin-top: 60px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b;">
          <div>Tailor Signature</div>
          <div>Manager / Authorized Signature</div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
