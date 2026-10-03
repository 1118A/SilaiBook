"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { PieceEntry } from "@/lib/types/payroll";
import {
  savePendingOfflineEntry,
  getPendingOfflineEntries,
  OfflinePendingEntry,
} from "./db";
import { syncOfflineEntries, generateIdempotencyKey, SyncResult } from "./sync";

function subscribeOnlineStatus(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

function getOnlineServerSnapshot() {
  return true;
}

export function useOfflineSync(
  entries: PieceEntry[],
  addEntryToStore: (entry: Omit<PieceEntry, "id" | "unit_id" | "status" | "created_at"> & { status?: PieceEntry["status"] }) => PieceEntry
) {
  const isOnline = useSyncExternalStore(subscribeOnlineStatus, getOnlineSnapshot, getOnlineServerSnapshot);

  const [pendingOfflineItems, setPendingOfflineItems] = useState<OfflinePendingEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  const refreshPendingQueue = useCallback(async () => {
    const items = await getPendingOfflineEntries();
    setPendingOfflineItems(items);
  }, []);

  const triggerSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const res = await syncOfflineEntries(entries, addEntryToStore);
      setLastSyncResult(res);
      const items = await getPendingOfflineEntries();
      setPendingOfflineItems(items);
    } catch (err) {
      console.error("Offline sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [entries, addEntryToStore, isSyncing]);

  useEffect(() => {
    let isMounted = true;
    getPendingOfflineEntries().then((items) => {
      if (isMounted) {
        setPendingOfflineItems(items);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const queueOfflineEntry = async (data: {
    tailor_id: string;
    lot_id: string;
    operation_id: string;
    work_date: string;
    pieces: number;
    rate_paise: number;
  }) => {
    const idempotencyKey = generateIdempotencyKey(data);
    const offlineItem: OfflinePendingEntry = {
      idempotencyKey,
      ...data,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    if (typeof navigator !== "undefined" && navigator.onLine) {
      const created = addEntryToStore({
        ...data,
        status: "pending",
      });
      (created as PieceEntry & { idempotencyKey?: string }).idempotencyKey = idempotencyKey;
    } else {
      await savePendingOfflineEntry(offlineItem);
      await refreshPendingQueue();
    }

    return offlineItem;
  };

  return {
    isOnline,
    pendingOfflineItems,
    pendingCount: pendingOfflineItems.length,
    isSyncing,
    lastSyncResult,
    triggerSync,
    queueOfflineEntry,
    refreshPendingQueue,
  };
}
