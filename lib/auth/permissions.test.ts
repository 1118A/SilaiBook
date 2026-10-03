import { describe, it, expect } from "vitest";
import {
  canAccessSection,
  getAvailableSections,
  getDefaultSection,
  ROLE_PERMISSIONS,
} from "./permissions";
import { Role } from "@/lib/types/payroll";

describe("Role-Based Access Control (RBAC) Permissions", () => {
  it("allows main_admin full access to all sections and capabilities", () => {
    const role: Role = "main_admin";
    expect(canAccessSection(role, "main_admin_overview")).toBe(true);
    expect(canAccessSection(role, "units_management")).toBe(true);
    expect(canAccessSection(role, "system_health")).toBe(true);
    expect(canAccessSection(role, "salary_engine")).toBe(true);
    expect(canAccessSection(role, "verification_inbox")).toBe(true);
    expect(canAccessSection(role, "quick_entry")).toBe(true);

    const perms = ROLE_PERMISSIONS[role];
    expect(perms.canAccessAllUnits).toBe(true);
    expect(perms.canCloseMonth).toBe(true);
    expect(perms.canManageUsers).toBe(true);
    expect(perms.canVerifyEntries).toBe(true);
  });

  it("restricts tailor from accessing management and admin sections", () => {
    const role: Role = "tailor";
    expect(canAccessSection(role, "quick_entry")).toBe(true);
    expect(canAccessSection(role, "my_entries")).toBe(true);
    expect(canAccessSection(role, "lots")).toBe(true);

    // Strictly disallowed
    expect(canAccessSection(role, "verification_inbox")).toBe(false);
    expect(canAccessSection(role, "salary_engine")).toBe(false);
    expect(canAccessSection(role, "manager_analytics")).toBe(false);
    expect(canAccessSection(role, "audit_log")).toBe(false);
    expect(canAccessSection(role, "tailors")).toBe(false);
    expect(canAccessSection(role, "operations")).toBe(false);
    expect(canAccessSection(role, "main_admin_overview")).toBe(false);
    expect(canAccessSection(role, "units_management")).toBe(false);

    const perms = ROLE_PERMISSIONS[role];
    expect(perms.canVerifyEntries).toBe(false);
    expect(perms.canCloseMonth).toBe(false);
    expect(perms.canAccessAllUnits).toBe(false);
  });

  it("allows manager operational access but restricts month closing and platform admin", () => {
    const role: Role = "manager";
    expect(canAccessSection(role, "verification_inbox")).toBe(true);
    expect(canAccessSection(role, "quick_entry")).toBe(true);
    expect(canAccessSection(role, "manager_analytics")).toBe(true);

    expect(canAccessSection(role, "main_admin_overview")).toBe(false);
    expect(canAccessSection(role, "units_management")).toBe(false);

    const perms = ROLE_PERMISSIONS[role];
    expect(perms.canVerifyEntries).toBe(true);
    expect(perms.canCloseMonth).toBe(false);
    expect(perms.canAccessAllUnits).toBe(false);
  });

  it("returns appropriate default landing section for each role", () => {
    expect(getDefaultSection("main_admin")).toBe("main_admin_overview");
    expect(getDefaultSection("owner")).toBe("manager_analytics");
    expect(getDefaultSection("manager")).toBe("verification_inbox");
    expect(getDefaultSection("tailor")).toBe("quick_entry");
  });

  it("returns available section list matching permission configuration", () => {
    const tailorSections = getAvailableSections("tailor");
    expect(tailorSections).toEqual(["quick_entry", "my_entries", "lots"]);
  });
});
