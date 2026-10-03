# SilaiBook — Add My Idea to the Existing Web App (single prompt file)

> Paste this whole file into Antigravity (or save as `AGENTS.md` / drop into the project and say: "Read SILAIBOOK_IDEA_PROMPT.md and follow it").
> The web app already exists. **Do not rebuild it.** Inspect first, then add the idea on top.

---

## 0. Your role and ground rules
You are a senior full-stack engineer + product designer. The app is already running. Your job is to add the features below, with smooth professional animation and images, **without breaking anything that works**.

1. **Inspect first.** Read the repo: framework, folder structure, styling system, database, auth, i18n setup, existing screens. Write a short summary (10 lines max) and a plan before changing code. Reuse existing components, tokens and patterns; do not introduce a second UI library or a second state system.
2. **Work in small steps.** One feature at a time (Section 3), run the app, run lint/tests, then continue. Keep each change reviewable. Commit after each step.
3. **Ask before** changing the stack, database schema in a destructive way, or deleting code.
4. **Never put secrets in code.** Use `.env.local`; keep `.env.example` current.
5. When something is unclear, ask one short question instead of guessing.

---

## 1. The idea (product summary)
**Problem:** In garment units, tailors are paid per piece. A tailor may finish 35 pieces in 2 days at ₹33 per piece, across many lots. Managers count the whole month by hand for 50+ tailors. It is slow, error-prone and causes disputes.

**Solution:** A very simple app where pieces and rates are entered (by the manager, or by the tailor and then verified by the manager with a single **Yes / No**). The app calculates the whole month's salary automatically and gives the manager analytics on every tailor and every lot.

**Users:** garment unit managers and tailors (many are low-tech, on cheap Android phones). Target: at least 100 users at start.

**Languages:** English, ગુજરાતી (Gujarati), हिन्दी (Hindi) — the language barrier must disappear.

**Core rules (must hold everywhere):**
- Each entry stores: tailor, date, lot, operation, pieces, **rate snapshot** (rate copied at entry time so later rate changes never change old entries).
- Status: `pending → verified | rejected`. **Only verified entries count in salary.**
- Monthly salary = Σ(verified pieces × rate) + bonus − advances − deductions.
- Money is stored as integer paise (no floats). Display in ₹ with Indian digit grouping.
- A closed month is locked; reopening needs a manager action and is logged.

---

## 2. Check what already exists (gap analysis)
Compare the app against Section 3 and produce a table: **Feature | Exists / Partial / Missing | Plan**. Only build what is Partial or Missing. Do not duplicate working features.

---

## 3. Features to add (build in this order)

### 3.1 Fast piece entry (under 10 seconds)
- Choose tailor (manager) → lot → operation (rate auto-fills, editable by manager) → pieces on a **large number pad** → Save.
- "Repeat last entry" button; today's total shown big.
- Tailors see only their own entries.
- Validation with friendly messages in the user's language.

### 3.2 Verification inbox (Yes / No)
- "To verify" list grouped by tailor and day, with a count badge.
- Large green **Yes** and red **No**; swipe on mobile; bulk "Verify all for this tailor/day".
- Rejecting asks for a short reason (preset chips + free text); the tailor sees it and can resubmit.
- Manager-entered entries can be auto-verified (setting).
- Verified rows are read-only unless the month is reopened; log every change in an audit trail.

### 3.3 Monthly salary calculation
- Pure function `calculateMonthly(entries, adjustments)` with unit tests (mid-month rate change, zero pieces, negative net warning).
- Month selector; table for all tailors: pieces, gross, adjustments, net, and **pending ₹X** (shown separately, never added to salary).
- Tailor detail: day-by-day breakdown by lot and operation.
- Add bonus / advance / deduction with notes.
- **Close month** (lock + snapshot) and owner-only reopen with reason.
- Export salary slips (PDF, one per tailor) and CSV summary; share via the Web Share API.

### 3.4 Manager analytics
- Cards: pieces today / month, payroll so far, pending verifications.
- Per tailor: daily trend, average per day, best day, earnings, rejection rate.
- Per lot: target vs done, remaining, % complete, who worked on it, labour cost per piece, projected finish date from recent pace.
- Filters: date range, tailor, lot. Aggregates computed in the database (views/RPC), not by looping raw rows in the browser.

### 3.5 Three languages everywhere
- Every string comes from translation files (EN/GU/HI); no hard-coded text.
- Language switch visible on login and in the header; saved per user.
- Numbers/dates/currency via `Intl`. Use Noto Sans Gujarati and Noto Sans Devanagari with fallbacks; check line-height so scripts are not clipped.
- Use simple shop-floor words; flag translations for review by a native speaker.
- Icons beside key actions so low-literacy users can succeed.

---

## 4. Animation and transitions (professional, smooth, purposeful)
Animation must help understanding, never slow people down. Target 60fps on a mid-range Android phone.

**Tooling:** use the animation approach already in the project. If none, use **Motion (Framer Motion)** for React, or plain CSS transitions for simple states. Animate only `transform` and `opacity` (avoid animating width/height/top/left).

**Timing rules:** micro-interactions 120–200ms; page/section transitions 250–350ms; easing `cubic-bezier(0.22, 1, 0.36, 1)` for entrances, `ease-in` for exits. Springs with low bounce for cards. Nothing longer than 500ms.

**Where to animate:**
| Place | Animation |
|---|---|
| Page navigation | Short fade + 12px slide, shared layout so the header stays still |
| Number pad / buttons | Press scale to 0.96 with quick release |
| Piece total & salary amounts | Count-up (≤600ms), tabular numerals so digits do not jump |
| Save entry | Row slides into the list; subtle highlight that fades |
| Verify Yes / No | Card slides away with a check or cross mark; list closes the gap smoothly; optional haptic (`navigator.vibrate`) where supported |
| Lot progress | Tape-measure style bar that fills on load |
| Charts | Draw-in on first view only (not on every filter change) |
| Lists | Staggered entrance (30–40ms between items, max 8 items animated) |
| Loading | Skeleton screens that match the final layout (no spinners for full pages) |
| Modals / bottom sheets | Slide up with backdrop fade; drag to dismiss on mobile |
| Month close | Gentle lock animation and confirmation toast |
| Errors | Small horizontal shake once on the invalid field |
| Language switch | Cross-fade text, no layout jump |

**Must-haves:**
- Respect `prefers-reduced-motion`: replace movement with simple fades or none.
- No animation blocks input; users can tap while things move.
- Keep bundle size in check: lazy-load the animation library only if heavy, and import only what is used.
- Provide one shared file (e.g. `motion.ts` or `animations.css`) with durations, easings and variants so the whole app feels consistent.

---

## 5. Images and illustrations (only where they help)
Use images to guide and reassure, not to decorate. Keep pages fast on weak mobile data.

**Where to place them:**
1. **Login / welcome:** one calm illustration (tailor at a sewing machine, spools, fabric) beside the language picker.
2. **Empty states:** no entries yet, no tailors yet, nothing to verify ("All done!"), no lots — each with a small friendly illustration and one clear action button.
3. **Onboarding (3 short steps):** add tailors → add a lot → enter pieces; one illustration per step.
4. **Lot cards:** optional photo of the garment/style (manager can upload; fall back to a fabric-pattern placeholder).
5. **Tailor profile:** optional avatar; fall back to initials on a coloured circle.
6. **Salary slip PDF:** unit logo at the top (optional upload).
7. **Error / offline pages:** simple illustration with plain-language text.

**How to source and build them:**
- Prefer **SVG illustrations** that you generate and keep in `/public/illustrations/` — scalable, tiny, themeable with the app's colour tokens. Do not hotlink external images (they break offline and can break licensing).
- Use a consistent style: flat, rounded shapes, 3–4 palette colours.
- For uploaded photos: compress and resize on upload (max ~1200px, WebP/JPEG ~80%), store in object storage, generate a small thumbnail, add `loading="lazy"`, set width/height to avoid layout shift, and always include `alt` text (translated).
- Show a blurred placeholder or skeleton while images load.
- If you cannot create a good illustration, leave a clearly labelled placeholder (`/public/illustrations/PLACEHOLDER-<name>.svg`) and list it so I can replace it. Do not use copyrighted images or brand logos.

---

## 6. Visual direction ("ledger meets fabric")
Keep the existing design tokens if the app already has a style; otherwise use:
- Indigo ink `#1F2A5A`, turmeric accent `#E8A317`, cream paper `#FBF6EA`, thread-red (reject) `#C8402F`, cotton-green (verify) `#2E8B57`; light + dark.
- Signature details: stitched dashed dividers, tape-measure progress bar, spool-style counter for totals.
- Min touch target 48px, bottom navigation on mobile, WCAG AA contrast, works at 200% text size, never use colour as the only signal.

---

## 7. Quality bar
- **Performance:** loads fast on a mid-range phone on 3G/4G; code-split heavy screens; no layout shift.
- **Offline/PWA (if not already present):** installable, caches the app shell, queues entries offline with idempotency keys and syncs without duplicates.
- **Security:** database access limited to each unit's own data (row-level rules); tailors cannot read other tailors' data or verify their own entries; write a test that proves it.
- **Accessibility:** keyboard and screen-reader friendly labels, visible focus, translated `alt` text.
- **Tests:** unit tests for money and salary logic; a smoke test for entry → verify → monthly total in all three languages.

---

## 8. Deliverables and "Done when"
At the end, report with a checklist:
- [ ] Gap-analysis table completed and only missing items built
- [ ] 35 pieces × ₹33 stores and shows ₹1,155 correctly; rate snapshot unaffected by later rate changes
- [ ] Only verified entries are in salary; pending shown separately
- [ ] Month close/reopen works and is logged
- [ ] Analytics numbers match the salary totals
- [ ] All screens usable in EN / GU / HI with no clipped or overlapping text
- [ ] Animations smooth, reduced-motion respected, no jank on a mid-range phone
- [ ] Images/illustrations placed as in Section 5; list of placeholders I must replace
- [ ] Lint and tests pass; `README` and `CHANGELOG` updated

Start now with Section 0: inspect the repo and send me the summary, the gap-analysis table and your plan. **Wait for my "go" before editing code.**
