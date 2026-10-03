/**
 * Central User Registry & Authentication Store for SilaiBook.
 * Implements silent role lookup, status verification (approved/pending/rejected),
 * and admin verification workflows.
 */

import { Role } from "@/lib/types/payroll";

export type UserStatus = "approved" | "pending_verification" | "rejected";

export interface RegisteredUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  unit_id: string;
  unit_name?: string;
  phone?: string;
  avatar_url?: string;
  language?: "en" | "gu" | "hi";
  tailor_id?: string;
  status: UserStatus;
  created_at: string;
}

export const INITIAL_USERS: RegisteredUser[] = [
  {
    id: "usr_admin_01",
    email: "admin@silaibook.com",
    name: "Super Admin (Platform)",
    role: "main_admin",
    unit_id: "a0000000-0000-0000-0000-000000000001",
    unit_name: "SilaiBook HQ",
    status: "approved",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "usr_owner_01",
    email: "owner@radhegarments.com",
    name: "Pravinbhai Patel",
    role: "owner",
    unit_id: "a0000000-0000-0000-0000-000000000001",
    unit_name: "Radhe Krishna Garments (સુરત)",
    status: "approved",
    created_at: "2026-08-15T00:00:00Z",
  },
  {
    id: "usr_mgr_01",
    email: "manager@silaibook.com",
    name: "Ramesh Manager",
    role: "manager",
    unit_id: "a0000000-0000-0000-0000-000000000001",
    unit_name: "Radhe Krishna Garments (સુરત)",
    status: "approved",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "usr_tailor_01",
    email: "tailor@silaibook.com",
    name: "Suresh Tailor",
    role: "tailor",
    unit_id: "a0000000-0000-0000-0000-000000000001",
    unit_name: "Radhe Krishna Garments (સુરત)",
    status: "approved",
    created_at: "2026-09-05T00:00:00Z",
  },
  {
    id: "usr_pending_01",
    email: "kantibhai@surattex.com",
    name: "Kantibhai Garments (New Unit)",
    role: "owner",
    unit_id: "a0000000-0000-0000-0000-000000000005",
    unit_name: "Kanti Textile Works (સુરત)",
    status: "pending_verification",
    created_at: "2026-10-02T10:30:00Z",
  },
  {
    id: "usr_pending_02",
    email: "dipak.supervisor@narol.com",
    name: "Dipak Supervisor (Manager Request)",
    role: "manager",
    unit_id: "a0000000-0000-0000-0000-000000000002",
    unit_name: "Ambica Stitching Works (અમદાવાદ)",
    status: "pending_verification",
    created_at: "2026-10-03T08:15:00Z",
  },
];

const USER_REGISTRY_KEY = "silaibook_user_registry";

/**
 * Loads the user registry from localStorage (or fallback to INITIAL_USERS).
 */
export function loadUserRegistry(): RegisteredUser[] {
  if (typeof window === "undefined") return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(USER_REGISTRY_KEY);
    if (!raw) {
      localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw) as RegisteredUser[];
  } catch {
    return INITIAL_USERS;
  }
}

/**
 * Saves user registry to localStorage.
 */
export function saveUserRegistry(users: RegisteredUser[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(users));
  }
}

/**
 * Looks up user by email silently.
 */
export function findUserByEmail(email: string): RegisteredUser | undefined {
  const users = loadUserRegistry();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized);
}

/**
 * Looks up user by ID.
 */
export function findUserById(userId: string): RegisteredUser | undefined {
  const users = loadUserRegistry();
  return users.find((u) => u.id === userId);
}

/**
 * Registers a new user with status rule:
 * - tailor: approved immediately
 * - manager or owner: pending_verification
 */
export function registerNewUser(
  name: string,
  email: string,
  role: Role,
  unitName?: string
): { user: RegisteredUser; requiresAdminVerification: boolean } {
  const users = loadUserRegistry();
  const normalized = email.trim().toLowerCase();
  
  const existing = users.find((u) => u.email.toLowerCase() === normalized);
  if (existing) {
    return {
      user: existing,
      requiresAdminVerification: existing.status === "pending_verification",
    };
  }

  const isRequiresVerification = role === "owner" || role === "manager";
  const newUser: RegisteredUser = {
    id: "usr_" + Math.random().toString(36).substring(2, 9),
    email: normalized,
    name: name.trim(),
    role,
    unit_id: "a0000000-0000-0000-0000-000000000001",
    unit_name: unitName || (role === "owner" ? `${name}'s Garments` : "Radhe Krishna Garments"),
    status: isRequiresVerification ? "pending_verification" : "approved",
    created_at: new Date().toISOString(),
  };

  const updated = [newUser, ...users];
  saveUserRegistry(updated);

  return {
    user: newUser,
    requiresAdminVerification: isRequiresVerification,
  };
}

/**
 * Updates user profile details (name, phone, avatar_url, language).
 * STRICT SECURITY: The `role` property is excluded and protected from user modification.
 */
export function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    phone?: string;
    avatar_url?: string;
    language?: "en" | "gu" | "hi";
  }
): RegisteredUser | undefined {
  const users = loadUserRegistry();
  let updatedUser: RegisteredUser | undefined;

  const updated = users.map((u) => {
    if (u.id === userId) {
      updatedUser = {
        ...u,
        name: updates.name !== undefined ? updates.name.trim() : u.name,
        phone: updates.phone !== undefined ? updates.phone.trim() : u.phone,
        avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : u.avatar_url,
        language: updates.language !== undefined ? updates.language : u.language,
        // user_role remains untouched and immutable!
      };
      return updatedUser;
    }
    return u;
  });

  saveUserRegistry(updated);
  return updatedUser;
}

/**
 * Updates user verification status (approved / rejected).
 */
export function updateUserStatus(userId: string, newStatus: UserStatus): RegisteredUser[] {
  const users = loadUserRegistry();
  const updated = users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
  saveUserRegistry(updated);
  return updated;
}
