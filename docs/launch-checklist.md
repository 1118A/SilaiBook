# Production Launch Checklist — SilaiBook

**App Version:** 1.0.0  
**Target Infrastructure:** Vercel (Frontend Next.js) + Supabase PostgreSQL (Backend DB)

---

## Pre-Launch Quality & Testing Checks
- [x] **Linting & Code Standards:** `npm run lint` passes with 0 errors and 0 warnings.
- [x] **Automated Unit & E2E Tests:** `npm test` passes 100% of tests (65/65 passing across 15 test suites).
- [x] **Camera QR & Barcode Bundle Scanner:** Fast optical scanner + printable QR bundle tickets (Palla Chit) for piece-rate lots with haptic feedback and manual barcode gun support.
- [x] **Money & Currency Safety:** Integer paise arithmetic verified (`lib/money.ts`). Zero floating point usage for currency.
- [x] **Multilingual i18n:** All UI strings localized across English (`EN`), Gujarati (`GU`), and Hindi (`HI`).
- [x] **PWA & Offline Support:** `manifest.json`, `sw.js`, and IndexedDB sync engine operational with idempotency keys.
- [x] **Dark & Light Mode UI:** Responsive Tailwind CSS v4 design system verified across all 9 dashboard menus.

---

## Infrastructure & Production Deployment Steps

### 1. Supabase Database Setup
- [ ] Provision production Supabase project instance (Region: `ap-south-1` Mumbai).
- [ ] Run initial schema migrations (`supabase/migrations/20260901000000_initial_schema.sql`).
- [ ] Confirm RLS is enabled on all production tables.
- [ ] Ensure DB is **seed-free** for clean production onboarding.
- [ ] Enable Supabase daily automated database backups.

### 2. Vercel Project Deployment
- [ ] Connect GitHub repository to Vercel.
- [ ] Configure Build Settings: Framework Preset `Next.js`, Build Command `npm run build`.
- [ ] Set Production Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (Server-side only)
- [ ] Deploy production build and verify HTTPS SSL certificate.
- [ ] Verify PWA Web Manifest and Service Worker installation on test Android mobile device.

---

## Post-Launch Sign-off
- [ ] Owner account created and factory unit registered.
- [ ] Initial tailor roster and operation rates configured.
- [ ] WhatsApp sharing verified for salary slips.
