# 02 — Database, Auth, Row Level Security
**Context:** Supabase project created. Multi-unit SaaS: each garment unit's data is isolated.
**Task:** Write SQL migrations and auth flow.
**Tables:** `units`, `profiles` (user_id, unit_id, role: owner|manager|tailor, language), `tailors` (unit_id, name, phone, active, optional profile link), `lots` (unit_id, lot_no, style, total_pieces, status), `operations` (unit_id, name, default_rate_paise), `entries` (unit_id, tailor_id, lot_id, operation_id, work_date, pieces, rate_paise, status pending|verified|rejected, entered_by, verified_by, verified_at, note), `adjustments` (unit_id, tailor_id, month, type bonus|advance|deduction, amount_paise, note), `month_closures` (unit_id, month, closed_by, closed_at), `audit_log`.
**Requirements:**
- Indexes on (unit_id, work_date), (tailor_id, work_date), (lot_id).
- RLS on every table: users only access rows of their own `unit_id`; tailors only read/insert their own entries and cannot set `verified`.
- Check constraints: pieces > 0, rate_paise >= 0.
- Signup creates a unit + owner profile. Manager can add tailors; optional phone login for tailors.
- Seed script with 1 unit, 8 tailors, 3 lots, sample entries.
**Done when:** a tailor account cannot read another unit's or another tailor's data (write a test that proves it); seed loads.
