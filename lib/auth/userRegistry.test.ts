import { describe, it, expect, beforeEach } from "vitest";
import {
  findUserByEmail,
  registerNewUser,
  updateUserRole,
  saveUserRegistry,
  INITIAL_USERS,
} from "./userRegistry";

describe("User Registry & Silent Role-Based Login System", () => {
  beforeEach(() => {
    saveUserRegistry(INITIAL_USERS);
  });

  it("silently discovers user role by email without manual role selection", () => {
    const admin = findUserByEmail("admin@silaibook.com");
    expect(admin).toBeDefined();
    expect(admin?.role).toBe("main_admin");
    expect(admin?.status).toBe("approved");

    const manager = findUserByEmail("manager@silaibook.com");
    expect(manager).toBeDefined();
    expect(manager?.role).toBe("manager");

    const tailor = findUserByEmail("tailor@silaibook.com");
    expect(tailor).toBeDefined();
    expect(tailor?.role).toBe("tailor");
  });

  it("automatically approves tailor registration without admin lock", () => {
    const result = registerNewUser("Dinesh Tailor", "dinesh@test.com", "tailor");
    expect(result.requiresAdminVerification).toBe(false);
    expect(result.user.status).toBe("approved");
    expect(result.user.role).toBe("tailor");
  });

  it("marks manager registration as pending_verification requiring admin review", () => {
    const result = registerNewUser("Mukesh Supervisor", "mukesh@test.com", "manager");
    expect(result.requiresAdminVerification).toBe(true);
    expect(result.user.status).toBe("pending_verification");
    expect(result.user.role).toBe("manager");
  });

  it("marks unit owner registration as pending_verification requiring admin review", () => {
    const result = registerNewUser("Bhupatbhai Owner", "bhupat@test.com", "owner", "Bhupat Textiles");
    expect(result.requiresAdminVerification).toBe(true);
    expect(result.user.status).toBe("pending_verification");
    expect(result.user.role).toBe("owner");
  });

  it("allows Main Admin to change role between tailor, manager, and unit owner", () => {
    const tailor = findUserByEmail("tailor@silaibook.com");
    expect(tailor).toBeDefined();
    if (!tailor) return;

    // 1. Promote Tailor to Manager
    const promotedToManager = updateUserRole(tailor.id, "manager");
    const managerUser = promotedToManager.find((u) => u.id === tailor.id);
    expect(managerUser?.role).toBe("manager");

    // 2. Promote Manager to Unit Owner
    const promotedToOwner = updateUserRole(tailor.id, "owner");
    const ownerUser = promotedToOwner.find((u) => u.id === tailor.id);
    expect(ownerUser?.role).toBe("owner");

    // 3. Reassign Unit Owner back to Tailor
    const reassignedToTailor = updateUserRole(tailor.id, "tailor");
    const tailorUser = reassignedToTailor.find((u) => u.id === tailor.id);
    expect(tailorUser?.role).toBe("tailor");
  });
});
