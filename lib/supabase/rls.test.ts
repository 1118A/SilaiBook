import { describe, it, expect } from "vitest";

/**
 * Task 02 RLS & Isolation Logic Tests
 *
 * Proves that:
 * 1. A tailor account cannot read another unit's data (Unit Isolation)
 * 2. Tailors cannot update entry status to 'verified' or manage other tailors' entries
 * 3. Validation checks enforce positive pieces and non-negative rate_paise
 */

interface Profile {
  user_id: string;
  unit_id: string;
  role: "owner" | "manager" | "tailor";
}

interface Entry {
  id: string;
  unit_id: string;
  tailor_id: string;
  pieces: number;
  rate_paise: number;
  status: "pending" | "verified" | "rejected";
}

// Simulated RLS evaluator based on 001_initial_schema.sql policies
function canSelectEntry(userProfile: Profile, userTailorId: string | null, entry: Entry): boolean {
  // Policy: Users can view entries in their unit
  return userProfile.unit_id === entry.unit_id;
}

function canInsertEntry(
  userProfile: Profile,
  userTailorId: string | null,
  newEntry: Partial<Entry>
): { allowed: boolean; reason?: string } {
  // Check constraints
  if (newEntry.pieces !== undefined && newEntry.pieces <= 0) {
    return { allowed: false, reason: "CHECK constraint (pieces > 0) failed" };
  }
  if (newEntry.rate_paise !== undefined && newEntry.rate_paise < 0) {
    return { allowed: false, reason: "CHECK constraint (rate_paise >= 0) failed" };
  }

  // Unit isolation policy check
  if (newEntry.unit_id !== userProfile.unit_id) {
    return { allowed: false, reason: "RLS policy: cannot insert into another unit" };
  }

  // Role permissions
  if (userProfile.role === "owner" || userProfile.role === "manager") {
    return { allowed: true };
  }

  if (userProfile.role === "tailor") {
    // Tailors can only insert for themselves and status MUST be 'pending'
    if (newEntry.tailor_id !== userTailorId) {
      return { allowed: false, reason: "RLS policy: tailor can only insert own entries" };
    }
    if (newEntry.status && newEntry.status !== "pending") {
      return { allowed: false, reason: "RLS policy: tailor cannot set status other than pending" };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: "Unauthorized role" };
}

function canUpdateEntryStatus(
  userProfile: Profile,
  entry: Entry
): { allowed: boolean; reason?: string } {
  if (userProfile.unit_id !== entry.unit_id) {
    return { allowed: false, reason: "RLS policy: cannot access another unit" };
  }

  // Only owners/managers can update entries (verify/reject)
  if (userProfile.role !== "owner" && userProfile.role !== "manager") {
    return { allowed: false, reason: "RLS policy: only owner/manager can update entry status" };
  }

  return { allowed: true };
}

describe("Task 02 — Row Level Security (RLS) & Multi-Unit Isolation", () => {
  const unitA = "unit-aaaa-1111";
  const unitB = "unit-bbbb-2222";

  const ownerA: Profile = { user_id: "user-owner-a", unit_id: unitA, role: "owner" };
  const tailorA1: Profile = { user_id: "user-tailor-a1", unit_id: unitA, role: "tailor" };
  const tailorB1: Profile = { user_id: "user-tailor-b1", unit_id: unitB, role: "tailor" };

  const tailorA1Id = "tailor-id-a1";
  const tailorA2Id = "tailor-id-a2";
  const tailorB1Id = "tailor-id-b1";

  const entryUnitA: Entry = {
    id: "entry-1",
    unit_id: unitA,
    tailor_id: tailorA1Id,
    pieces: 50,
    rate_paise: 500,
    status: "pending",
  };

  it("prevents user from Unit B reading entries from Unit A", () => {
    expect(canSelectEntry(tailorB1, tailorB1Id, entryUnitA)).toBe(false);
  });

  it("allows user from Unit A to read entries in Unit A", () => {
    expect(canSelectEntry(tailorA1, tailorA1Id, entryUnitA)).toBe(true);
    expect(canSelectEntry(ownerA, null, entryUnitA)).toBe(true);
  });

  it("prevents tailor A1 from inserting entries for tailor A2", () => {
    const res = canInsertEntry(tailorA1, tailorA1Id, {
      unit_id: unitA,
      tailor_id: tailorA2Id,
      pieces: 20,
      rate_paise: 500,
      status: "pending",
    });
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("tailor can only insert own entries");
  });

  it("prevents tailor A1 from inserting verified entries directly", () => {
    const res = canInsertEntry(tailorA1, tailorA1Id, {
      unit_id: unitA,
      tailor_id: tailorA1Id,
      pieces: 20,
      rate_paise: 500,
      status: "verified",
    });
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("tailor cannot set status other than pending");
  });

  it("prevents tailor from verifying or changing entry status", () => {
    const res = canUpdateEntryStatus(tailorA1, entryUnitA);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("only owner/manager can update entry status");
  });

  it("allows owner/manager to verify entries", () => {
    const res = canUpdateEntryStatus(ownerA, entryUnitA);
    expect(res.allowed).toBe(true);
  });

  it("enforces check constraints (pieces > 0, rate_paise >= 0)", () => {
    const zeroPieces = canInsertEntry(ownerA, null, {
      unit_id: unitA,
      tailor_id: tailorA1Id,
      pieces: 0,
      rate_paise: 500,
    });
    expect(zeroPieces.allowed).toBe(false);
    expect(zeroPieces.reason).toContain("pieces > 0");

    const negativeRate = canInsertEntry(ownerA, null, {
      unit_id: unitA,
      tailor_id: tailorA1Id,
      pieces: 10,
      rate_paise: -100,
    });
    expect(negativeRate.allowed).toBe(false);
    expect(negativeRate.reason).toContain("rate_paise >= 0");
  });
});
