# 05 — Monthly Salary Engine
**Task:** Compute and present monthly salary per tailor.
**Rules:** gross = Σ(verified pieces × rate_paise); net = gross + bonuses − advances − deductions. Pending/rejected excluded but shown as "pending ₹X" so nothing is forgotten.
**Requirements:**
- Pure TypeScript function `calculateMonthly(entries, adjustments)` with unit tests (include rate changes mid-month, zero pieces, negative net warning).
- Month selector; table of all tailors: pieces, gross, adjustments, net, pending.
- Tailor detail: day-by-day breakdown by lot and operation.
- Add advance/bonus/deduction with notes.
- **Close month:** lock entries, store a snapshot of totals; reopen only by owner with reason.
- Export salary sheet as PDF (per tailor slip + whole-unit summary) and CSV.
**Done when:** a 50-tailor seeded month calculates in under a second and matches an independent spreadsheet check.
