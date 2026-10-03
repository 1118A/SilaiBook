# T10 — Lots and manager analytics

**Day:** 6 · **Time box:** 4 h · **Depends on:** T02, T06, T09
**Attach:** `CONTEXT.md`, `DESIGN_BRIEF.md`

## Goal
Managers see how each tailor performs and how each lot is progressing, in screens that are quick to read.

## Prompt
~~~text
Read CLAUDE.md and DESIGN_BRIEF.md. Then do task T10. Plan first. Keep the scope small: two excellent screens beat six mediocre ones.

1. Lots (/manager/lots): create/edit a lot (name, style, total pieces, target date, status). In the entry screen (T06) allow choosing a lot (optional). Lot detail uses the lot_progress RPC: pieces done vs total per operation (progress bars styled as TapeProgress), remaining pieces, days left, labour cost so far, cost per piece, and who worked on it. Mark a lot closed when done.
2. Tailor analytics (/manager/analytics):
   - date range filter (this month, last month, custom)
   - ranking list: pieces and earnings per tailor (approved + confirmed only)
   - per-tailor detail: pieces per day chart, earnings by operation, days worked, average pieces per day, dispute rate
   - one overview chart: total pieces per day for the unit
3. Compute aggregates in SQL views or RPC functions, not by loading all rows into the browser. Add indexes if needed and explain them. Respect RLS (tailors must not be able to call manager analytics).
4. Charts with Recharts (ask before adding). Use the palette tokens, add direct labels and pattern/shape cues, not colour only. Charts must be readable on a phone: horizontal scroll is not acceptable; use simple bar/line charts with large labels.
5. Numbers in Indian format; month names and weekdays in the active language via Intl.
6. Empty states that explain what to do next. Skeleton loading. CSV export of the visible table.
7. Tests: SQL aggregates against a fixture (including a rate change and a disputed entry); a test that a tailor session gets permission denied; Playwright screenshot of analytics at 360px in Gujarati.
~~~

## Acceptance checklist
- [ ] Lot screen shows done vs total and cost per piece correctly on seed data
- [ ] Analytics numbers match month-end payroll for the same range
- [ ] Charts readable on a phone, no colour-only meaning
- [ ] No large unaggregated downloads (check Network tab)

## If you are behind schedule
Ship only: per-tailor ranking + lot progress. Move charts to week 2.

## Commit
`feat(analytics): lots and manager analytics`
