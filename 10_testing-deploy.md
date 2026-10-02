# 10 — Testing, Deploy, Pilot
**Requirements:**
- Unit tests (money, salary engine), integration tests for RLS, Playwright smoke tests for entry → verify → payroll in all 3 languages.
- Error tracking (free tier), basic uptime check, Supabase daily backups verified by a restore test.
- Deploy: Vercel (frontend) + Supabase; env vars set; custom domain optional; seed-free production DB.
- Security pass: RLS review, rate limiting on auth, no secrets in client, HTTPS only; short privacy policy and terms.
- Pilot plan: 1 unit, 5–10 tailors, one full month parallel with the paper register; record time saved and total mismatches.
- Launch checklist and 30-day roadmap in `docs/`.
**Done when:** the pilot month's totals match the manual register (or every difference is explained), and the owner says they would pay.
