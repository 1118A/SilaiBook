export type Role = "owner" | "manager" | "tailor";
export type EntryStatus = "pending" | "verified" | "rejected";
export type LotStatus = "active" | "completed" | "cancelled";
export type AdjustmentType = "bonus" | "advance" | "deduction";

export interface GarmentUnit {
  id: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  unit_id: string;
  role: Role;
  full_name: string;
  phone?: string;
  language: "en" | "gu" | "hi";
  created_at: string;
}

export interface Tailor {
  id: string;
  unit_id: string;
  name: string;
  phone?: string;
  active: boolean;
  profile_id?: string;
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

export interface PieceEntry {
  id: string;
  unit_id: string;
  tailor_id: string;
  lot_id: string;
  operation_id: string;
  work_date: string; // YYYY-MM-DD
  pieces: number;
  rate_paise: number; // rate snapshot at time of entry (in paise)
  status: EntryStatus;
  entered_by?: string;
  verified_by?: string;
  verified_at?: string;
  note?: string;
  created_at: string;
}

export interface Adjustment {
  id: string;
  unit_id: string;
  tailor_id: string;
  month: string; // YYYY-MM-01
  type: AdjustmentType;
  amount_paise: number;
  note?: string;
  created_by?: string;
  created_at: string;
}

export interface LotProgress {
  lot: Lot;
  done_pieces: number;
  remaining_pieces: number;
  percentage: number;
}
