# T05 — Workers, operations and effective-dated rates

**Day:** 2 · **Time box:** 3 h · **Depends on:** T02, T03, T04
**Attach:** `CONTEXT.md`, `DESIGN_BRIEF.md`

## Goal
The manager can set up the unit: tailors, operations/styles, and rates that change over time without rewriting history.

## Prompt
~~~text
Read CLAUDE.md and DESIGN_BRIEF.md. Then do task T05. Plan first.

Build manager screens under /manager:

1. Workers
   - List with search, active/inactive filter, big "Add tailor" button.
   - Add/edit: name, optional phone, auto-generated short worker code (unique per unit, easy to read aloud). Show the code prominently.
   - "Set / reset PIN" action using the T03 function; show the PIN once with a copy/share button and a warning.
   - Deactivate instead of delete. Inactive workers keep their history but are hidden from entry pickers.
2. Styles and operations
   - Manage styles (e.g. "Men's shirt") and operations (e.g. "Collar attach", "Full stitch"), each operation can belong to a style.
3. Rates (effective-dated)
   - For each operation: current rate and a history table. "Change rate" asks for new rate and "effective from" date. A new rate NEVER edits older rows; it inserts a rate_history row. Prevent duplicates for the same date. Show a clear note: "Past entries keep their old rate."
   - Show a small preview: "From 1 Oct: ₹33".
4. Use TanStack Query with optimistic updates only where safe; show errors in the user's language.
5. Zod forms; rupee input accepts "33", "33.5", "33.50" and converts to paise via lib/money.ts; reject more than 2 decimals.
6. Use only components from the design system; tickets for list items on mobile, tables only on wide screens.
7. Tests: rate lookup for dates before/after/at a change; duplicate worker code prevention; deactivated worker hidden from pickers; RLS still blocks tailors from these screens.

Include empty states with a friendly first-run checklist: "1) Add tailors 2) Add operations 3) Set rates 4) Enter first ticket".
~~~

## Acceptance checklist
- [ ] Manager can add 5 tailors, 3 operations, and set rates
- [ ] Changing a rate adds history and does not alter older rate rows
- [ ] PIN shown once; reset works; tailor can log in with it (T03)
- [ ] Rupee input handles decimals correctly; no float math anywhere
- [ ] Works on a phone in all three languages; first-run checklist visible

## Verify yourself
Change an operation's rate effective tomorrow; confirm `rate_for(op, today)` is still the old rate and `rate_for(op, tomorrow)` is the new one.

## Commit
`feat(manager): workers, operations and effective-dated rates`
