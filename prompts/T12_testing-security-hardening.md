# T12 — Testing, security and performance hardening

**Day:** 7 · **Time box:** 4 h · **Depends on:** T01–T11
**Attach:** `CONTEXT.md`

## Goal
Find and fix what would embarrass you in front of the first customer.

## Prompt
~~~text
Read CLAUDE.md. Then do task T12. Work as a skeptical reviewer first (report findings), then fix in priority order. Plan first.

A. Security review (report before fixing)
1. Re-audit every RLS policy and SECURITY DEFINER function. For each table, produce a matrix of who can select/insert/update/delete. Attempt cross-tenant and cross-tailor attacks and report concrete results.
2. Secrets: scan the repo and build output for keys (service role, JWT secrets). The browser bundle must contain only the anon key.
3. Auth: PIN lockout works; error messages don't reveal existence; session expiry and logout; password reset flow safe.
4. Web: add security headers via Cloudflare Pages _headers (CSP that allows only what the app needs, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors none). Sanitise anything rendered from user input (names, notes).
5. Dependencies: run npm audit; list high/critical issues and fix or justify. Pin versions via lockfile.
6. Abuse: rate limit signup and tailor-login endpoints; cap payload sizes; validate with Zod at the edge function.

B. Correctness
1. Money: property-based tests (for example fast-check, ask first) that sums of integers match expected totals; no float operations anywhere (grep for parseFloat, toFixed, Number( on money paths).
2. Payroll: compare the SQL close_month output with lib/payroll.ts across random fixtures.
3. Offline: chaos test for sync (random failures, duplicate delivery, app kill).
4. Timezones: work_date is a calendar date in the unit's timezone (Asia/Kolkata). Test around midnight and month boundaries.

C. Quality and performance
1. axe accessibility checks on all main screens in all three languages; fix violations.
2. Lighthouse on a throttled mobile profile: aim for good scores on Performance, Accessibility, Best Practices and PWA; set a bundle budget (for example initial JS under ~200 KB gzipped) and fail CI if exceeded; code-split routes and charts.
3. Test on a low-end Android device (or CPU 4x slowdown + Slow 4G in DevTools).
4. Error boundaries; Sentry wired with release tags and PII scrubbing (no names/phones/PINs in events).
5. Add a /health page or Edge Function used by the keep-alive job.

Finish with: a prioritized findings report (Critical / High / Medium / Low) with what was fixed and what remains, and updated CI that runs lint, typecheck, unit, pgTAP, E2E and bundle budget.
~~~

## Acceptance checklist
- [ ] No Critical or High findings left open
- [ ] No keys in the bundle; headers present
- [ ] Axe clean on main screens; Lighthouse acceptable; bundle budget enforced
- [ ] Chaos/offline and timezone tests pass
- [ ] CI runs everything and is green

## Commit
`chore: security, correctness and performance hardening`
