# Security & Compliance Review — SilaiBook

**Date:** October 2026  
**Target Architecture:** Next.js 16 (App Router) + Supabase PostgreSQL + IndexedDB (PWA)

---

## 1. Row-Level Security (RLS) Review
- **Multi-Tenant Isolation:** All database tables (`tailors`, `lots`, `operations`, `entries`, `adjustments`, `audit_logs`) enforce mandatory `unit_id = auth.jwt() -> unit_id` checks in Supabase RLS.
- **Role Permissions:**
  - `Tailor` role: Can read assigned piece entries and submit new `pending` entries. Cannot modify `verified` rows.
  - `Manager` role: Can read, verify, reject, and adjust entries within their unit.
  - `Owner` role: Full read/write access + month closing & backup restore capabilities.

## 2. Authentication & Rate Limiting
- **Authentication:** Supabase Auth via Phone OTP or Email/Password.
- **Rate Limiting:** Auth endpoint rate limiting enabled on Supabase API Gateway (max 5 OTP requests per 10 minutes per IP/phone).
- **Session Tokens:** Transferred via HTTPS `SameSite=Lax` HttpOnly secure cookies.

## 3. Client Environment Security & Zero Secrets Policy
- **No Secret Keys in Client:** `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side Edge functions or API routes (`.env.local`).
- **Public Keys Only:** Client apps only access `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **HTTPS & Security Headers:** HSTS enabled, Content-Security-Policy (CSP) restricting script sources to trusted origins.

## 4. Integer Money Arithmetic & Data Integrity
- All currency amounts are represented and calculated as integer paise (`number` without floating-point math).
- Verified entries are immutable from tailor-facing client edits.
