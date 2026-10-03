# B06 — Put the logo and icons everywhere in the app

**When:** Day 6–7 · **Time box:** 2 h · **Depends on:** B02, B03, B04, T04
**Attach:** `B00_BRAND_BRIEF.md`, `DESIGN_BRIEF.md`, `brand/README.md`

## Goal
The identity appears consistently, correctly sized, accessible and fast — in the app, exported slips, error pages, and emails.

## Prompt
~~~text
Read B00_BRAND_BRIEF.md, DESIGN_BRIEF.md and brand/README.md. Then do task B06. Plan first.

1. Create a <Logo> component: props variant ("mark" | "horizontal" | "stacked"), tone ("colour" | "ink" | "white" | "auto" which follows the theme), size or height, and accessible name. When the logo is next to visible app-name text, render aria-hidden; otherwise role="img" with a translated aria-label. Inline the SVG (no extra request) for mark; lazy/sprite for the larger lockups. Respect the clear-space and minimum-size rules from brand/README.md (enforce min size in the component).
2. Place the brand:
   - Language picker / first-run screen: stacked logo, large, with the three-script name.
   - Login and signup: horizontal logo at the top.
   - App shell header: mark only on mobile, horizontal logo on desktop manager view.
   - Loading screen / splash: mark with a one-time "thread draws itself" animation (SVG stroke-dashoffset), under 1.2 seconds, disabled for prefers-reduced-motion, and never blocking real loading.
   - Empty states and the 404 page: a small mark plus the illustration style from B05 if available.
   - Salary slip (exported image and print view): small horizontal logo in the header or footer, using the mono-ink version; make sure it renders in html-to-image export.
   - CSV/PDF exports: add the app name text only.
   - PWA update prompt and install prompt: mark.
3. Replace all placeholder icons from T01/T04 with the final <Icon> set from B03. Search the codebase for leftover placeholder or emoji icons and replace them.
4. Dark mode: use tone="auto" and verify contrast of every placement against the actual background.
5. Supabase auth email templates (confirmation, reset): write HTML templates that use a hosted PNG of the horizontal logo (from public/), plain fallback text, and the three-language footer; document where to paste them in the Supabase dashboard (I will do the dashboard step).
6. Update README.md header, repository social preview image notes, and the docs/design-system.md with the Logo and Icon usage.
7. Tests: unit test for <Logo> (variants, aria behaviour, min-size clamp); Playwright screenshots of the language picker, login and header in light/dark and en/gu/hi at 360px; axe check; a test that no placeholder icons remain.
8. Performance: confirm logo assets add less than ~10 KB to the initial load (report numbers) and the splash animation causes no layout shift.
~~~

## Acceptance checklist
- [ ] Logo appears on language picker, login/signup, header, splash, 404, slips
- [ ] Correct version on every background (colour/mono/reversed), contrast OK in light and dark
- [ ] No placeholder icons or emojis left
- [ ] Reduced-motion respected; no layout shift
- [ ] Auth emails use the logo (after you paste the templates in Supabase)

## Commit
`feat(brand): integrate logo and icons across the app`
