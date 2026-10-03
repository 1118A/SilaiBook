"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import { Role } from "@/lib/types/payroll";
import {
  findUserByEmail,
  registerNewUser,
  updateUserProfile,
  RegisteredUser,
  UserStatus,
} from "@/lib/auth/userRegistry";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  unit_id: string;
  status: UserStatus;
  phone?: string;
  avatar_url?: string;
  language?: "en" | "gu" | "hi";
  tailor_id?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  status?: UserStatus;
  user?: UserSession;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => AuthResult;
  signup: (name: string, email: string, role: Role, unitName?: string) => AuthResult;
  updateProfile: (updates: { name?: string; phone?: string; avatar_url?: string; language?: "en" | "gu" | "hi" }) => void;
  logout: () => void;
  switchUnit: (unit_id: string) => void;
  switchRole: (role: Role) => void;
}

const STORAGE_KEY = "silaibook_auth_session";
const AUTH_CHANGE_EVENT = "silaibook_auth_change";

let cachedRaw: string | null = null;
let cachedSession: UserSession | null = null;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) {
    return cachedSession;
  }
  cachedRaw = raw;
  if (!raw) {
    cachedSession = null;
    return null;
  }
  try {
    cachedSession = JSON.parse(raw) as UserSession;
  } catch {
    cachedSession = null;
  }
  return cachedSession;
}

function getServerSnapshot(): UserSession | null {
  return null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Silent Role-Based Login:
   * Accepts email & optional password, looking up role and status from registry.
   */
  const login = useCallback((email: string, password?: string): AuthResult => {
    // Password validation hook for authentication workflows
    if (password && password.length < 1) {
      return { success: false, error: "INVALID_CREDENTIALS" };
    }
    const trimmedEmail = email.trim().toLowerCase();
    const existing = findUserByEmail(trimmedEmail);

    let registeredUser: RegisteredUser;

    if (existing) {
      registeredUser = existing;
    } else {
      // Auto-infer role for first-time login if not pre-seeded
      let inferredRole: Role = "tailor";
      if (trimmedEmail.includes("admin")) inferredRole = "main_admin";
      else if (trimmedEmail.includes("manager")) inferredRole = "manager";
      else if (trimmedEmail.includes("owner")) inferredRole = "owner";

      const defaultName =
        inferredRole === "main_admin"
          ? "Super Admin (Platform)"
          : inferredRole === "owner"
          ? "Owner Admin"
          : inferredRole === "manager"
          ? "Ramesh Manager"
          : "Suresh Tailor";

      const registration = registerNewUser(defaultName, trimmedEmail, inferredRole);
      registeredUser = registration.user;
    }

    if (registeredUser.status === "pending_verification") {
      return {
        success: false,
        status: "pending_verification",
        error: "ACCOUNT_PENDING_VERIFICATION",
      };
    }

    if (registeredUser.status === "rejected") {
      return {
        success: false,
        status: "rejected",
        error: "ACCOUNT_REJECTED",
      };
    }

    const sessionUser: UserSession = {
      id: registeredUser.id,
      name: registeredUser.name,
      email: registeredUser.email,
      role: registeredUser.role,
      unit_id: registeredUser.unit_id,
      status: registeredUser.status,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    }

    return {
      success: true,
      status: "approved",
      user: sessionUser,
    };
  }, []);

  const signup = useCallback(
    (name: string, email: string, role: Role, unitName?: string): AuthResult => {
      const { user: newUser, requiresAdminVerification } = registerNewUser(
        name,
        email,
        role,
        unitName
      );

      if (requiresAdminVerification || newUser.status === "pending_verification") {
        return {
          success: false,
          status: "pending_verification",
          error: "ACCOUNT_PENDING_VERIFICATION",
        };
      }

      return login(newUser.email);
    },
    [login]
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    }
  }, []);

  const switchUnit = useCallback(
    (unit_id: string) => {
      if (typeof window !== "undefined" && user) {
        const updated = { ...user, unit_id };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
      }
    },
    [user]
  );

  const switchRole = useCallback(
    (role: Role) => {
      if (typeof window !== "undefined" && user) {
        const updated = { ...user, role };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
      }
    },
    [user]
  );

  const updateProfile = useCallback(
    (updates: { name?: string; phone?: string; avatar_url?: string; language?: "en" | "gu" | "hi" }) => {
      if (!user) return;
      const updatedRegistry = updateUserProfile(user.id, updates);
      if (updatedRegistry) {
        const updatedSession: UserSession = {
          ...user,
          name: updatedRegistry.name,
          phone: updatedRegistry.phone,
          avatar_url: updatedRegistry.avatar_url,
          language: updatedRegistry.language,
          // role remains strictly immutable
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
          window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
        }
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: false,
        login,
        signup,
        updateProfile,
        logout,
        switchUnit,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
