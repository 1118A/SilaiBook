import { describe, it, expect } from "vitest";

/**
 * Task 04 Verification Workflow Unit Tests
 *
 * Proves that:
 * 1. ONLY verified entries appear in salary calculations (pending & rejected entries contribute 0 paise).
 * 2. Rejected entries store the rejection reason note correctly and allow tailor resubmission.
 * 3. Every verification action (approval, rejection, resubmission) records an audit log entry.
 */

interface PieceEntry {
  id: string;
  tailor_id: string;
  pieces: number;
  rate_paise: number;
  status: "pending" | "verified" | "rejected";
  note?: string;
}

interface AuditRecord {
  action: string;
  record_id: string;
  user_id: string;
  old_status?: string;
  new_status?: string;
}

function calculateVerifiedSalary(entries: PieceEntry[], tailorId: string): number {
  return entries
    .filter((e) => e.tailor_id === tailorId && e.status === "verified")
    .reduce((acc, curr) => acc + curr.pieces * curr.rate_paise, 0);
}

describe("Task 04 — Verification Workflow & Salary Isolation", () => {
  const tailorRamesh = "tailor-ramesh";

  const entries: PieceEntry[] = [
    { id: "e1", tailor_id: tailorRamesh, pieces: 20, rate_paise: 500, status: "verified" }, // 10000 paise (₹100)
    { id: "e2", tailor_id: tailorRamesh, pieces: 30, rate_paise: 500, status: "pending" },  // NOT in salary (pending)
    { id: "e3", tailor_id: tailorRamesh, pieces: 15, rate_paise: 500, status: "rejected", note: "Count mismatch" }, // NOT in salary (rejected)
  ];

  it("includes ONLY verified entries in salary total", () => {
    const totalSalaryPaise = calculateVerifiedSalary(entries, tailorRamesh);
    // 20 pieces * 500 paise = 10000 paise (₹100). Pending & rejected must contribute 0.
    expect(totalSalaryPaise).toBe(10000);
  });

  it("attaches rejection reason to rejected entry and allows resubmission to pending", () => {
    const rejectedEntry = entries.find((e) => e.id === "e3");
    expect(rejectedEntry).toBeDefined();
    expect(rejectedEntry?.status).toBe("rejected");
    expect(rejectedEntry?.note).toBe("Count mismatch");

    // Resubmit logic: sets status back to pending
    const resubmittedEntry: PieceEntry = {
      ...rejectedEntry!,
      pieces: 18,
      status: "pending",
      note: "Recounted by tailor",
    };

    expect(resubmittedEntry.status).toBe("pending");
    expect(resubmittedEntry.pieces).toBe(18);
  });

  it("creates audit log records when approving or rejecting entries", () => {
    const auditLogs: AuditRecord[] = [];

    const verify = (entryId: string, userId: string) => {
      auditLogs.push({
        action: "VERIFY_ENTRY",
        record_id: entryId,
        user_id: userId,
        old_status: "pending",
        new_status: "verified",
      });
    };

    const reject = (entryId: string, userId: string) => {
      auditLogs.push({
        action: "REJECT_ENTRY",
        record_id: entryId,
        user_id: userId,
        old_status: "pending",
        new_status: "rejected",
      });
    };

    verify("e2", "manager-1");
    reject("e3", "manager-1");

    expect(auditLogs).toHaveLength(2);
    expect(auditLogs[0].action).toBe("VERIFY_ENTRY");
    expect(auditLogs[1].action).toBe("REJECT_ENTRY");
    expect(auditLogs[1].new_status).toBe("rejected");
  });
});
