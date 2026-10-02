# 01 — Project Setup
**Context:** SilaiBook, see 00_MAIN.md. Empty repo.
**Task:** Scaffold the app.
**Requirements:**
- Next.js (App Router, TypeScript), Tailwind, shadcn/ui, ESLint, Prettier.
- Folders: `app/[locale]/...`, `components/`, `lib/` (supabase client, money utils, date utils), `messages/` (en.json, gu.json, hi.json), `supabase/migrations/`, `docs/`.
- `.env.example` with Supabase URL and anon key; never commit real keys.
- `lib/money.ts`: helpers to store/format rupees as integer paise (`formatINR`).
- Install: `@supabase/supabase-js`, `@supabase/ssr`, `next-intl`, `recharts`, `zod`, `react-hook-form`, `date-fns`.
- Add Vitest for unit tests and a GitHub Actions workflow (lint + test).
- README with setup steps.
**Done when:** `npm run dev` shows a styled home page; `npm run lint` and `npm test` pass; first commit pushed.
