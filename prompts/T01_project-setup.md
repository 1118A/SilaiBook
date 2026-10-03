# T01 — Project setup, tooling, CI, PWA shell

**Day:** 1 · **Time box:** 2–3 h · **Depends on:** nothing
**Attach:** `CONTEXT.md` (as CLAUDE.md), `DESIGN_BRIEF.md`

## Goal
A clean, professional repo skeleton that builds, lints, tests, deploys, and installs as a PWA.

## Prompt
~~~text
Read CLAUDE.md (CONTEXT) and DESIGN_BRIEF.md first. Then do task T01.

First give me a short plan. After I say go, implement in small commits.

Create the app in ./app with:
1. Vite + React + TypeScript (strict mode, noUncheckedIndexedAccess), path alias @/ -> src/.
2. Tailwind CSS configured to use CSS variables from src/styles/tokens.css. Put the light and dark token sets from DESIGN_BRIEF.md in tokens.css (data-theme="dark" switch).
3. ESLint (typescript-eslint, react-hooks, jsx-a11y) + Prettier. Scripts: dev, build, preview, lint, typecheck, test, test:e2e.
4. Vitest + Testing Library with one sample test; Playwright config with one smoke test.
5. react-router with placeholder routes: /, /login, /signup, /manager, /tailor, /dev/gallery. Lazy-load route modules.
6. TanStack Query provider; env validation with Zod in src/lib/env.ts (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_SENTRY_DSN optional). Add .env.example. Never commit .env.local.
7. react-i18next with en.json, gu.json, hi.json containing only a few keys now (app.name, common.save, common.cancel). Language stored in localStorage with try/catch. Default language: gu.
8. vite-plugin-pwa: manifest (name "Dhaga", short_name "Dhaga", theme_color #2B3A8C, background_color #FBF6EC, display standalone, placeholder icons 192/512 and a maskable icon), auto-update service worker with a small "New version available - Reload" prompt component.
9. src/lib/money.ts with: toPaise(rupeesString) , formatPaise(paise, locale), sum(paiseArray). Integers only; throw on non-integer input. Unit tests including: 3300 paise formats as ₹33.00; 35 x 3300 = 115500 formats as ₹1,155.00; negative values; very large values.
10. GitHub Actions workflow .github/workflows/ci.yml: install, lint, typecheck, test, build on every push and PR.
11. README.md in repo root: what the project is, how to run, scripts, folder layout, how to deploy.
12. NOTES.md with a "Done / Broken / Next" section.

Do not add any other dependency without asking. Show me the final folder tree and the exact commands to run it.
~~~

## Acceptance checklist
- [ ] `npm run lint`, `typecheck`, `test`, `build` all pass locally and in CI
- [ ] `npm run dev` shows a placeholder page; language switch works and persists
- [ ] Lighthouse (Chrome DevTools) says the app is installable as a PWA
- [ ] money tests cover the cases listed
- [ ] `.env.local` is git-ignored; `.env.example` exists

## Verify yourself
1. Run the dev server, open on your phone through the local network or a preview deploy.
2. Chrome DevTools → Application → Manifest shows no errors.
3. Toggle offline in DevTools; reload; the shell still loads.

## Deploy now (do not wait until day 7)
In Cloudflare Pages: connect the repo, build command `npm run build`, output directory `dist`, root directory `app`. Add the env vars. Confirm the HTTPS URL installs on your phone.

## Commit
`chore: scaffold app with tooling, CI and PWA shell`
