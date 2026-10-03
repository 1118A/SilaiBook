import { describe, it, expect } from "vitest";
import { calculateMonthlySalary } from "@/lib/salary/engine";
import { PieceEntry, Tailor, Adjustment } from "@/lib/types/payroll";
import { multiplyPaise } from "@/lib/money";

describe("Multilingual & Piece-Rate Payroll Workflow Smoke Test", () => {
  const UNIT_ID = "unit-test-001";
  const MANAGER_ID = "mgr-test-001";

  const sampleTailors: Tailor[] = [
    { id: "t1", unit_id: UNIT_ID, name: "Ramesh Patel (રમેશ પટેલ)", phone: "9876500001", active: true, created_at: "2026-09-01T00:00:00Z" },
    { id: "t2", unit_id: UNIT_ID, name: "Meena Devi (मीना देवी)", phone: "9876500002", active: true, created_at: "2026-09-01T00:00:00Z" },
  ];

  it("completes entry -> verify -> payroll calculation correctly with zero precision loss", () => {
    // 1. Create piece entries
    const entries: PieceEntry[] = [
      {
        id: "e1",
        unit_id: UNIT_ID,
        tailor_id: "t1",
        lot_id: "l1",
        operation_id: "o1",
        work_date: "2026-09-15",
        pieces: 40,
        rate_paise: 500, // ₹5.00
        status: "verified",
        verified_by: MANAGER_ID,
        verified_at: "2026-09-15T18:00:00Z",
        created_at: "2026-09-15T10:00:00Z",
      },
      {
        id: "e2",
        unit_id: UNIT_ID,
        tailor_id: "t1",
        lot_id: "l1",
        operation_id: "o1",
        work_date: "2026-09-16",
        pieces: 30,
        rate_paise: 500, // ₹5.00
        status: "pending",
        created_at: "2026-09-16T10:00:00Z",
      },
      {
        id: "e3",
        unit_id: UNIT_ID,
        tailor_id: "t2",
        lot_id: "l1",
        operation_id: "o1",
        work_date: "2026-09-15",
        pieces: 50,
        rate_paise: 500, // ₹5.00
        status: "verified",
        verified_by: MANAGER_ID,
        verified_at: "2026-09-15T18:00:00Z",
        created_at: "2026-09-15T10:00:00Z",
      },
    ];

    const adjustments: Adjustment[] = [
      {
        id: "adj1",
        unit_id: UNIT_ID,
        tailor_id: "t1",
        month: "2026-09",
        type: "bonus",
        amount_paise: 5000, // ₹50.00
        created_at: "2026-09-20T00:00:00Z",
      },
      {
        id: "adj2",
        unit_id: UNIT_ID,
        tailor_id: "t2",
        month: "2026-09",
        type: "advance",
        amount_paise: 10000, // ₹100.00
        created_at: "2026-09-20T00:00:00Z",
      },
    ];

    // 2. Compute payroll summary
    const summary = calculateMonthlySalary(sampleTailors, entries, adjustments, "2026-09");

    expect(summary.totalVerifiedPieces).toBe(90); // 40 + 50
    expect(summary.totalGrossPaise).toBe(multiplyPaise(500, 90)); // ₹450.00 = 45000 paise

    // Tailor 1: Verified Gross = 40 * 500 = 20000 paise (₹200.00), Bonus = 5000 paise (₹50.00), Net = 25000 paise (₹250.00)
    const t1Summary = summary.tailors.find((t) => t.tailorId === "t1");
    expect(t1Summary).toBeDefined();
    expect(t1Summary?.verifiedPieces).toBe(40);
    expect(t1Summary?.grossPaise).toBe(20000);
    expect(t1Summary?.bonusPaise).toBe(5000);
    expect(t1Summary?.netPaise).toBe(25000);
    expect(t1Summary?.pendingPieces).toBe(30);

    // Tailor 2: Verified Gross = 50 * 500 = 25000 paise (₹250.00), Advance = 10000 paise (₹100.00), Net = 15000 paise (₹150.00)
    const t2Summary = summary.tailors.find((t) => t.tailorId === "t2");
    expect(t2Summary).toBeDefined();
    expect(t2Summary?.verifiedPieces).toBe(50);
    expect(t2Summary?.grossPaise).toBe(25000);
    expect(t2Summary?.advancePaise).toBe(10000);
    expect(t2Summary?.netPaise).toBe(15000);
  });
});
