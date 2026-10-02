/**
 * Database type definitions for Supabase.
 * These match the schema in supabase/migrations/001_initial_schema.sql.
 *
 * In production, generate these automatically with:
 *   npx supabase gen types typescript --local > lib/supabase/database.types.ts
 */

export type UserRole = "owner" | "manager" | "tailor";
export type Language = "en" | "gu" | "hi";
export type EntryStatus = "pending" | "verified" | "rejected";
export type LotStatus = "active" | "completed" | "cancelled";
export type AdjustmentType = "bonus" | "advance" | "deduction";

export interface Unit {
  id: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  unit_id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  language: Language;
  created_at: string;
}

export interface Tailor {
  id: string;
  unit_id: string;
  name: string;
  phone: string | null;
  active: boolean;
  profile_id: string | null;
  created_at: string;
}

export interface Lot {
  id: string;
  unit_id: string;
  lot_no: string;
  style: string;
  total_pieces: number;
  status: LotStatus;
  created_at: string;
}

export interface Operation {
  id: string;
  unit_id: string;
  name: string;
  default_rate_paise: number;
  created_at: string;
}

export interface Entry {
  id: string;
  unit_id: string;
  tailor_id: string;
  lot_id: string;
  operation_id: string;
  work_date: string;
  pieces: number;
  rate_paise: number;
  status: EntryStatus;
  entered_by: string | null;
  verified_by: string | null;
  verified_at: string | null;
  note: string | null;
  created_at: string;
}

export interface Adjustment {
  id: string;
  unit_id: string;
  tailor_id: string;
  month: string;
  type: AdjustmentType;
  amount_paise: number;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface MonthClosure {
  id: string;
  unit_id: string;
  month: string;
  closed_by: string;
  closed_at: string;
}

export interface AuditLog {
  id: string;
  unit_id: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Supabase Database type map (for typed client usage).
 */
export interface Database {
  public: {
    Tables: {
      units: {
        Row: Unit;
        Insert: Omit<Unit, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Unit, "id">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at"> & { id?: string; created_at?: string; full_name?: string; language?: Language };
        Update: Partial<Omit<Profile, "id" | "user_id">>;
      };
      tailors: {
        Row: Tailor;
        Insert: Omit<Tailor, "id" | "created_at" | "active"> & { id?: string; created_at?: string; active?: boolean };
        Update: Partial<Omit<Tailor, "id">>;
      };
      lots: {
        Row: Lot;
        Insert: Omit<Lot, "id" | "created_at" | "status" | "total_pieces" | "style"> & { id?: string; created_at?: string; status?: LotStatus; total_pieces?: number; style?: string };
        Update: Partial<Omit<Lot, "id">>;
      };
      operations: {
        Row: Operation;
        Insert: Omit<Operation, "id" | "created_at" | "default_rate_paise"> & { id?: string; created_at?: string; default_rate_paise?: number };
        Update: Partial<Omit<Operation, "id">>;
      };
      entries: {
        Row: Entry;
        Insert: Omit<Entry, "id" | "created_at" | "status"> & { id?: string; created_at?: string; status?: EntryStatus };
        Update: Partial<Omit<Entry, "id">>;
      };
      adjustments: {
        Row: Adjustment;
        Insert: Omit<Adjustment, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Adjustment, "id">>;
      };
      month_closures: {
        Row: MonthClosure;
        Insert: Omit<MonthClosure, "id" | "closed_at"> & { id?: string; closed_at?: string };
        Update: Partial<Omit<MonthClosure, "id">>;
      };
      audit_log: {
        Row: AuditLog;
        Insert: Omit<AuditLog, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<AuditLog, "id">>;
      };
    };
    Functions: {
      get_user_unit_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      get_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
      get_user_tailor_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      handle_new_signup: {
        Args: {
          unit_name: string;
          owner_name: string;
          owner_phone?: string;
          owner_language?: string;
        };
        Returns: { unit_id: string; profile_id: string };
      };
    };
  };
}
