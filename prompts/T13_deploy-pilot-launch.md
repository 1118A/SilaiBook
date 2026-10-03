# T13 — Production deploy, operations and pilot launch

**Day:** 7 · **Time box:** 4 h · **Depends on:** T12
**Attach:** `CONTEXT.md`, `00_MAIN_GUIDE.md` (Part 8 checklist)

## Goal
A production environment you trust, plus everything needed to onboard the first unit in person.

## Prompt
~~~text
Read CLAUDE.md and the pilot-readiness checklist in 00_MAIN_GUIDE.md. Then do task T13. Plan first. Produce runnable scripts and a docs/runbook.md; for steps that need me to click in a dashboard, write exact click-by-click instructions.

1. Environments: separate Supabase projects for dev and prod. Migrations applied to prod through a documented command (supabase db push) from CI on tags only, with a manual approval step. Environment variables per environment in Cloudflare Pages and GitHub secrets. Preview deployments use dev.
2. Production Supabase setup checklist: auth settings (email confirmations, password rules, allowed redirect URLs), disable features not used, confirm RLS everywhere, set the Edge Function secrets, confirm the free-plan limits and what happens when reached. Note the free plan pauses after a week of inactivity.
3. GitHub Actions:
   - keep-alive: scheduled workflow that calls the health endpoint and does a trivial query; alerts (email or Slack-style webhook) on failure
   - nightly export: dump key tables to storage I control (propose the simplest free option) with retention of 14 days, encrypted at rest if possible
   - restore drill: a documented procedure plus a script to restore a dump into a scratch project; actually run it once and record the time it took
4. Monitoring: Sentry production DSN; uptime check on the live URL; a simple status note in the runbook for "what to do if the database is paused/down".
5. Domain and HTTPS: custom domain setup on Cloudflare Pages, redirects, 404 page, robots/meta, social preview image slot.
6. Demo unit: seed script that creates a realistic demo unit (8 tailors, Gujarati names, 6 operations with rates, 3 weeks of entries, one open lot) which can be reset with one command.
7. Onboarding inside the app: a 4-step first-run flow for managers (add tailors, operations, rates, first ticket) and a one-screen guide for tailors, in all three languages; a "Help" screen with a WhatsApp contact link and a feedback form (writes to a feedback table with RLS).
8. Privacy: consent text at signup, privacy page in 3 languages describing what is stored; "Delete my unit's data" flow (manager-only, with confirmation and a delay) or, at minimum, a documented manual procedure.
9. Pilot kit in docs/pilot/: a 1-page onboarding script for sitting with a manager, a checklist for day 1 / day 3 / day 7 check-ins, a feedback question list, and a table to record the pilot metrics (entries per tailor per day, % verified in 24 h, disputes, minutes to close the month).
10. Release process: tag v0.1.0, changelog, rollback instructions (redeploy previous Cloudflare build; database migrations are forward-only, so describe how to ship a fix migration).

Finish with a go/no-go checklist for launching the pilot and a list of known limitations I must tell the pilot units about.
~~~

## Acceptance checklist
- [ ] Production URL works over HTTPS and installs on Android
- [ ] Keep-alive and nightly export run; restore drill done and timed
- [ ] Demo unit resets in one command
- [ ] Onboarding flows exist in all three languages
- [ ] Privacy text and data-deletion path exist
- [ ] You can state the known limitations out loud

## Pilot day-1 script (in person)
1. Sit with the manager; create the unit together.
2. Add 5 real tailors and 2–3 real rates.
3. Enter the day's real tickets on the manager's phone.
4. Let one tailor log in and tap Yes.
5. Watch silently for 10 minutes; write down every hesitation.

## Commit
`chore: production setup, operations runbook and pilot kit`
