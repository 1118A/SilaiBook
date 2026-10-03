# T07 — Verification: the Yes / No flow

**Day:** 4 · **Time box:** 4 h · **Depends on:** T02, T03, T06
**Attach:** `CONTEXT.md`, `DESIGN_BRIEF.md`

## Goal
The product's core promise: one side enters, the other confirms with a single tap, and only confirmed work counts toward pay.

## Prompt
~~~text
Read CLAUDE.md and DESIGN_BRIEF.md. Then do task T07. Plan first.

1. Manager approvals queue (/manager/approvals): shows pending entries made by tailors, grouped by tailor and day, as TicketCards. Actions: Approve, Reject (with reason chips plus optional note), and "Approve all for this tailor/day" with a confirmation that shows the total pieces and rupees. Show counts in the nav as a badge.
2. Tailor day-confirmation (/tailor/confirm): for each day with pending manager-entered entries, one card: date, each line (operation, qty, rate, amount), total pieces and rupees, and two huge buttons: green Yes (confirm) and red No (dispute). Yes calls confirm_day(...,'confirmed'). No opens a bottom sheet to pick a reason (wrong quantity, wrong operation, wrong rate, missing entry, other) with an optional short note, then calls confirm_day(...,'disputed').
3. Dispute handling for the manager (/manager/disputes): see the tailor's reason, edit the entry (qty/operation) or add a missing entry, which sets status back to pending so the tailor can confirm again. Keep the history visible (who changed what, when) from audit_log.
4. Tailors may also enter their own pieces (/tailor/add) when the unit enables it (a unit setting tailor_can_enter, default off). These appear in the manager queue as pending.
5. All decisions go through the RPCs from T02 (decide_entry, confirm_day). Handle offline: queue the decision locally and sync (reuse the T06 engine; decisions are idempotent). Show "Waiting to send" until synced.
6. StatusChip everywhere (icon + word). The Yes/No buttons must be usable one-handed on a 360px-wide screen and clear without reading (icon + colour + word in the user's language).
7. In-app notification dots only (no push yet): manager sees pending count; tailor sees "Please confirm" when something is waiting.
8. Tests: every legal transition works; every illegal transition is refused by the database (tailor approving their own entry, manager confirming on behalf of a tailor, deciding in a locked month, deciding twice); Playwright two-user scenario: manager enters, tailor confirms Yes; manager enters, tailor says No, manager fixes, tailor confirms.

Explain how the tailor's Yes can't be forged by the manager (it can't: the RPC checks the caller's role).
~~~

## Acceptance checklist
- [ ] Two phones: manager enters -> tailor taps Yes -> status `confirmed`
- [ ] No -> reason -> manager fixes -> tailor confirms again
- [ ] Illegal transitions fail at the database level (tests prove it)
- [ ] Works offline with "Waiting to send"
- [ ] A first-time tailor understands the screen with no explanation (test it)

## Commit
`feat(verification): approvals queue, day confirmation and disputes`
