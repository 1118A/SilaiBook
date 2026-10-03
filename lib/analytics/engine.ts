import { PieceEntry, Tailor, Lot, Operation } from "@/lib/types/payroll";
import { multiplyPaise } from "@/lib/money";

export interface TailorPerformanceMetric {
  tailorId: string;
  tailorName: string;
  verifiedPieces: number;
  totalEntries: number;
  totalEarningsPaise: number;
  avgPiecesPerDay: number;
  bestDayDate: string;
  bestDayPieces: number;
  rejectionRatePercent: number;
  dailyTrend: { date: string; pieces: number }[];
}

export interface LotAnalyticsMetric {
  lotId: string;
  lotNo: string;
  style: string;
  totalPiecesTarget: number;
  completedPieces: number;
  remainingPieces: number;
  percentage: number;
  totalLaborCostPaise: number;
  costPerPiecePaise: number;
  tailorCount: number;
  tailorsWorked: string[];
  recentDailyPace: number;
  projectedDaysRemaining: number;
  projectedCompletionDate: string;
}

export interface OperationAnalyticsMetric {
  operationId: string;
  operationName: string;
  totalPieces: number;
  defaultRatePaise: number;
  totalEarningsPaise: number;
  avgRatePaise: number;
}

export interface OverallKPIs {
  piecesToday: number;
  piecesThisMonth: number;
  payrollSoFarPaise: number;
  pendingReviewsCount: number;
  rejectionRatePercent: number;
}

export function getOverallAnalytics(entries: PieceEntry[], monthStr: string): OverallKPIs {
  const today = new Date().toISOString().split("T")[0];
  const targetMonth = monthStr.substring(0, 7);

  let piecesToday = 0, piecesThisMonth = 0, payrollSoFarPaise = 0;
  let pendingReviewsCount = 0, totalMonthCount = 0, rejectedMonthCount = 0;

  for (const e of entries) {
    if (e.status === "pending") pendingReviewsCount++;

    if (e.work_date.startsWith(targetMonth)) {
      totalMonthCount++;
      if (e.status === "rejected") rejectedMonthCount++;
      if (e.status === "verified") {
        piecesThisMonth += e.pieces;
        payrollSoFarPaise += multiplyPaise(e.rate_paise, e.pieces);
        if (e.work_date === today) piecesToday += e.pieces;
      }
    }
  }

  return {
    piecesToday,
    piecesThisMonth,
    payrollSoFarPaise,
    pendingReviewsCount,
    rejectionRatePercent: totalMonthCount > 0 ? Math.round((rejectedMonthCount / totalMonthCount) * 100) : 0,
  };
}

export function getTailorAnalytics(
  entries: PieceEntry[],
  tailors: Tailor[],
  monthStr: string
): TailorPerformanceMetric[] {
  const targetMonth = monthStr.substring(0, 7);

  return tailors.map((tailor) => {
    let verifiedPieces = 0, totalEntries = 0, totalEarningsPaise = 0, rejectedCount = 0;
    const dayMap: Record<string, number> = {};

    for (const e of entries) {
      if (e.tailor_id === tailor.id && e.work_date.startsWith(targetMonth)) {
        totalEntries++;
        if (e.status === "rejected") rejectedCount++;
        if (e.status === "verified") {
          verifiedPieces += e.pieces;
          totalEarningsPaise += multiplyPaise(e.rate_paise, e.pieces);
          dayMap[e.work_date] = (dayMap[e.work_date] || 0) + e.pieces;
        }
      }
    }

    const activeDays = Object.keys(dayMap).length;
    let bestDayDate = "—", bestDayPieces = 0;
    Object.entries(dayMap).forEach(([date, pcs]) => {
      if (pcs > bestDayPieces) {
        bestDayPieces = pcs;
        bestDayDate = date;
      }
    });

    return {
      tailorId: tailor.id,
      tailorName: tailor.name,
      verifiedPieces,
      totalEntries,
      totalEarningsPaise,
      avgPiecesPerDay: activeDays > 0 ? Math.round(verifiedPieces / activeDays) : 0,
      bestDayDate,
      bestDayPieces,
      rejectionRatePercent: totalEntries > 0 ? Math.round((rejectedCount / totalEntries) * 100) : 0,
      dailyTrend: Object.entries(dayMap).map(([date, pieces]) => ({ date, pieces })),
    };
  });
}

export function getLotAnalytics(entries: PieceEntry[], lots: Lot[], tailors: Tailor[]): LotAnalyticsMetric[] {
  const tailorNameMap = new Map(tailors.map((t) => [t.id, t.name]));

  return lots.map((lot) => {
    let completedPieces = 0, totalLaborCostPaise = 0;
    const tailorIds = new Set<string>();
    const dayMap: Record<string, number> = {};

    for (const e of entries) {
      if (e.lot_id === lot.id && e.status === "verified") {
        completedPieces += e.pieces;
        totalLaborCostPaise += multiplyPaise(e.rate_paise, e.pieces);
        tailorIds.add(e.tailor_id);
        dayMap[e.work_date] = (dayMap[e.work_date] || 0) + e.pieces;
      }
    }

    const remainingPieces = Math.max(0, lot.total_pieces - completedPieces);
    const percentage = lot.total_pieces > 0 ? Math.min(100, Math.round((completedPieces / lot.total_pieces) * 100)) : 0;
    const tailorsWorked = Array.from(tailorIds).map((id) => tailorNameMap.get(id)).filter(Boolean) as string[];

    const activeDates = Object.keys(dayMap).sort().slice(-7);
    const recentTotal = activeDates.reduce((acc, d) => acc + dayMap[d], 0);
    const recentDailyPace = activeDates.length > 0 ? Math.max(1, Math.round(recentTotal / activeDates.length)) : 10;
    const projectedDaysRemaining = remainingPieces > 0 ? Math.ceil(remainingPieces / recentDailyPace) : 0;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + projectedDaysRemaining);

    return {
      lotId: lot.id,
      lotNo: lot.lot_no,
      style: lot.style,
      totalPiecesTarget: lot.total_pieces,
      completedPieces,
      remainingPieces,
      percentage,
      totalLaborCostPaise,
      costPerPiecePaise: completedPieces > 0 ? Math.round(totalLaborCostPaise / completedPieces) : 0,
      tailorCount: tailorIds.size,
      tailorsWorked,
      recentDailyPace,
      projectedDaysRemaining,
      projectedCompletionDate: remainingPieces === 0 ? "Completed" : targetDate.toISOString().split("T")[0],
    };
  });
}

export function getOperationAnalytics(entries: PieceEntry[], operations: Operation[]): OperationAnalyticsMetric[] {
  return operations.map((op) => {
    let totalPieces = 0, totalEarningsPaise = 0;

    for (const e of entries) {
      if (e.operation_id === op.id && e.status === "verified") {
        totalPieces += e.pieces;
        totalEarningsPaise += multiplyPaise(e.rate_paise, e.pieces);
      }
    }

    return {
      operationId: op.id,
      operationName: op.name,
      totalPieces,
      defaultRatePaise: op.default_rate_paise,
      totalEarningsPaise,
      avgRatePaise: totalPieces > 0 ? Math.round(totalEarningsPaise / totalPieces) : op.default_rate_paise,
    };
  });
}
