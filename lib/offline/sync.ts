import { PieceEntry } from "@/lib/types/payroll";
import { getPendingOfflineEntries, removePendingOfflineEntry } from "./db";

export interface SyncResult {
  syncedCount: number;
  duplicateCount: number;
  conflictCount: number;
  errors: string[];
}

export function generateIdempotencyKey(data: {
  tailor_id: string;
  lot_id: string;
  operation_id: string;
  work_date: string;
  pieces: number;
}): string {
  const nonce = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
  return `idemp_${data.tailor_id}_${data.lot_id}_${data.operation_id}_${data.work_date}_${data.pieces}_${nonce}`;
}

/**
 * Checks if a proposed edit to an existing entry violates the conflict rule.
 * Rule: Server wins on verified rows; edits to verified rows are refused.
 */
export function checkVerifiedConflict(targetEntry: PieceEntry | undefined): { allowed: boolean; message?: string } {
  if (targetEntry && targetEntry.status === "verified") {
    return {
      allowed: false,
      message: "Edit refused: Server status is verified. Verified entries cannot be modified by client edits.",
    };
  }
  return { allowed: true };
}

/**
 * Synchronizes offline pending entries stored in IndexedDB with the main payroll store/state.
 */
export async function syncOfflineEntries(
  serverEntries: PieceEntry[],
  addEntryToStore: (entry: Omit<PieceEntry, "id" | "unit_id" | "status" | "created_at"> & { status?: PieceEntry["status"] }) => PieceEntry
): Promise<SyncResult> {
  const pending = await getPendingOfflineEntries();
  const result: SyncResult = {
    syncedCount: 0,
    duplicateCount: 0,
    conflictCount: 0,
    errors: [],
  };

  const existingKeys = new Set(
    serverEntries
      .map((e) => (e as PieceEntry & { idempotencyKey?: string }).idempotencyKey)
      .filter(Boolean)
  );

  for (const item of pending) {
    // 1. Deduplication check using idempotency key
    if (existingKeys.has(item.idempotencyKey)) {
      result.duplicateCount++;
      await removePendingOfflineEntry(item.idempotencyKey);
      continue;
    }

    // 2. Conflict check: Check if matching target entry is already verified on server
    const existingMatch = serverEntries.find(
      (e) => e.tailor_id === item.tailor_id && e.lot_id === item.lot_id && e.operation_id === item.operation_id && e.work_date === item.work_date
    );

    const conflictCheck = checkVerifiedConflict(existingMatch);
    if (!conflictCheck.allowed) {
      result.conflictCount++;
      result.errors.push(conflictCheck.message || "Conflict on verified entry.");
      await removePendingOfflineEntry(item.idempotencyKey);
      continue;
    }

    // 3. Add valid entry to store/server
    try {
      const created = addEntryToStore({
        tailor_id: item.tailor_id,
        lot_id: item.lot_id,
        operation_id: item.operation_id,
        work_date: item.work_date,
        pieces: item.pieces,
        rate_paise: item.rate_paise,
        status: "pending",
      });

      // Attach idempotencyKey to prevent duplicate syncs
      (created as PieceEntry & { idempotencyKey?: string }).idempotencyKey = item.idempotencyKey;
      existingKeys.add(item.idempotencyKey);

      result.syncedCount++;
      await removePendingOfflineEntry(item.idempotencyKey);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      result.errors.push(`Failed to sync entry ${item.idempotencyKey}: ${errMsg}`);
    }
  }

  return result;
}
