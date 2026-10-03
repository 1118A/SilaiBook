import { TailorMonthlySalary } from "@/lib/salary/engine";
import { formatINR } from "@/lib/money";

export interface SalarySlipOptions {
  summary: TailorMonthlySalary;
  monthStr: string; // e.g. "2026-09"
  unitName?: string;
  locale?: string; // "en" | "gu" | "hi"
}

export function generateSalarySlipHTML(options: SalarySlipOptions): string {
  const { summary, monthStr, unitName = "SilaiBook Apparel Unit", locale = "en" } = options;

  const labels = {
    en: {
      title: "SALARY SLIP",
      tailor: "Tailor Name",
      month: "Payroll Month",
      verifiedEntries: "Verified Pieces Rate Earnings",
      bonus: "Bonus Adjustments",
      advance: "Advance Deductions",
      damage: "Damage/Other Deductions",
      netPay: "NET PAYABLE SALARY",
      status: "Payment Status",
      verified: "VERIFIED & APPROVED",
      printedOn: "Generated on",
      signature: "Tailor Signature",
      managerSignature: "Manager Signature",
      unit: "Manufacturing Unit",
    },
    gu: {
      title: "પગાર સ્લિપ (SALARY SLIP)",
      tailor: "કારીગરનું નામ",
      month: "પગાર મહિનો",
      verifiedEntries: "સત્યાપિત પીસ-રેટ કમાણી",
      bonus: "બોનસ ઉમેરો",
      advance: "ઉપાડ / એડવાન્સ કપાત",
      damage: "નુકસાની કપાત",
      netPay: "કુલ ચૂકવવાપાત્ર રકમ",
      status: "ચુકવણી સ્થિતિ",
      verified: "સત્યાપિત અને મંજૂર",
      printedOn: "તારીખે જનરેટ કર્યું",
      signature: "કારીગરની સહી",
      managerSignature: "મેનેજરની સહી",
      unit: "મેન્યુફેક્ચરિંગ યુનિટ",
    },
    hi: {
      title: "वेतन पर्ची (SALARY SLIP)",
      tailor: "कारीगर का नाम",
      month: "वेतन माह",
      verifiedEntries: "सत्यापित पीस-रेट कमाई",
      bonus: "बोनस जोड़ें",
      advance: "एडवांस कटौती",
      damage: "नुकसानी कटौती",
      netPay: "कुल देय वेतन",
      status: "भुगतान स्थिति",
      verified: "सत्यापित एवं स्वीकृत",
      printedOn: "जारी करने की तिथि",
      signature: "कारीगर के हस्ताक्षर",
      managerSignature: "प्रबंधक के हस्ताक्षर",
      unit: "मैन्युफैक्चरिंग यूनिट",
    },
  };

  const l = labels[locale as keyof typeof labels] || labels.en;
  const nowStr = new Date().toLocaleDateString();

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <title>${l.title} - ${summary.tailorName} (${monthStr})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Gujarati:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', 'Noto Sans Gujarati', 'Noto Sans Devanagari', sans-serif;
      margin: 0;
      padding: 24px;
      color: #0f172a;
      background: #ffffff;
      max-width: 700px;
      margin: 0 auto;
    }
    .card {
      border: 2px solid #1F2A5A;
      border-radius: 16px;
      padding: 24px;
      background: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px dashed #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand {
      font-size: 20px;
      font-weight: 800;
      color: #1F2A5A;
      margin: 0;
    }
    .unit {
      font-size: 12px;
      color: #64748b;
      margin: 2px 0 0 0;
    }
    .badge {
      background: #e6f4ea;
      color: #137333;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 9999px;
      border: 1px solid #ceead6;
      text-transform: uppercase;
    }
    .grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
    }
    .label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
    }
    .value {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .table th, .table td {
      padding: 10px 12px;
      text-align: left;
      font-size: 13px;
      border-bottom: 1px solid #e2e8f0;
    }
    .table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #334155;
    }
    .total-row {
      background: #fef3c7;
      font-weight: 800;
      font-size: 16px;
      color: #78350f;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .sig-box {
      text-align: center;
      width: 45%;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-top: 30px;
      padding-top: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
    }
    @media print {
      body { padding: 0; }
      .card { border: none; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <h1 class="brand">${unitName}</h1>
        <p class="unit">${l.unit} • SilaiBook Payroll</p>
      </div>
      <div class="badge">${l.verified}</div>
    </div>

    <div class="grid">
      <div>
        <div class="label">${l.tailor}</div>
        <div class="value">${summary.tailorName}</div>
      </div>
      <div>
        <div class="label">${l.month}</div>
        <div class="value">${monthStr}</div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Particulars</th>
          <th style="text-align: right;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${l.verifiedEntries} (${summary.verifiedPieces} pcs)</td>
          <td style="text-align: right; font-weight: 600;">₹${formatINR(summary.grossPaise)}</td>
        </tr>
        <tr>
          <td>${l.bonus}</td>
          <td style="text-align: right; color: #166534;">+ ₹${formatINR(summary.bonusPaise)}</td>
        </tr>
        <tr>
          <td>${l.advance}</td>
          <td style="text-align: right; color: #991b1b;">- ₹${formatINR(summary.advancePaise)}</td>
        </tr>
        <tr>
          <td>${l.damage}</td>
          <td style="text-align: right; color: #991b1b;">- ₹${formatINR(summary.deductionPaise)}</td>
        </tr>
        <tr class="total-row">
          <td>${l.netPay}</td>
          <td style="text-align: right;">₹${formatINR(summary.netPaise)}</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size: 11px; color: #64748b; text-align: right;">
      ${l.printedOn}: ${nowStr}
    </div>

    <div class="signatures">
      <div class="sig-box">
        <div class="sig-line">${l.signature}</div>
      </div>
      <div class="sig-box">
        <div class="sig-line">${l.managerSignature}</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      if (window.name === "SalarySlipPrint") {
        window.print();
      }
    };
  </script>
</body>
</html>
  `;
}

export function openSalarySlipPrintWindow(options: SalarySlipOptions) {
  if (typeof window === "undefined") return;
  const html = generateSalarySlipHTML(options);
  const win = window.open("", "SalarySlipPrint", "width=800,height=900");
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}
