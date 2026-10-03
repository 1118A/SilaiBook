/**
 * Role-Based Access Control (RBAC) & Authorization Matrix for SilaiBook.
 * Defines section permissions, action capabilities, and role hierarchies.
 */

import { Role } from "@/lib/types/payroll";

export type SectionKey =
  | "main_admin_overview"
  | "units_management"
  | "system_health"
  | "quick_entry"
  | "my_entries"
  | "entries_log"
  | "verification_inbox"
  | "audit_log"
  | "tailors"
  | "lots"
  | "operations"
  | "salary_engine"
  | "manager_analytics"
  | "reports";

export interface PermissionDefinition {
  sections: SectionKey[];
  canVerifyEntries: boolean;
  canRejectEntries: boolean;
  canManageRates: boolean;
  canManageTailors: boolean;
  canManageLots: boolean;
  canCloseMonth: boolean;
  canManageAdjustments: boolean;
  canAccessAllUnits: boolean;
  canManageUsers: boolean;
}

export const ROLE_PERMISSIONS: Record<Role, PermissionDefinition> = {
  main_admin: {
    sections: [
      "main_admin_overview",
      "units_management",
      "system_health",
      "quick_entry",
      "my_entries",
      "entries_log",
      "verification_inbox",
      "audit_log",
      "tailors",
      "lots",
      "operations",
      "salary_engine",
      "manager_analytics",
      "reports",
    ],
    canVerifyEntries: true,
    canRejectEntries: true,
    canManageRates: true,
    canManageTailors: true,
    canManageLots: true,
    canCloseMonth: true,
    canManageAdjustments: true,
    canAccessAllUnits: true,
    canManageUsers: true,
  },
  owner: {
    sections: [
      "quick_entry",
      "my_entries",
      "entries_log",
      "verification_inbox",
      "audit_log",
      "tailors",
      "lots",
      "operations",
      "salary_engine",
      "manager_analytics",
      "reports",
    ],
    canVerifyEntries: true,
    canRejectEntries: true,
    canManageRates: true,
    canManageTailors: true,
    canManageLots: true,
    canCloseMonth: true,
    canManageAdjustments: true,
    canAccessAllUnits: false,
    canManageUsers: false,
  },
  manager: {
    sections: [
      "quick_entry",
      "my_entries",
      "entries_log",
      "verification_inbox",
      "tailors",
      "lots",
      "operations",
      "manager_analytics",
      "reports",
    ],
    canVerifyEntries: true,
    canRejectEntries: true,
    canManageRates: true,
    canManageTailors: true,
    canManageLots: true,
    canCloseMonth: false,
    canManageAdjustments: false,
    canAccessAllUnits: false,
    canManageUsers: false,
  },
  tailor: {
    sections: ["quick_entry", "my_entries", "lots"],
    canVerifyEntries: false,
    canRejectEntries: false,
    canManageRates: false,
    canManageTailors: false,
    canManageLots: false,
    canCloseMonth: false,
    canManageAdjustments: false,
    canAccessAllUnits: false,
    canManageUsers: false,
  },
  global_user: {
    sections: ["main_admin_overview"],
    canVerifyEntries: false,
    canRejectEntries: false,
    canManageRates: false,
    canManageTailors: false,
    canManageLots: false,
    canCloseMonth: false,
    canManageAdjustments: false,
    canAccessAllUnits: false,
    canManageUsers: false,
  },
  access_auditor: {
    sections: ["audit_log"],
    canVerifyEntries: false,
    canRejectEntries: false,
    canManageRates: false,
    canManageTailors: false,
    canManageLots: false,
    canCloseMonth: false,
    canManageAdjustments: false,
    canAccessAllUnits: false,
    canManageUsers: false,
  },
};

/**
 * Checks whether a given role is allowed to access a specific dashboard section.
 */
export function canAccessSection(role: Role, section: SectionKey): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.sections.includes(section);
}

/**
 * Returns all accessible sections for a given role.
 */
export function getAvailableSections(role: Role): SectionKey[] {
  const perms = ROLE_PERMISSIONS[role];
  return perms ? perms.sections : [];
}

/**
 * Returns the default landing section for a given role.
 */
export function getDefaultSection(role: Role): SectionKey {
  switch (role) {
    case "main_admin":
      return "main_admin_overview";
    case "owner":
      return "manager_analytics";
    case "manager":
      return "verification_inbox";
    case "tailor":
      return "quick_entry";
    case "access_auditor":
      return "audit_log";
    case "global_user":
    default:
      return "quick_entry";
  }
}

/**
 * Security Assertion: Verifies if a role has full platform administrative permissions.
 * STRICT ENFORCEMENT: 'global_user' and 'access_auditor' are explicitly blocked.
 */
export function isFullAdmin(role: Role): boolean {
  return role === "main_admin";
}

/**
 * Security Assertion: Strictly blocks non-administrative roles (including Global User
 * and Access Auditor) from obtaining or inheriting administrative rights.
 */
export function isBlockedFromAdmin(role: Role): boolean {
  return role !== "main_admin";
}

/**
 * Validates role assignment to prevent privilege escalation.
 */
export function canAssignRole(actorRole: Role, targetRole: Role): boolean {
  if (actorRole !== "main_admin") {
    return false;
  }
  // Prevent arbitrary assignment of privileged roles
  if (targetRole === "main_admin") {
    return true;
  }
  return targetRole === "owner" || targetRole === "manager" || targetRole === "tailor" || targetRole === "global_user" || targetRole === "access_auditor";
}

/**
 * Role badge styling metadata.
 */
export function getRoleBadgeInfo(role: Role): { labelKey: string; bgClass: string; textClass: string; borderClass: string } {
  switch (role) {
    case "main_admin":
      return {
        labelKey: "auth.mainAdmin",
        bgClass: "bg-purple-100 dark:bg-purple-950/60",
        textClass: "text-purple-800 dark:text-purple-300",
        borderClass: "border-purple-300 dark:border-purple-800",
      };
    case "owner":
      return {
        labelKey: "auth.owner",
        bgClass: "bg-amber-100 dark:bg-amber-950/60",
        textClass: "text-amber-800 dark:text-amber-300",
        borderClass: "border-amber-300 dark:border-amber-800",
      };
    case "manager":
      return {
        labelKey: "auth.manager",
        bgClass: "bg-indigo-100 dark:bg-indigo-950/60",
        textClass: "text-indigo-800 dark:text-indigo-300",
        borderClass: "border-indigo-300 dark:border-indigo-800",
      };
    case "tailor":
      return {
        labelKey: "auth.tailor",
        bgClass: "bg-emerald-100 dark:bg-emerald-950/60",
        textClass: "text-emerald-800 dark:text-emerald-300",
        borderClass: "border-emerald-300 dark:border-emerald-800",
      };
    case "global_user":
      return {
        labelKey: "auth.globalUser",
        bgClass: "bg-cyan-100 dark:bg-cyan-950/60",
        textClass: "text-cyan-800 dark:text-cyan-300",
        borderClass: "border-cyan-300 dark:border-cyan-800",
      };
    case "access_auditor":
      return {
        labelKey: "auth.accessAuditor",
        bgClass: "bg-slate-200 dark:bg-slate-800",
        textClass: "text-slate-800 dark:text-slate-200",
        borderClass: "border-slate-300 dark:border-slate-700",
      };
  }
}
