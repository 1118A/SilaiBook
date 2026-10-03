# T02 — Database schema, RLS, SQL functions, tests

**Day:** 1 · **Time box:** 3–4 h · **Depends on:** T01
**Attach:** `CONTEXT.md`, and `01-system-design-and-7-day-roadmap.md` (sections 3 and 4 contain the schema and RLS pattern)

## Goal
A secure multi-tenant database where the rules (status machine, month lock, rate snapshot) are enforced by Postgres itself.

## Prompt
~~~text
Read CLAUDE.md and the attached system design file (sections 3 and 4). Then do task T02.

Plan first, then implement as Supabase migrations in app/supabase/migrations (one file per concern, timestamped).

1. Tables, enums, indexes and constraints exactly as in the system design (units, profiles, workers, styles, operations, rate_history, lots, entries, adjustments, payroll_runs, payroll_lines, audit_log). Improve them where you see a problem, and tell me what you changed and why.
2. Helper functions my_unit() and my_role() (SECURITY DEFINER with a fixed search_path, and they must not trust any user-editable metadata).
3. RLS enabled on EVERY table. Write policies as a matrix and put the matrix in a comment at the top of the migration:
   - manager: full access inside their unit
   - tailor: select only their own worker's entries, adjustments, payroll lines; insert their own entries only with status 'pending'; cannot update qty, rate or amounts; cannot read other tailors or other units
   - nobody can delete entries, payroll_runs or payroll_lines (use status changes)
4. Triggers:
   - entries: reject any insert/update/delete when the month of work_date is locked (a payroll_runs row exists for that unit+month)
   - entries: validate that rate_paise_snapshot > 0 and operation/worker belong to the same unit as the entry
   - audit_log: write a row for status changes, month close, PIN reset
5. SQL functions (RPC), each checking auth.uid(), role and unit inside:
   - signup_manager(unit_name text, manager_name text, language text) -> creates unit + profile in one transaction
   - rate_for(operation uuid, on_date date) -> integer paise (latest rate_history with effective_from <= date)
   - decide_entry(entry uuid, decision text, note text) -> manager: approved/rejected for tailor-entered; tailor: confirmed/disputed for manager-entered; refuse otherwise; refuse if month locked
   - confirm_day(worker uuid, on_date date, decision text, note text) -> applies decide_entry to all pending entries of that worker/day entered by the manager
   - close_month(month date) -> manager only; refuse if any pending/disputed entries remain unless a flag force_exclude_pending = true is passed (then those entries are excluded and listed in the result); builds payroll_runs and payroll_lines from approved/confirmed entries plus adjustments; one transaction
   - lot_progress(lot uuid) -> pieces done vs total, by operation, with labour cost
6. Tests with pgTAP (supabase test db): create two units, two tailors each, one manager each. Prove:
   - tailor A cannot select/insert/update tailor B's entries; unit 1 manager cannot see unit 2 data
   - tailor cannot change qty or rate on an existing entry
   - locked-month edits fail; decide_entry rules hold; confirm_day only touches that worker/day
   - close_month produces exactly the expected totals for a fixture (include a mid-month rate change)
7. Generate TypeScript types (supabase gen types) into src/lib/database.types.ts and add an npm script db:types.
8. A seed script (supabase/seed.sql) for local/dev: one demo unit, 1 manager, 5 tailors, 3 operations with rates, a few days of entries.

Do not use the service-role key anywhere in client code. Summarize security assumptions at the end.
~~~

## Acceptance checklist
- [ ] Migrations apply cleanly to a fresh database
- [ ] RLS enabled on all tables (`select relname from pg_class where relrowsecurity` lists them all)
- [ ] pgTAP tests pass, including the cross-tenant and cross-tailor attempts
- [ ] Month-lock trigger blocks edits after close
- [ ] Types generated and committed
- [ ] You read every policy and SECURITY DEFINER function yourself

## Verify yourself
1. In the Supabase SQL editor, impersonate a tailor (use two test accounts) and try to select another tailor's entries. Expect zero rows.
2. Call `close_month` on the seed data and compare gross for one tailor with a hand calculation (qty × rate).

## Commit
`feat(db): multi-tenant schema, RLS, rpc functions and tests`
