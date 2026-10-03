import { TailorMonthlySalary } from "@/lib/salary/engine";
import { formatINR } from "@/lib/money";

export interface ShareOptions {
  summary: TailorMonthlySalary;
  monthStr: string;
  phone?: string;
}

export async function shareSalarySlipViaWebShare(options: ShareOptions): Promise<{ success: boolean; method: "share" | "whatsapp" | "clipboard" }> {
  const { summary, monthStr, phone = "" } = options;

  const text = `🧵 *SilaiBook Salary Slip* (${monthStr})
-------------------------------
👤 Tailor: *${summary.tailorName}*
✅ Verified Pieces: ${summary.verifiedPieces} pcs
💰 Gross Earnings: ₹${formatINR(summary.grossPaise)}
🎁 Bonus: + ₹${formatINR(summary.bonusPaise)}
💸 Advance/Deductions: - ₹${formatINR(summary.advancePaise + summary.deductionPaise)}
-------------------------------
💵 *NET PAYABLE: ₹${formatINR(summary.netPaise)}*
-------------------------------
Generated via SilaiBook Piece-Rate Payroll System`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: `Salary Slip - ${summary.tailorName} (${monthStr})`,
        text: text,
      });
      return { success: true, method: "share" };
    } catch {
      // User cancelled or share failed, fallback
    }
  }

  if (typeof window !== "undefined") {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phone ? "91" + phone : ""}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
    return { success: true, method: "whatsapp" };
  }

  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return { success: true, method: "clipboard" };
  }

  return { success: false, method: "clipboard" };
}
