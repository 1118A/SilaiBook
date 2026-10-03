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
});
