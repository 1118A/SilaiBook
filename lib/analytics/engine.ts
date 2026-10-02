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
  recentDailyPace: number; // average pieces per day over last 7 active days
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

/**
 * Calculate overall Manager KPI stats.
 */
export function getOverallAnalytics(entries: PieceEntry[], monthStr: string): OverallKPIs {
  const today = new Date().toISOString().split("T")[0];
  const targetYearMonth = monthStr.substring(0, 7);

  const monthEntries = entries.filter((e) => e.work_date.startsWith(targetYearMonth));
  const verifiedMonthEntries = monthEntries.filter((e) => e.status === "verified");

  const piecesToday = entries
    .filter((e) => e.work_date === today && e.status === "verified")
    .reduce((acc, curr) => acc + curr.pieces, 0);

  const piecesThisMonth = verifiedMonthEntries.reduce((acc, curr) => acc + curr.pieces, 0);

  const payrollSoFarPaise = verifiedMonthEntries.reduce(
    (acc, curr) => acc + multiplyPaise(curr.rate_paise, curr.pieces),
    0
  );

  const pendingReviewsCount = entries.filter((e) => e.status === "pending").length;

  const totalMonthEntriesCount = monthEntries.length;
  const rejectedMonthEntriesCount = monthEntries.filter((e) => e.status === "rejected").length;
  const rejectionRatePercent =
    totalMonthEntriesCount > 0
      ? Math.round((rejectedMonthEntriesCount / totalMonthEntriesCount) * 100)
      : 0;

  return {
    piecesToday,
    piecesThisMonth,
    payrollSoFarPaise,
    pendingReviewsCount,
    rejectionRatePercent,
  };
}

/**
 * Calculate performance metrics per tailor.
 */
export function getTailorAnalytics(
  entries: PieceEntry[],
  tailors: Tailor[],
  monthStr: string
): TailorPerformanceMetric[] {
  const targetYearMonth = monthStr.substring(0, 7);

  return tailors.map((tailor) => {
    const tailorMonthEntries = entries.filter(
      (e) => e.tailor_id === tailor.id && e.work_date.startsWith(targetYearMonth)
    );

    const verifiedEntries = tailorMonthEntries.filter((e) => e.status === "verified");
    const verifiedPieces = verifiedEntries.reduce((acc, curr) => acc + curr.pieces, 0);

    const totalEarningsPaise = verifiedEntries.reduce(
      (acc, curr) => acc + multiplyPaise(curr.rate_paise, curr.pieces),
      0
    );

    // Group verified pieces by day
    const dayMap: Record<string, number> = {};
    verifiedEntries.forEach((e) => {
      dayMap[e.work_date] = (dayMap[e.work_date] || 0) + e.pieces;
    });

    const activeDaysCount = Object.keys(dayMap).length;
    const avgPiecesPerDay = activeDaysCount > 0 ? Math.round(verifiedPieces / activeDaysCount) : 0;

    let bestDayDate = "—";
    let bestDayPieces = 0;

    Object.entries(dayMap).forEach(([date, pcs]) => {
      if (pcs > bestDayPieces) {
        bestDayPieces = pcs;
        bestDayDate = date;
      }
    });

    const totalCount = tailorMonthEntries.length;
    const rejectedCount = tailorMonthEntries.filter((e) => e.status === "rejected").length;
    const rejectionRatePercent = totalCount > 0 ? Math.round((rejectedCount / totalCount) * 100) : 0;

    const dailyTrend = Object.entries(dayMap).map(([date, pieces]) => ({ date, pieces }));

    return {
      tailorId: tailor.id,
      tailorName: tailor.name,
      verifiedPieces,
      totalEntries: totalCount,
      totalEarningsPaise,
      avgPiecesPerDay,
      bestDayDate,
      bestDayPieces,
      rejectionRatePercent,
      dailyTrend,
    };
  });
}

/**
 * Calculate analytics metrics per Lot.
 */
export function getLotAnalytics(
  entries: PieceEntry[],
  lots: Lot[],
  tailors: Tailor[]
): LotAnalyticsMetric[] {
  return lots.map((lot) => {
    const lotEntries = entries.filter((e) => e.lot_id === lot.id && e.status === "verified");

    const completedPieces = lotEntries.reduce((acc, curr) => acc + curr.pieces, 0);
    const remainingPieces = Math.max(0, lot.total_pieces - completedPieces);
    const percentage = lot.total_pieces > 0 ? Math.min(100, Math.round((completedPieces / lot.total_pieces) * 100)) : 0;

    const totalLaborCostPaise = lotEntries.reduce(
      (acc, curr) => acc + multiplyPaise(curr.rate_paise, curr.pieces),
      0
    );

    const costPerPiecePaise = completedPieces > 0 ? Math.round(totalLaborCostPaise / completedPieces) : 0;

    const tailorIds = Array.from(new Set(lotEntries.map((e) => e.tailor_id)));
    const tailorsWorked = tailorIds
      .map((id) => tailors.find((t) => t.id === id)?.name)
      .filter(Boolean) as string[];

    // Calculate recent pace (last 7 active days)
    const dayMap: Record<string, number> = {};
    lotEntries.forEach((e) => {
      dayMap[e.work_date] = (dayMap[e.work_date] || 0) + e.pieces;
    });

    const dates = Object.keys(dayMap).sort().slice(-7);
    const recentPiecesTotal = dates.reduce((acc, d) => acc + dayMap[d], 0);
    const recentDailyPace = dates.length > 0 ? Math.max(1, Math.round(recentPiecesTotal / dates.length)) : 10;

    const projectedDaysRemaining = remainingPieces > 0 ? Math.ceil(remainingPieces / recentDailyPace) : 0;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + projectedDaysRemaining);
    const projectedCompletionDate = remainingPieces === 0 ? "Completed" : targetDate.toISOString().split("T")[0];

    return {
      lotId: lot.id,
      lotNo: lot.lot_no,
      style: lot.style,
      totalPiecesTarget: lot.total_pieces,
      completedPieces,
      remainingPieces,
      percentage,
      totalLaborCostPaise,
      costPerPiecePaise,
      tailorCount: tailorIds.length,
      tailorsWorked,
      recentDailyPace,
      projectedDaysRemaining,
      projectedCompletionDate,
    };
  });
}

/**
 * Calculate output & average piece rate per operation.
 */
export function getOperationAnalytics(
  entries: PieceEntry[],
  operations: Operation[]
): OperationAnalyticsMetric[] {
  return operations.map((op) => {
    const opEntries = entries.filter((e) => e.operation_id === op.id && e.status === "verified");

    const totalPieces = opEntries.reduce((acc, curr) => acc + curr.pieces, 0);
    const totalEarningsPaise = opEntries.reduce(
      (acc, curr) => acc + multiplyPaise(curr.rate_paise, curr.pieces),
      0
    );

    const avgRatePaise = totalPieces > 0 ? Math.round(totalEarningsPaise / totalPieces) : op.default_rate_paise;

    return {
      operationId: op.id,
      operationName: op.name,
      totalPieces,
      defaultRatePaise: op.default_rate_paise,
      totalEarningsPaise,
      avgRatePaise,
    };
  });
}
