# 06 — Manager Analytics
**Task:** Dashboard for managers to see performance and lot progress.
**Requirements:**
- Cards: pieces today / this month, payroll so far, pending verifications.
- Per-tailor view: daily pieces trend, average per day, best day, earnings, rejection rate.
- Leaderboard (optional toggle; some units may not want it).
- Lot view: progress, who worked on it, cost per piece (labour), projected completion date from recent pace.
- Operation view: average rate vs output.
- Filters: date range, tailor, lot. Recharts, mobile-friendly, skeleton loaders.
- Use SQL views/RPC for aggregates so the browser doesn't crunch raw rows.
**Done when:** dashboard loads fast on a mid-range phone with 6 months of data; numbers reconcile with the salary engine.
