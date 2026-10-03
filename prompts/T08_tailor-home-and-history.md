# T08 — Tailor home, history and manager dashboard

**Day:** 4 · **Time box:** 3 h · **Depends on:** T04, T06, T07
**Attach:** `CONTEXT.md`, `DESIGN_BRIEF.md` (see the "Tailor home" and "Manager" wireframes)

## Goal
The tailor sees "how much have I earned" at a glance (the reason they will use the app daily). The manager sees what needs attention today.

## Prompt
~~~text
Read CLAUDE.md and DESIGN_BRIEF.md (wireframes in section 6). Then do task T08. Plan first.

Tailor app
1. /tailor home: greeting in the selected language, month-to-date earnings in a very large number with the TapeProgress below it, today's tickets as TicketCards with StatusChips, and a prominent "Please confirm" card when something is waiting.
2. Earnings rule: month-to-date = sum of approved + confirmed entries; show pending amount separately as "waiting for confirmation: ₹X" so nothing is hidden.
3. /tailor/history: by day for the current month (with month switcher). Day detail shows each line and its status. Closed months show the salary slip.
4. Works offline from cached data; show "Last updated ..." when offline.
5. Language switcher always reachable (top right), remembered.

Manager dashboard
1. /manager home: today's tickets and pieces, pending approvals count, disputes count, month-to-date payroll estimate (approved + confirmed), unsynced warning if any.
2. Quick actions: "Add ticket", "Approvals", "Month-end". First-run checklist from T05 until complete.
3. Estimates must be computed with the same functions as month-end payroll (shared code in lib/payroll.ts, tested), so the numbers always agree.

Quality
- Skeletons while loading; friendly empty states; error states with retry.
- Use TanStack Query with sensible stale times; never block render on network.
- Unit tests for lib/payroll.ts (month-to-date vs pending split, rate change mid-month). Playwright test for tailor home at 360x640 in Gujarati.
~~~

## Acceptance checklist
- [ ] Tailor sees correct month total that matches the manager's view
- [ ] Pending amount is shown separately
- [ ] Offline view works with cached data
- [ ] Layout is clean at 360×640 in all three languages; large text doesn't break it

## Commit
`feat(home): tailor earnings home, history and manager dashboard`
