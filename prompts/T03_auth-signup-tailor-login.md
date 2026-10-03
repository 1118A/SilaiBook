# T03 — Authentication: manager signup/login, tailor PIN login

**Day:** 2 · **Time box:** 3 h · **Depends on:** T01, T02
**Attach:** `CONTEXT.md`, `DESIGN_BRIEF.md`

## Goal
Managers sign in with email/password. Tailors sign in with unit code + worker code + PIN, with brute-force protection. Route guards by role.

## Prompt
~~~text
Read CLAUDE.md and DESIGN_BRIEF.md. Then do task T03. Plan first.

A. Manager flows (Supabase Auth, email + password)
1. /signup: unit name, manager name, email, password, language. Calls signup_manager(). Friendly validation errors via Zod; messages from i18n.
2. /login: email + password. "Forgot password" using Supabase's reset flow.
3. After login, load the profile (role, unit, language) into an AuthProvider. Set the app language from profile.language.

B. Tailor login
1. Supabase Edge Function (Deno) `tailor-login`: input { unitCode, workerCode, pin }. Look up the worker, verify the PIN against a bcrypt hash stored server-side (pgcrypto crypt/gen_salt('bf')) in a table that tailors and managers cannot read through the API (only the function with the service role can). Return a Supabase session for the tailor's auth user.
2. PINs are 6 digits. Add a login_attempts table; lock the worker for 15 minutes after 5 failed attempts; return a generic error that does not reveal whether the unit or worker exists.
3. Manager-side RPC/Edge Function `set_worker_pin(worker, new_pin)` to create or reset a PIN (manager only). Never return or log the PIN after setting; the manager sees it once on screen.
4. The unit needs a short public unit code (add a unit_code column, unique, 6 chars, easy to read aloud, no ambiguous characters).
5. Tailor login screen: three large inputs (unit code, worker code, PIN with a number pad), icon-led, in the selected language. Remember unit code on the device.

C. App plumbing
1. Language picker as the first screen when no language is stored; each language written in its own script.
2. Route guards: /manager/* manager only, /tailor/* tailor only; redirect appropriately; handle expired sessions.
3. Logout clears sensitive local data (but keeps the offline queue of unsynced entries, with a warning).

D. Tests
- Unit tests for Zod schemas and guards.
- Edge Function tests: wrong PIN, locked worker, correct PIN, unknown unit (same error shape as wrong PIN).
- Playwright: manager signup -> logout -> login; tailor login happy path and lock-out.

Security notes at the end: where secrets live, what the function can and cannot return.
~~~

## Acceptance checklist
- [ ] Manager can sign up, log in, reset password
- [ ] Tailor can log in with unit code + worker code + PIN; wrong PIN fails; 5 failures lock for 15 minutes
- [ ] Error messages don't reveal whether a unit or worker exists
- [ ] The PIN hash cannot be read via the public API (try it with the anon and tailor tokens)
- [ ] Service-role key exists only in Edge Function secrets
- [ ] Guards work; language is remembered

## Verify yourself
Try logging in as a tailor on a second phone. Try 6 wrong PINs and confirm the lockout. In DevTools → Network, confirm no response contains a hash or key.

## Commit
`feat(auth): manager signup/login and tailor PIN login with lockout`
