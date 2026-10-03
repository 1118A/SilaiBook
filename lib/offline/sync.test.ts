import { describe, it, expect } from "vitest";
import { checkVerifiedConflict, generateIdempotencyKey } from "./sync";
import { PieceEntry } from "@/lib/types/payroll";

describe("Offline Sync & Conflict Resolution", () => {
  it("generates unique idempotency keys", () => {
    const key1 = generateIdempotencyKey({
      tailor_id: "t1",
      lot_id: "l1",
      operation_id: "o1",
      work_date: "2026-09-10",
      pieces: 50,
    });

    const key2 = generateIdempotencyKey({
      tailor_id: "t1",
      lot_id: "l1",
      operation_id: "o1",
      work_date: "2026-09-10",
      pieces: 50,
    });

    expect(key1).toContain("idemp_t1_l1_o1_2026-09-10_50_");
    expect(key1).not.toBe(key2);
  });

  it("refuses client edits to verified server rows (Server Wins Rule)", () => {
    const verifiedEntry: PieceEntry = {
      id: "e101",
      unit_id: "u1",
      tailor_id: "t1",
      lot_id: "l1",
      operation_id: "o1",
      work_date: "2026-09-01",
      pieces: 25,
      rate_paise: 500,
      status: "verified",
      verified_by: "mgr1",
      verified_at: "2026-09-01T18:00:00Z",
      created_at: "2026-09-01T10:00:00Z",
    };

    const conflict = checkVerifiedConflict(verifiedEntry);
    expect(conflict.allowed).toBe(false);
    expect(conflict.message).toContain("Edit refused: Server status is verified");
  });

  it("allows client edits on pending or non-existent server rows", () => {
    const pendingEntry: PieceEntry = {
      id: "e102",
      unit_id: "u1",
      tailor_id: "t1",
      lot_id: "l1",
      operation_id: "o1",
      work_date: "2026-09-01",
      pieces: 25,
      rate_paise: 500,
      status: "pending",
      created_at: "2026-09-01T10:00:00Z",
    };

    expect(checkVerifiedConflict(pendingEntry).allowed).toBe(true);
    expect(checkVerifiedConflict(undefined).allowed).toBe(true);
  });
});
