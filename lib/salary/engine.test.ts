import { describe, it, expect } from "vitest";
import { calculateMonthlySalary } from "./engine";
import { PieceEntry, Adjustment, Tailor } from "@/lib/types/payroll";

describe("Task 05 — Monthly Salary Engine Unit Tests", () => {
  const tailor1: Tailor = { id: "t1", unit_id: "u1", name: "Ramesh Patel", active: true, created_at: "" };
  const tailor2: Tailor = { id: "t2", unit_id: "u1", name: "Suresh Kumar", active: true, created_at: "" };
  const tailors = [tailor1, tailor2];

  it("calculates gross = sum(verified pieces * rate_paise) and net = gross + bonus - advance - deduction", () => {
    const entries: PieceEntry[] = [
      { id: "e1", unit_id: "u1", tailor_id: "t1", lot_id: "l1", operation_id: "o1", work_date: "2026-09-01", pieces: 20, rate_paise: 500, status: "verified", created_at: "" }, // 10,000 paise
      { id: "e2", unit_id: "u1", tailor_id: "t1", lot_id: "l1", operation_id: "o1", work_date: "2026-09-02", pieces: 30, rate_paise: 600, status: "verified", created_at: "" }, // 18,000 paise (rate change mid-month)
      { id: "e3", unit_id: "u1", tailor_id: "t1", lot_id: "l1", operation_id: "o1", work_date: "2026-09-03", pieces: 40, rate_paise: 500, status: "pending", created_at: "" }, // 20,000 paise (pending - NOT in gross)
    ];

    const adjustments: Adjustment[] = [
      { id: "a1", unit_id: "u1", tailor_id: "t1", month: "2026-09-01", type: "bonus", amount_paise: 5000, created_at: "" },
      { id: "a2", unit_id: "u1", tailor_id: "t1", month: "2026-09-01", type: "advance", amount_paise: 10000, created_at: "" },
    ];

    const summary = calculateMonthlySalary(tailors, entries, adjustments, "2026-09");
    const ramesh = summary.tailors.find((t) => t.tailorId === "t1");

    expect(ramesh).toBeDefined();
    expect(ramesh?.verifiedPieces).toBe(50);
    expect(ramesh?.grossPaise).toBe(28000); // 10000 + 18000
    expect(ramesh?.bonusPaise).toBe(5000);
    expect(ramesh?.advancePaise).toBe(10000);
    expect(ramesh?.netPaise).toBe(23000); // 28000 + 5000 - 10000
    expect(ramesh?.pendingPaise).toBe(20000); // 40 * 500
    expect(ramesh?.negativeNetWarning).toBe(false);
  });

  it("handles zero pieces gracefully and flags negative net warnings when advances exceed gross", () => {
    const entries: PieceEntry[] = []; // zero work done
    const adjustments: Adjustment[] = [
      { id: "a1", unit_id: "u1", tailor_id: "t2", month: "2026-09-01", type: "advance", amount_paise: 50000, created_at: "" },
    ];

    const summary = calculateMonthlySalary(tailors, entries, adjustments, "2026-09");
    const suresh = summary.tailors.find((t) => t.tailorId === "t2");

    expect(suresh?.grossPaise).toBe(0);
    expect(suresh?.netPaise).toBe(-50000);
    expect(suresh?.negativeNetWarning).toBe(true);
  });

  it("benchmark: calculates a 50-tailor seeded month in under 50ms", () => {
    const seededTailors: Tailor[] = Array.from({ length: 50 }, (_, i) => ({
      id: `tailor_${i}`,
      unit_id: "u1",
      name: `Tailor ${i}`,
      active: true,
      created_at: "",
    }));

    const seededEntries: PieceEntry[] = Array.from({ length: 1500 }, (_, i) => ({
      id: `entry_${i}`,
      unit_id: "u1",
      tailor_id: `tailor_${i % 50}`,
      lot_id: "l1",
      operation_id: "o1",
      work_date: `2026-09-${String((i % 28) + 1).padStart(2, "0")}`,
      pieces: 25,
      rate_paise: 500,
      status: i % 4 === 0 ? "pending" : "verified",
      created_at: "",
    }));

    const seededAdjustments: Adjustment[] = Array.from({ length: 100 }, (_, i) => ({
      id: `adj_${i}`,
      unit_id: "u1",
      tailor_id: `tailor_${i % 50}`,
      month: "2026-09-01",
      type: i % 2 === 0 ? "bonus" : "advance",
      amount_paise: 2000,
      created_at: "",
    }));

    const startTime = performance.now();
    const summary = calculateMonthlySalary(seededTailors, seededEntries, seededAdjustments, "2026-09");
    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(summary.tailors).toHaveLength(50);
    expect(duration).toBeLessThan(50); // Under 50ms execution speed!
  });
});
