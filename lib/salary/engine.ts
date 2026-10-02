import { PieceEntry, Adjustment, Tailor } from "@/lib/types/payroll";
import { multiplyPaise, addPaise, subtractPaise } from "@/lib/money";

export interface TailorMonthlySalary {
  tailorId: string;
  tailorName: string;
  verifiedPieces: number;
  grossPaise: number;
  bonusPaise: number;
  advancePaise: number;
  deductionPaise: number;
  netPaise: number;
  pendingPieces: number;
  pendingPaise: number;
  negativeNetWarning: boolean;
  entriesCount: number;
}

export interface UnitMonthlySalarySummary {
  month: string; // YYYY-MM
  totalVerifiedPieces: number;
  totalGrossPaise: number;
  totalBonusPaise: number;
  totalAdvancePaise: number;
  totalDeductionPaise: number;
  totalNetPaise: number;
  totalPendingPaise: number;
  tailors: TailorMonthlySalary[];
  calculatedAt: string;
}

/**
 * Pure function to calculate monthly salary totals for all tailors.
 *
 * Rules:
 * - Gross = Σ(verified pieces × rate_paise)
 * - Net = Gross + Bonus − Advance − Deduction
 * - Pending/rejected entries are EXCLUDED from Gross and Net,
 *   but pending amounts are tracked in `pendingPaise` for manager awareness.
 * - Negative net amounts trigger `negativeNetWarning: true`.
 */
export function calculateMonthlySalary(
  tailors: Tailor[],
  entries: PieceEntry[],
  adjustments: Adjustment[],
  monthDateStr: string // YYYY-MM
): UnitMonthlySalarySummary {
  const targetYearMonth = monthDateStr.substring(0, 7); // e.g. "2026-09"

  let totalVerifiedPieces = 0;
  let totalGrossPaise = 0;
  let totalBonusPaise = 0;
  let totalAdvancePaise = 0;
  let totalDeductionPaise = 0;
  let totalNetPaise = 0;
  let totalPendingPaise = 0;

  const tailorSummaries: TailorMonthlySalary[] = tailors.map((tailor) => {
    // Filter verified entries for this tailor in target month
    const tailorMonthEntries = entries.filter((e) => {
      return e.tailor_id === tailor.id && e.work_date.startsWith(targetYearMonth);
    });

    const verifiedEntries = tailorMonthEntries.filter((e) => e.status === "verified");
    const pendingEntries = tailorMonthEntries.filter((e) => e.status === "pending");

    const verifiedPieces = verifiedEntries.reduce((acc, curr) => acc + curr.pieces, 0);
    const grossPaise = verifiedEntries.reduce(
      (acc, curr) => acc + multiplyPaise(curr.rate_paise, curr.pieces),
      0
    );

    const pendingPieces = pendingEntries.reduce((acc, curr) => acc + curr.pieces, 0);
    const pendingPaise = pendingEntries.reduce(
      (acc, curr) => acc + multiplyPaise(curr.rate_paise, curr.pieces),
      0
    );

    // Filter adjustments for this tailor in target month
    const tailorAdjustments = adjustments.filter((a) => {
      return a.tailor_id === tailor.id && a.month.startsWith(targetYearMonth);
    });

    const bonusPaise = tailorAdjustments
      .filter((a) => a.type === "bonus")
      .reduce((acc, curr) => acc + curr.amount_paise, 0);

    const advancePaise = tailorAdjustments
      .filter((a) => a.type === "advance")
      .reduce((acc, curr) => acc + curr.amount_paise, 0);

    const deductionPaise = tailorAdjustments
      .filter((a) => a.type === "deduction")
      .reduce((acc, curr) => acc + curr.amount_paise, 0);

    // Net = Gross + Bonus - Advance - Deduction
    const netPaise = subtractPaise(
      addPaise(grossPaise, bonusPaise),
      addPaise(advancePaise, deductionPaise)
    );

    const negativeNetWarning = netPaise < 0;

    totalVerifiedPieces += verifiedPieces;
    totalGrossPaise += grossPaise;
    totalBonusPaise += bonusPaise;
    totalAdvancePaise += advancePaise;
    totalDeductionPaise += deductionPaise;
    totalNetPaise += netPaise;
    totalPendingPaise += pendingPaise;

    return {
      tailorId: tailor.id,
      tailorName: tailor.name,
      verifiedPieces,
      grossPaise,
      bonusPaise,
      advancePaise,
      deductionPaise,
      netPaise,
      pendingPieces,
      pendingPaise,
      negativeNetWarning,
      entriesCount: tailorMonthEntries.length,
    };
  });

  return {
    month: targetYearMonth,
    totalVerifiedPieces,
    totalGrossPaise,
    totalBonusPaise,
    totalAdvancePaise,
    totalDeductionPaise,
    totalNetPaise,
    totalPendingPaise,
    tailors: tailorSummaries,
    calculatedAt: new Date().toISOString(),
  };
}
