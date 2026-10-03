# T11 — English, Gujarati and Hindi, done properly

**Day:** 6 · **Time box:** 3 h + native-speaker review · **Depends on:** T04 onward
**Attach:** `CONTEXT.md`, `DESIGN_BRIEF.md`

## Goal
Every screen is fully usable in all three languages, with wording real workers use.

## Prompt
~~~text
Read CLAUDE.md and DESIGN_BRIEF.md. Then do task T11. Plan first.

1. Audit: scan the codebase for hard-coded user-visible strings (JSX text, aria-label, placeholder, title, toast and error messages, Zod messages, document title, manifest names). Fix them all by moving them to i18n keys. Add an ESLint rule or a test that fails on new hard-coded JSX text.
2. Organize locales by namespace/feature (common, auth, entry, verification, payroll, analytics, errors, slip). Keys are semantic. No concatenated sentences: use interpolation and ICU-style plurals (react-i18next plural keys) so word order can differ per language.
3. Draft gu.json and hi.json from en.json. Use plain, spoken language that a tailor and a small-unit manager would use. Keep common loanwords where people actually say them (for example piece, lot, upad) - put them in a glossary file docs/glossary.md with the chosen term per language and a note on why.
4. Formatting: money, numbers, dates, month names and weekdays through Intl for the active locale. Indian digit grouping. Decide and document whether to show Latin or native digits (default: Latin digits for money and counts; make it a single setting in one place).
5. Layout robustness: add a pseudo-locale (for example 'xx') that expands strings by ~40% with accents, and a Playwright test that screenshots key screens in en, gu, hi and xx at 360px. Fix overflow and clipped text. Verify line-height for Gujarati/Devanagari (taller glyphs).
6. Fonts: confirm the self-hosted subsets contain every character used in the locale files (write a script that reads gu.json/hi.json and reports missing glyphs).
7. Create a review sheet: a CSV export (key, English, Gujarati, Hindi, screen/context, status) so native speakers can review and send back corrections in one file, plus an import script that applies the corrected CSV back into the JSON files and reports changed keys.
8. Language switcher: persists per user (profile.language) and per device; switching never loses form input.

Do not machine-translate the glossary terms without flagging them for human review. List every string you are unsure about.
~~~

## Acceptance checklist
- [ ] No hard-coded visible strings remain (lint/test enforces it)
- [ ] Screens fine in en, gu, hi and the expanded pseudo-locale
- [ ] Glyph coverage report is clean
- [ ] Review CSV round-trips (export → fix → import)
- [ ] At least **two native speakers** (one manager-type, one tailor-type) have reviewed the main flows

## Verify yourself
Give the phone to a Gujarati speaker who has never seen the app. Ask them to enter a ticket and confirm it. Note every hesitation.

## Commit
`feat(i18n): complete en/gu/hi localisation with review tooling`
