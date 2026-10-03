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
    default:
      return "quick_entry";
  }
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
  }
}
