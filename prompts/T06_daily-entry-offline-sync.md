# T06 — Daily entry with offline queue and sync

**Day:** 3 · **Time box:** 5–6 h (hardest task; protect this day) · **Depends on:** T02, T04, T05
**Attach:** `CONTEXT.md`, `DESIGN_BRIEF.md`, system design section 5 (offline sync)

## Goal
The manager can record a ticket in seconds, even with no network, and it reaches the server exactly once.

## Prompt
~~~text
Read CLAUDE.md, DESIGN_BRIEF.md and the offline sync section (5) of the system design. Then do task T06. Plan first, and list the failure cases you will handle before coding.

1. Local database (Dexie): tables for entries (with sync_state: queued | syncing | synced | failed, attempts, last_error), cached workers, operations, rate_history, lots, and sync_meta (last_pulled_at per table). Validate everything read from IndexedDB with Zod.
2. Quick-entry screen (/manager/entry): tailor picker (recent first), operation picker, date (defaults to today, can't pick a locked month), PieceCounter + NumberPad, rate shown from the cached rate_history for that date, running total for the day. "Save ticket" writes to IndexedDB immediately with a client-generated UUID (crypto.randomUUID) and rate_paise_snapshot taken from the cached rate for work_date. Remember the last tailor/operation/quantity as defaults. The whole flow should take 3 taps for a repeat entry.
3. Sync engine in src/lib/sync:
   - push: send queued entries in batches with insert ... on conflict (id) do nothing (upsert-ignore) so repeats never duplicate; on success mark synced; on a permanent error (validation, locked month, RLS) mark failed with the message; on network error keep queued with exponential backoff.
   - pull: fetch changed rows since last_pulled_at (entries status changes, workers, operations, rates, lots) and merge. Server wins for status; never overwrite a queued local entry's qty.
   - triggers: app start, 'online' event, visibility change, after each save, a "Sync now" button, and Background Sync where supported (feature-detect; do not require it).
   - mutex so only one sync runs at a time; safe if the tab closes mid-sync.
4. SyncBadge states in the UI per entry and a global indicator: "Saved on phone" / "Synced" / "Needs attention (tap to see why)". A "Needs attention" screen lists failed entries with the reason and actions (edit and retry / discard).
5. Rate-mismatch rule: if the server's rate_for(operation, date) differs from the snapshot on a synced entry, flag it for the manager instead of silently changing it.
6. Entry list for today/this week with edit (only while pending and month not locked) and delete (only while pending and not yet decided; soft delete via status or a deleted flag - propose the simplest safe approach).
7. Tests (Vitest with fake-indexeddb + mocked network):
   - same entry pushed twice -> one row
   - offline save -> reconnect -> synced exactly once
   - app killed after server insert but before local mark -> next sync is still safe
   - rate changed while offline -> flagged, not rewritten
   - locked month -> marked failed with a clear message
   - flaky network (random failures) -> eventually consistent
   Playwright: go offline, enter 3 tickets, go online, assert 3 rows on the server.

Do not use floats for money. Keep UI strings in i18n. Report anything you could not make reliable.
~~~

## Acceptance checklist
- [ ] Repeat entry in 3 taps; works with airplane mode
- [ ] Server shows each entry exactly once after sync, even if you kill the app mid-sync
- [ ] Failed entries are visible with reasons and recoverable
- [ ] Rate snapshot comes from the date of work, not today
- [ ] All sync tests pass, including flaky-network test
- [ ] Tested on a real phone with real airplane mode

## Verify yourself
Enter 5 tickets offline, close the browser, reopen online, and watch the badges. Change a rate on another device before syncing and confirm the mismatch flag.

## Commit
`feat(entry): offline-first ticket entry and idempotent sync`
