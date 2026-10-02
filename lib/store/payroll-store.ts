"use client";

import { useState } from "react";
import { Tailor, Lot, Operation, PieceEntry, LotProgress } from "@/lib/types/payroll";
import { multiplyPaise } from "@/lib/money";

const UNIT_ID = "a0000000-0000-0000-0000-000000000001";

const initialTailors: Tailor[] = [
  { id: "b0000000-0000-0000-0000-000000000001", unit_id: UNIT_ID, name: "Ramesh Patel", phone: "9876500001", active: true, created_at: "2026-09-01T00:00:00Z" },
  { id: "b0000000-0000-0000-0000-000000000002", unit_id: UNIT_ID, name: "Suresh Kumar", phone: "9876500002", active: true, created_at: "2026-09-01T00:00:00Z" },
  { id: "b0000000-0000-0000-0000-000000000003", unit_id: UNIT_ID, name: "Meena Devi", phone: "9876500003", active: true, created_at: "2026-09-01T00:00:00Z" },
  { id: "b0000000-0000-0000-0000-000000000004", unit_id: UNIT_ID, name: "Kamlesh Shah", phone: "9876500004", active: true, created_at: "2026-09-01T00:00:00Z" },
  { id: "b0000000-0000-0000-0000-000000000005", unit_id: UNIT_ID, name: "Priya Sharma", phone: "9876500005", active: true, created_at: "2026-09-01T00:00:00Z" },
  { id: "b0000000-0000-0000-0000-000000000006", unit_id: UNIT_ID, name: "Vikram Singh", phone: "9876500006", active: true, created_at: "2026-09-01T00:00:00Z" },
  { id: "b0000000-0000-0000-0000-000000000007", unit_id: UNIT_ID, name: "Geeta Ben", phone: "9876500007", active: true, created_at: "2026-09-01T00:00:00Z" },
  { id: "b0000000-0000-0000-0000-000000000008", unit_id: UNIT_ID, name: "Arjun Rathod", phone: "9876500008", active: true, created_at: "2026-09-01T00:00:00Z" },
];

const initialLots: Lot[] = [
  { id: "c0000000-0000-0000-0000-000000000001", unit_id: UNIT_ID, lot_no: "LOT-2026-001", style: "Men Shirt Cotton", total_pieces: 500, status: "active", created_at: "2026-09-01T00:00:00Z" },
  { id: "c0000000-0000-0000-0000-000000000002", unit_id: UNIT_ID, lot_no: "LOT-2026-002", style: "Ladies Kurti Rayon", total_pieces: 300, status: "active", created_at: "2026-09-01T00:00:00Z" },
  { id: "c0000000-0000-0000-0000-000000000003", unit_id: UNIT_ID, lot_no: "LOT-2026-003", style: "Kids Pajama Set", total_pieces: 200, status: "active", created_at: "2026-09-01T00:00:00Z" },
];

const initialOperations: Operation[] = [
  { id: "d0000000-0000-0000-0000-000000000001", unit_id: UNIT_ID, name: "Cutting", default_rate_paise: 300, created_at: "2026-09-01T00:00:00Z" },
  { id: "d0000000-0000-0000-0000-000000000002", unit_id: UNIT_ID, name: "Stitching", default_rate_paise: 500, created_at: "2026-09-01T00:00:00Z" },
  { id: "d0000000-0000-0000-0000-000000000003", unit_id: UNIT_ID, name: "Hemming", default_rate_paise: 200, created_at: "2026-09-01T00:00:00Z" },
  { id: "d0000000-0000-0000-0000-000000000004", unit_id: UNIT_ID, name: "Button Attach", default_rate_paise: 150, created_at: "2026-09-01T00:00:00Z" },
  { id: "d0000000-0000-0000-0000-000000000005", unit_id: UNIT_ID, name: "Quality Check", default_rate_paise: 100, created_at: "2026-09-01T00:00:00Z" },
];

const initialEntries: PieceEntry[] = [
  { id: "e101", unit_id: UNIT_ID, tailor_id: "b0000000-0000-0000-0000-000000000001", lot_id: "c0000000-0000-0000-0000-000000000001", operation_id: "d0000000-0000-0000-0000-000000000002", work_date: "2026-09-01", pieces: 25, rate_paise: 500, status: "verified", created_at: "2026-09-01T10:00:00Z" },
  { id: "e102", unit_id: UNIT_ID, tailor_id: "b0000000-0000-0000-0000-000000000001", lot_id: "c0000000-0000-0000-0000-000000000001", operation_id: "d0000000-0000-0000-0000-000000000002", work_date: "2026-09-02", pieces: 30, rate_paise: 500, status: "verified", created_at: "2026-09-02T10:00:00Z" },
  { id: "e103", unit_id: UNIT_ID, tailor_id: "b0000000-0000-0000-0000-000000000001", lot_id: "c0000000-0000-0000-0000-000000000001", operation_id: "d0000000-0000-0000-0000-000000000002", work_date: new Date().toISOString().split("T")[0], pieces: 35, rate_paise: 3300, status: "pending", created_at: new Date().toISOString() },
];

export function usePayrollStore() {
  const [tailors, setTailors] = useState<Tailor[]>(initialTailors);
  const [lots, setLots] = useState<Lot[]>(initialLots);
  const [operations, setOperations] = useState<Operation[]>(initialOperations);
  const [entries, setEntries] = useState<PieceEntry[]>(initialEntries);
  const [lastEntry, setLastEntry] = useState<Partial<PieceEntry> | null>(null);

  // Helper for lot progress calculations
  const getLotProgress = (lotId: string): LotProgress | null => {
    const lot = lots.find((l) => l.id === lotId);
    if (!lot) return null;

    const lotEntries = entries.filter((e) => e.lot_id === lotId && e.status !== "rejected");
    const done_pieces = lotEntries.reduce((acc, curr) => acc + curr.pieces, 0);
    const remaining_pieces = Math.max(0, lot.total_pieces - done_pieces);
    const percentage = lot.total_pieces > 0 ? Math.min(100, Math.round((done_pieces / lot.total_pieces) * 100)) : 0;

    return { lot, done_pieces, remaining_pieces, percentage };
  };

  const addEntry = (newEntry: Omit<PieceEntry, "id" | "unit_id" | "status" | "created_at"> & { status?: PieceEntry["status"] }) => {
    const entry: PieceEntry = {
      ...newEntry,
      id: "e_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      unit_id: UNIT_ID,
      status: newEntry.status || "pending",
      created_at: new Date().toISOString(),
    };

    setEntries((prev) => [entry, ...prev]);
    setLastEntry(entry);
    return entry;
  };

  const addLot = (lotData: { lot_no: string; style: string; total_pieces: number }) => {
    const newLot: Lot = {
      id: "c_" + Date.now(),
      unit_id: UNIT_ID,
      lot_no: lotData.lot_no,
      style: lotData.style,
      total_pieces: lotData.total_pieces,
      status: "active",
      created_at: new Date().toISOString(),
    };
    setLots((prev) => [newLot, ...prev]);
    return newLot;
  };

  const toggleLotStatus = (lotId: string, status: Lot["status"]) => {
    setLots((prev) => prev.map((l) => (l.id === lotId ? { ...l, status } : l)));
  };

  const addTailor = (tailorData: { name: string; phone?: string }) => {
    const newTailor: Tailor = {
      id: "b_" + Date.now(),
      unit_id: UNIT_ID,
      name: tailorData.name,
      phone: tailorData.phone,
      active: true,
      created_at: new Date().toISOString(),
    };
    setTailors((prev) => [...prev, newTailor]);
    return newTailor;
  };

  const toggleTailorActive = (tailorId: string) => {
    setTailors((prev) => prev.map((t) => (t.id === tailorId ? { ...t, active: !t.active } : t)));
  };

  const addOperation = (opData: { name: string; default_rate_paise: number }) => {
    const newOp: Operation = {
      id: "d_" + Date.now(),
      unit_id: UNIT_ID,
      name: opData.name,
      default_rate_paise: opData.default_rate_paise,
      created_at: new Date().toISOString(),
    };
    setOperations((prev) => [...prev, newOp]);
    return newOp;
  };

  return {
    unitId: UNIT_ID,
    tailors,
    lots,
    operations,
    entries,
    lastEntry,
    getLotProgress,
    addEntry,
    addLot,
    toggleLotStatus,
    addTailor,
    toggleTailorActive,
    addOperation,
  };
}

export function computeEntryTotalPaise(pieces: number, rate_paise: number): number {
  return multiplyPaise(rate_paise, pieces);
}
