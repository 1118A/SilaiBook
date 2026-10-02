# SilaiBook — Master File (read this first)

**Working name:** SilaiBook (rename freely). **What it is:** a piece-rate payroll app for garment units. Tailors/managers log pieces × rate per lot; the manager verifies (Yes/No); the app totals the month's salary and shows per-tailor and per-lot analytics. UI in **English, ગુજરાતી, हिन्दी**.

## Decisions (change only if you have a reason)
| Area | Choice | Why |
|---|---|---|
| App type | **PWA** (installable web app) first, native later | One codebase, no Play Store cost, works on cheap Android phones |
| Frontend | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui | Fast, huge ecosystem, free |
| Backend/DB/Auth | Supabase (Postgres + Auth + Row Level Security) | Free tier, SQL, RLS gives per-unit data isolation |
| i18n | next-intl (en, gu, hi) | Simple message files, per-user language |
| Hosting | Vercel free tier + Supabase free tier | Zero cost to start. **Check current free-tier limits before launch** |
| Charts | Recharts | Light, easy |
| Offline | Service worker + IndexedDB queue (Phase 2) | Factory Wi-Fi is unreliable |
| Reports | Client-side PDF/CSV export | No server cost |

## Roles
- **Owner/Manager:** manages tailors, lots, rates; verifies entries; closes month; sees analytics.
- **Tailor:** adds own entries (optional) and sees own pieces/earnings. Login by phone OTP or simple PIN set by manager.

## Core rules (the product's heart)
1. Every entry stores **tailor, date, lot, operation, pieces, rate snapshot**. Rate is copied at entry time so later rate changes never alter old entries.
2. Status: `pending → verified | rejected`. **Only verified entries count in salary.**
3. Monthly salary = Σ(verified pieces × rate) + bonus − advances − deductions.
4. A closed month is locked; edits need a manager reopen action, logged in an audit trail.
5. Money stored as integer paise (never floats).

## How to execute (step by step)
1. Create accounts: GitHub, Supabase, Vercel. Install Node 20+, Git, VS Code.
2. Use an AI coding tool (Claude Code recommended, or Cursor) in an empty folder; put this whole `silaibook-kit` folder inside it.
3. Run prompts **in order**, one per session: `01` → `10`. After each: run the app, test the checklist at the bottom of that file, `git commit`.
4. Do not start the next file until the current one's "Done when" list passes.
5. Pilot: onboard **1 real garment unit (5–10 tailors)** for a full month alongside their manual register. Compare totals. Fix. Then grow toward 100 users.
6. Collect feedback weekly; keep a `CHANGELOG.md`.

## Order & rough effort
| File | Task | Effort |
|---|---|---|
| 01 | Project setup | 0.5 day |
| 02 | Database + auth + RLS | 1–2 days |
| 03 | Piece entry + lots | 2 days |
| 04 | Verification workflow | 1 day |
| 05 | Salary engine | 2 days |
| 06 | Analytics dashboard | 2 days |
| 07 | Multilingual (EN/GU/HI) | 1 day |
| 08 | Unique UI system | 2 days (start in parallel with 03) |
| 09 | PWA, offline, exports | 2 days |
| 10 | Testing + deploy + pilot | 2 days |

## Prompt-writing rule for every file
Each prompt file gives: Context → Task → Requirements → Done when. Paste the file's content plus "Follow `00_MAIN.md` rules" to your AI tool.

## Business notes (for later)
- Free for first pilot units; then a small per-unit monthly plan (e.g., tiered by tailor count). Validate price with pilot owners.
- Gujarat's Surat textile/garment cluster is a natural first market; sell through unit owners and accountants.
- Keep customer data private; add a short privacy policy before onboarding paid users.
