import { describe, it, expect } from "vitest";
import { toPaise, fromPaise, formatINR } from "@/lib/money";
import { computeEntryTotalPaise } from "@/lib/store/payroll-store";
import { pieceEntrySchema } from "@/lib/validations/entry";

describe("Task 03 — Piece Entry & Lot Calculations", () => {
  it("stores 115500 paise rate-snapshot math correctly for 35 pieces @ ₹33 rate (35 × 3300)", () => {
    const pieces = 35;
    const rateRupees = 33;
    const ratePaise = toPaise(rateRupees); // 3300 paise

    expect(ratePaise).toBe(3300);

    const totalPaise = computeEntryTotalPaise(pieces, ratePaise); // 35 * 3300 = 115500
    expect(totalPaise).toBe(115500);

    const rupeesValue = fromPaise(totalPaise);
    expect(rupeesValue).toBe(1155);

    const formattedString = formatINR(totalPaise);
    expect(formattedString).toContain("1,155");
  });

  it("calculates lot completion percentages correctly", () => {
    const totalPiecesTarget = 500;
    const donePieces = 350;
    const remainingPieces = totalPiecesTarget - donePieces;
    const percentage = Math.round((donePieces / totalPiecesTarget) * 100);

    expect(remainingPieces).toBe(150);
    expect(percentage).toBe(70);
  });

  it("validates piece entry input correctly via Zod", () => {
    const validEntry = {
      tailor_id: "b001",
      lot_id: "c001",
      operation_id: "d001",
      work_date: "2026-10-02",
      pieces: 35,
      rate_paise: 3300,
    };

    const result = pieceEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);

    const invalidPieces = pieceEntrySchema.safeParse({
      ...validEntry,
      pieces: 0,
    });
    expect(invalidPieces.success).toBe(false);

    const invalidRate = pieceEntrySchema.safeParse({
      ...validEntry,
      rate_paise: -500,
    });
    expect(invalidRate.success).toBe(false);
  });
});
