# T04 — Design system and app shell ("Thread & Ticket")

**Day:** 2 · **Time box:** 3–4 h · **Depends on:** T01
**Attach:** `CONTEXT.md`, `DESIGN_BRIEF.md` (essential)

## Goal
The unique visual identity as reusable components, proven on a gallery page, before any feature screens are built.

## Prompt
~~~text
Read CLAUDE.md and DESIGN_BRIEF.md carefully; the brief is the source of truth for look and feel. Then do task T04. Plan first.

1. Implement the tokens (light + dark) in src/styles/tokens.css and wire Tailwind to them (colours, radius, shadow, spacing). Add a ThemeProvider that supports system / light / dark, stored in localStorage with try/catch.
2. Self-host fonts (Noto Sans, Noto Sans Gujarati, Noto Sans Devanagari) as subsetted woff2 in public/fonts with font-display: swap, and precache them in the service worker. Use tabular-nums for all numeric displays. Tell me exactly which glyph ranges you subset and how to regenerate them.
3. Build these components in src/components/ui with TypeScript props and JSDoc, each accessible by keyboard and screen reader:
   AppShell (tailor: 3-item bottom nav; manager: bottom nav on small screens, left rail on md+), TicketCard (notched edge + dashed stitch border, pure CSS), TapeProgress (measuring-tape bar with ticks and turmeric fill, shows value and optional target), PieceCounter (large number, 64px -/+ buttons, long-press repeat, tap number to open a number-pad sheet), NumberPad, YesNoButtons (green tick / red cross with labels from i18n), StatusChip (pending, approved, confirmed, rejected, disputed - icon + word), SyncBadge (saved-on-phone / synced / needs-attention), LanguagePicker (3 cards in their own scripts), MoneyText (uses lib/money.ts), Button, IconButton, TextField, Select, Sheet (bottom sheet), Toast, EmptyState (simple inline SVG spool/needle), Skeleton.
4. Motion: "stitch-in" animation when a TicketCard is created (dashed border draws once), 120-200ms transitions elsewhere, all disabled under prefers-reduced-motion. Haptic helper (navigator.vibrate) behind a setting.
5. Create the /dev/gallery route (only in dev builds, or behind a flag) showing every component, in light and dark, in English / Gujarati / Hindi, including long-string and large-number cases and 200% text size.
6. Add axe accessibility checks to the Playwright smoke test for the gallery page. Fix violations.
7. Write a short docs/design-system.md describing each component and when to use it.

Do not copy generic dashboard templates. Stay with the concept in the brief. Show screenshots (via Playwright) of the gallery in the three languages, light and dark.
~~~

## Acceptance checklist
- [ ] Gallery shows all components, light and dark, three languages, no clipped text
- [ ] Contrast AA everywhere (axe has no contrast violations)
- [ ] Targets are 48px or larger; keyboard focus visible
- [ ] Fonts load offline (test with DevTools offline)
- [ ] Reduced-motion respected
- [ ] The look is clearly "Thread & Ticket", not a stock template — show it to someone and ask what they notice

## Verify yourself
Open `/dev/gallery` on your cheap phone. Set the phone's font size to largest. Switch to Gujarati. Does anything overflow?

## Commit
`feat(ui): thread-and-ticket design system, theme and gallery`
