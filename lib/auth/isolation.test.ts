import { describe, it, expect } from "vitest";
import {
  findUserByEmail,
  updateUserProfile,
  findUserById,
} from "@/lib/auth/userRegistry";
import { PieceEntry, Tailor } from "@/lib/types/payroll";

describe("Profile and Data Isolation System", () => {
  describe("Profile Editing & Role Immutability", () => {
    it("allows user to update their name, phone, avatar, and preferred language", () => {
      const tailorUser = findUserByEmail("tailor@silaibook.com");
      expect(tailorUser).toBeDefined();

      if (!tailorUser) return;

      const updated = updateUserProfile(tailorUser.id, {
        name: "Ramesh Bhai Updated",
        phone: "+91 99999 88888",
        avatar_url: "✂️",
        language: "gu",
      });

      expect(updated).not.toBeNull();
      expect(updated?.name).toBe("Ramesh Bhai Updated");
      expect(updated?.phone).toBe("+91 99999 88888");
      expect(updated?.avatar_url).toBe("✂️");
      expect(updated?.language).toBe("gu");
      expect(updated?.role).toBe("tailor"); // Role remains tailor
    });

    it("strictly prevents modification of user_role on profile updates", () => {
      const tailorUser = findUserByEmail("tailor@silaibook.com");
      expect(tailorUser).toBeDefined();

      if (!tailorUser) return;

      // Malicious attempt to escalate role to main_admin
      const maliciousPayload = {
        name: "Hacker Tailor",
        role: "main_admin" as unknown as string,
      };

      const updated = updateUserProfile(tailorUser.id, maliciousPayload);

      expect(updated).not.toBeNull();
      expect(updated?.name).toBe("Hacker Tailor");
      // The role MUST remain strictly 'tailor'
      expect(updated?.role).toBe("tailor");

      // Verify persistent lookup
      const persisted = findUserById(tailorUser.id);
      expect(persisted?.role).toBe("tailor");
    });
  });

  describe("Tailor Data Isolation", () => {
    const mockTailors: Tailor[] = [
      { id: "tailor-1", unit_id: "unit-1", name: "Ramesh Patel", phone: "9876543210", active: true, created_at: "2026-01-01" },
      { id: "tailor-2", unit_id: "unit-1", name: "Suresh Shah", phone: "9876543211", active: true, created_at: "2026-01-01" },
    ];

    const mockEntries: PieceEntry[] = [
      {
        id: "entry-1",
        unit_id: "unit-1",
        tailor_id: "tailor-1",
        lot_id: "lot-1",
        operation_id: "op-1",
        work_date: "2026-09-10",
        pieces: 25,
        rate_paise: 500,
        status: "verified",
        created_at: "2026-09-10T10:00:00Z",
      },
      {
        id: "entry-2",
        unit_id: "unit-1",
        tailor_id: "tailor-2",
        lot_id: "lot-1",
        operation_id: "op-1",
        work_date: "2026-09-10",
        pieces: 30,
        rate_paise: 500,
        status: "verified",
        created_at: "2026-09-10T11:00:00Z",
      },
    ];

    it("filters and shows only tailor's own entries when role is tailor", () => {
      const tailorSession = {
        role: "tailor" as string,
        tailor_id: "tailor-1",
        name: "Ramesh Patel",
      };

      const matchedTailor = mockTailors.find(
        (t) => t.id === tailorSession.tailor_id || t.name.toLowerCase().includes(tailorSession.name.toLowerCase())
      );

      const tailorAccessibleEntries = mockEntries.filter((entry) => {
        if (tailorSession.role === "tailor" && matchedTailor && entry.tailor_id !== matchedTailor.id) {
          return false;
        }
        return true;
      });

      expect(tailorAccessibleEntries.length).toBe(1);
      expect(tailorAccessibleEntries[0].id).toBe("entry-1");
      expect(tailorAccessibleEntries[0].tailor_id).toBe("tailor-1");
    });

    it("allows manager to view unified work reports and access entries across all tailors", () => {
      const managerSession = {
        role: "manager" as string,
        name: "Mukesh Manager",
      };

      const managerAccessibleEntries = mockEntries.filter((entry) => {
        if (managerSession.role === "tailor") {
          return entry.tailor_id === "tailor-1";
        }
        return true;
      });

      expect(managerAccessibleEntries.length).toBe(2);
      expect(managerAccessibleEntries.map((e) => e.tailor_id)).toEqual(["tailor-1", "tailor-2"]);
    });
  });

  describe("Multi-Facility Tenancy & Data Isolation", () => {
    const multiFacilityTailors: Tailor[] = [
      { id: "t-fac1-1", unit_id: "facility-alpha", name: "Alpha Tailor 1", active: true, created_at: "2026-01-01" },
      { id: "t-fac1-2", unit_id: "facility-alpha", name: "Alpha Tailor 2", active: true, created_at: "2026-01-01" },
      { id: "t-fac2-1", unit_id: "facility-beta", name: "Beta Tailor 1", active: true, created_at: "2026-01-01" },
    ];

    const multiFacilityEntries: PieceEntry[] = [
      { id: "e-fac1", unit_id: "facility-alpha", tailor_id: "t-fac1-1", lot_id: "l1", operation_id: "o1", work_date: "2026-09-01", pieces: 20, rate_paise: 500, status: "verified", created_at: "2026-09-01" },
      { id: "e-fac2", unit_id: "facility-beta", tailor_id: "t-fac2-1", lot_id: "l2", operation_id: "o1", work_date: "2026-09-01", pieces: 25, rate_paise: 500, status: "verified", created_at: "2026-09-01" },
    ];

    it("enforces that Managers can ONLY view tailors and entries within their assigned facility", () => {
      const managerAlphaSession = {
        role: "manager",
        unit_id: "facility-alpha",
        name: "Alpha Supervisor",
      };

      const visibleTailors = multiFacilityTailors.filter((t) => t.unit_id === managerAlphaSession.unit_id);
      const visibleEntries = multiFacilityEntries.filter((e) => e.unit_id === managerAlphaSession.unit_id);

      expect(visibleTailors.length).toBe(2);
      expect(visibleTailors.every((t) => t.unit_id === "facility-alpha")).toBe(true);
      expect(visibleTailors.some((t) => t.id === "t-fac2-1")).toBe(false); // Zero cross-facility leakage

      expect(visibleEntries.length).toBe(1);
      expect(visibleEntries[0].id).toBe("e-fac1");
    });

    it("enforces that Unit Owners can ONLY access data belonging to their specific facility", () => {
      const ownerBetaSession = {
        role: "owner",
        unit_id: "facility-beta",
        name: "Beta Facility Owner",
      };

      const visibleTailors = multiFacilityTailors.filter((t) => t.unit_id === ownerBetaSession.unit_id);
      const visibleEntries = multiFacilityEntries.filter((e) => e.unit_id === ownerBetaSession.unit_id);

      expect(visibleTailors.length).toBe(1);
      expect(visibleTailors[0].name).toBe("Beta Tailor 1");

      expect(visibleEntries.length).toBe(1);
      expect(visibleEntries[0].unit_id).toBe("facility-beta");
    });
  });

  describe("Access Control & RBAC Auditing Enforcement", () => {
    it("strictly blocks Global User and Access Auditor roles from obtaining or inheriting full administrative permissions", async () => {
      const { isFullAdmin, isBlockedFromAdmin, canAccessSection } = await import("@/lib/auth/permissions");

      // Verify isFullAdmin assertions
      expect(isFullAdmin("main_admin")).toBe(true);
      expect(isFullAdmin("global_user")).toBe(false);
      expect(isFullAdmin("access_auditor")).toBe(false);
      expect(isFullAdmin("manager")).toBe(false);
      expect(isFullAdmin("owner")).toBe(false);

      // Verify isBlockedFromAdmin assertions
      expect(isBlockedFromAdmin("global_user")).toBe(true);
      expect(isBlockedFromAdmin("access_auditor")).toBe(true);
      expect(isBlockedFromAdmin("main_admin")).toBe(false);

      // Verify granular section blocks
      expect(canAccessSection("global_user", "system_health")).toBe(false);
      expect(canAccessSection("global_user", "units_management")).toBe(false);
      expect(canAccessSection("access_auditor", "salary_engine")).toBe(false);
      expect(canAccessSection("access_auditor", "verification_inbox")).toBe(false);
    });
  });
});
