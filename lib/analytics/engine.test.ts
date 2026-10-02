import { describe, it, expect } from "vitest";
import {
  getOverallAnalytics,
  getTailorAnalytics,
  getLotAnalytics,
  getOperationAnalytics,
} from "./engine";
import { calculateMonthlySalary } from "@/lib/salary/engine";
import { PieceEntry, Tailor, Lot, Operation } from "@/lib/types/payroll";

describe("Task 06 — Manager Analytics Dashboard Unit Tests", () => {
  const tailor1: Tailor = { id: "t1", unit_id: "u1", name: "Ramesh Patel", active: true, created_at: "" };
  const tailor2: Tailor = { id: "t2", unit_id: "u1", name: "Suresh Kumar", active: true, created_at: "" };
  const tailors = [tailor1, tailor2];

  const lot1: Lot = { id: "l1", unit_id: "u1", lot_no: "LOT-001", style: "Cotton Shirt", total_pieces: 500, status: "active", created_at: "" };
  const lots = [lot1];

  const op1: Operation = { id: "o1", unit_id: "u1", name: "Stitching", default_rate_paise: 500, created_at: "" };
  const operations = [op1];

  const entries: PieceEntry[] = [
    { id: "e1", unit_id: "u1", tailor_id: "t1", lot_id: "l1", operation_id: "o1", work_date: "2026-09-01", pieces: 20, rate_paise: 500, status: "verified", created_at: "" }, // 10,000 paise
    { id: "e2", unit_id: "u1", tailor_id: "t1", lot_id: "l1", operation_id: "o1", work_date: "2026-09-02", pieces: 30, rate_paise: 500, status: "verified", created_at: "" }, // 15,000 paise
    { id: "e3", unit_id: "u1", tailor_id: "t2", lot_id: "l1", operation_id: "o1", work_date: "2026-09-01", pieces: 10, rate_paise: 500, status: "rejected", note: "Bad stitch", created_at: "" },
    { id: "e4", unit_id: "u1", tailor_id: "t2", lot_id: "l1", operation_id: "o1", work_date: "2026-09-02", pieces: 25, rate_paise: 500, status: "pending", created_at: "" },
  ];

  it("reconciles verified payroll and piece totals with the salary engine", () => {
    const overall = getOverallAnalytics(entries, "2026-09");
    const salarySummary = calculateMonthlySalary(tailors, entries, [], "2026-09");
    const opAnalytics = getOperationAnalytics(entries, operations);

    expect(overall.piecesThisMonth).toBe(salarySummary.totalVerifiedPieces);
    expect(overall.payrollSoFarPaise).toBe(salarySummary.totalGrossPaise);
    expect(overall.pendingReviewsCount).toBe(1); // 1 pending entry (e4)
    expect(opAnalytics).toHaveLength(1);
  });

  it("calculates tailor daily trends, best day output, and rejection rates", () => {
    const tailorMetrics = getTailorAnalytics(entries, tailors, "2026-09");
    const ramesh = tailorMetrics.find((t) => t.tailorId === "t1");
    const suresh = tailorMetrics.find((t) => t.tailorId === "t2");

    expect(ramesh?.verifiedPieces).toBe(50);
    expect(ramesh?.bestDayPieces).toBe(30);
    expect(ramesh?.bestDayDate).toBe("2026-09-02");
    expect(ramesh?.rejectionRatePercent).toBe(0);

    expect(suresh?.verifiedPieces).toBe(0);
    expect(suresh?.rejectionRatePercent).toBe(50); // 1 out of 2 entries rejected
  });

  it("computes lot progress %, labour cost per piece, and projected completion date", () => {
    const lotMetrics = getLotAnalytics(entries, lots, tailors);
    const lotRes = lotMetrics.find((l) => l.lotId === "l1");

    expect(lotRes).toBeDefined();
    expect(lotRes?.completedPieces).toBe(50); // 20 + 30
    expect(lotRes?.remainingPieces).toBe(450); // 500 - 50
    expect(lotRes?.percentage).toBe(10); // 50 / 500 * 100
    expect(lotRes?.costPerPiecePaise).toBe(500); // 25000 paise / 50 pcs = 500 paise
    expect(lotRes?.tailorCount).toBe(1); // Ramesh worked verified
    expect(lotRes?.projectedDaysRemaining).toBeGreaterThan(0);
  });

  it("benchmark: calculates 6 months of data (3,000 entries) in under 50ms", () => {
    const largeEntries: PieceEntry[] = Array.from({ length: 3000 }, (_, i) => ({
      id: `ent_${i}`,
      unit_id: "u1",
      tailor_id: `t${(i % 2) + 1}`,
      lot_id: "l1",
      operation_id: "o1",
      work_date: `2026-0${(i % 6) + 1}-15`,
      pieces: 30,
      rate_paise: 500,
      status: "verified",
      created_at: "",
    }));

    const startTime = performance.now();
    const overall = getOverallAnalytics(largeEntries, "2026-09");
    const tailorRes = getTailorAnalytics(largeEntries, tailors, "2026-09");
    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(overall).toBeDefined();
    expect(tailorRes).toHaveLength(2);
    expect(duration).toBeLessThan(50); // Under 50ms execution speed!
  });
});
