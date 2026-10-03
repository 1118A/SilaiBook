import { describe, it, expect, beforeEach } from "vitest";
import {
  findUserByEmail,
  registerNewUser,
  updateUserStatus,
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

  it("allows Main Admin to approve a pending user", () => {
    const pendingUser = findUserByEmail("kantibhai@surattex.com");
    expect(pendingUser?.status).toBe("pending_verification");

    if (pendingUser) {
      const updatedList = updateUserStatus(pendingUser.id, "approved");
      const approved = updatedList.find((u) => u.id === pendingUser.id);
      expect(approved?.status).toBe("approved");
    }
  });
});
