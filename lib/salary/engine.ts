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
  month: string;
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

export function calculateMonthlySalary(
  tailors: Tailor[],
  entries: PieceEntry[],
  adjustments: Adjustment[],
  monthDateStr: string
): UnitMonthlySalarySummary {
  const targetMonth = monthDateStr.substring(0, 7);

  let totalVerifiedPieces = 0, totalGrossPaise = 0, totalBonusPaise = 0;
  let totalAdvancePaise = 0, totalDeductionPaise = 0, totalNetPaise = 0, totalPendingPaise = 0;

  const tailorSummaries: TailorMonthlySalary[] = tailors.map((tailor) => {
    let verifiedPieces = 0, grossPaise = 0, pendingPieces = 0, pendingPaise = 0, entriesCount = 0;

    for (const e of entries) {
      if (e.tailor_id === tailor.id && e.work_date.startsWith(targetMonth)) {
        entriesCount++;
        const paise = multiplyPaise(e.rate_paise, e.pieces);
        if (e.status === "verified") {
          verifiedPieces += e.pieces;
          grossPaise += paise;
        } else if (e.status === "pending") {
          pendingPieces += e.pieces;
          pendingPaise += paise;
        }
      }
    }

    let bonusPaise = 0, advancePaise = 0, deductionPaise = 0;
    for (const a of adjustments) {
      if (a.tailor_id === tailor.id && a.month.startsWith(targetMonth)) {
        if (a.type === "bonus") bonusPaise += a.amount_paise;
        else if (a.type === "advance") advancePaise += a.amount_paise;
        else if (a.type === "deduction") deductionPaise += a.amount_paise;
      }
    }

    const netPaise = subtractPaise(addPaise(grossPaise, bonusPaise), addPaise(advancePaise, deductionPaise));

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
      negativeNetWarning: netPaise < 0,
      entriesCount,
    };
  });

  return {
    month: targetMonth,
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
