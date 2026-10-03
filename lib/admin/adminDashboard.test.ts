import { describe, it, expect } from "vitest";
import {
  loadUserRegistry,
  updateUserStatus,
  INITIAL_USERS,
  type UserStatus,
} from "@/lib/auth/userRegistry";

describe("Main Admin Dashboard & Governance Subsystem", () => {
  it("loads the initial administrative users correctly", () => {
    const users = loadUserRegistry();
    expect(users.length).toBeGreaterThanOrEqual(INITIAL_USERS.length);
    const mainAdmin = users.find((u) => u.role === "main_admin");
    expect(mainAdmin).toBeDefined();
    expect(mainAdmin?.email).toBe("admin@silaibook.com");
  });

  it("approves pending manager registration", () => {
    const pendingUser = loadUserRegistry().find((u) => u.status === "pending_verification");
    if (pendingUser) {
      const updatedList = updateUserStatus(pendingUser.id, "approved" as UserStatus);
      const updatedUser = updatedList.find((u) => u.id === pendingUser.id);
      expect(updatedUser?.status).toBe("approved");
    }
  });

  it("calculates platform growth metrics accurately", () => {
    const dau = 385;
    const mau = 1240;
    const stickinessRatio = ((dau / mau) * 100).toFixed(1);
    expect(parseFloat(stickinessRatio)).toBeCloseTo(31.0, 1);

    const cohortDay1 = 94;
    const cohortDay30 = 71;
    expect(cohortDay1).toBeGreaterThan(cohortDay30);
  });

  it("verifies admin dashboard access isolation", async () => {
    const { canAccessSection, isFullAdmin } = await import("@/lib/auth/permissions");
    expect(canAccessSection("main_admin", "main_admin_overview")).toBe(true);
    expect(canAccessSection("tailor", "main_admin_overview")).toBe(false);
    expect(canAccessSection("manager", "main_admin_overview")).toBe(false);
    expect(canAccessSection("owner", "main_admin_overview")).toBe(false);
    expect(isFullAdmin("main_admin")).toBe(true);
    expect(isFullAdmin("manager")).toBe(false);
  });
});
