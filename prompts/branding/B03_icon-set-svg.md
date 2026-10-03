# B03 — Custom icon set (SVG + React components)

**When:** Day 2 (alongside T04) or Day 6 · **Time box:** 3 h
**Attach:** `B00_BRAND_BRIEF.md`, `DESIGN_BRIEF.md`
**Tool:** AI coding agent

## Goal
One visually consistent icon family that fits the "Thread & Ticket" identity, usable as `<Icon name="…" />`.

## First decide (5 minutes)
Option 1 — **Hybrid (recommended for speed):** use a well-maintained open-source icon library for generic icons (home, plus, search, settings, share, download…) and custom-draw only the garment-specific ones. Check the library's licence yourself (many, such as Lucide, use permissive licences — verify the current text before shipping and keep the attribution file if required).
Option 2 — **Fully custom:** draw all icons. More unique, takes longer, and consistency needs more care.

Tell the agent which option you chose in the prompt.

## Icon list

| Group | Icons |
|---|---|
| Navigation | home, tickets, workers, approvals, reports, settings, profile, help |
| Actions | add, edit, delete, search, filter, share, download, upload, copy, print, refresh, close, back, forward, more |
| Sync/status | pending (hourglass), approved (tick), confirmed (double tick), rejected (cross), disputed (flag), synced, offline (cloud with slash), syncing, warning, info, lock, unlock |
| Garment domain (always custom) | needle, thread-spool, scissors, shirt, sewing-machine, bundle-ticket, lot-box, tape-measure, stitch-line, button |
| Money/time | rupee-coin, wallet, slip (salary slip), calendar, clock, advance (upad) |
| System | language, theme-light, theme-dark, pin-pad, phone, install-app, camera, qr |

## Prompt
~~~text
Read B00_BRAND_BRIEF.md and DESIGN_BRIEF.md. I chose Option <1 or 2> from the B03 file. Then do task B03. Plan first.

Step 1 - Define the style (do this first and show me before drawing everything):
- 24x24 viewBox, 2px safe padding (live area 20x20), stroke-based, stroke-width 1.75, round caps and joins, no fills except small solid details (like a dot), single colour via currentColor, corner radius 2 for rectangles, minimum gap between strokes 2px at 24px.
- Character: friendly and slightly hand-made; one distinctive "stitch" feature allowed per icon at most (for example a dashed segment); no more than 3-4 strokes per icon.
- Pixel-fit: make sure vertical/horizontal lines land on half-pixels so they look crisp at 24px and 20px.
Draw 6 pilot icons: needle, thread-spool, bundle-ticket, approved, disputed, offline. Render them in brand/icons-preview.html at 16, 20, 24, 32 and 48 px in ink on cream, white on indigo, and in dark mode. Wait for my feedback.

Step 2 - After I approve the style, draw the rest of the list (use the library for generic icons if I chose Option 1, but restyle nothing - just import consistently and make sure stroke-width matches; if the library's width differs, configure it to 1.75).

Step 3 - Implementation:
- Each custom icon as brand/icons/<name>.svg (source of truth).
- A build script scripts/build-icons.mjs generating src/components/icons/ with one typed React component per custom icon (or a single sprite), and a registry so <Icon name="needle" size={24} /> works with TypeScript autocompletion. Props: name, size (default 24), title (if provided, renders <title> and role="img"; if not, aria-hidden="true"), className. Colour via currentColor only.
- Status icons are always used together with a label and a colour (never colour alone) - add this note to docs/design-system.md.
- scripts/check-icons.mjs fails CI if any icon: lacks viewBox="0 0 24 24", contains hard-coded colours (other than currentColor/none), has stroke-width different from 1.75, contains <text>, or exceeds 1 KB.
- Extend /dev/gallery with a grid of all icons, searchable by name, shown at 16/24/32 and in light and dark.

Do not copy shapes from any existing icon set for the custom garment icons; draw them from simple geometry.
~~~

## Prompts to redo a single icon (reuse as needed)
~~~text
Redraw the icon "<name>" in the project's icon style (24x24, stroke 1.75, round caps/joins, currentColor, max 4 strokes). Current problem: <describe: too busy / unclear at 16px / looks like another icon>. Give me 3 variations side by side in a preview page, then wait for my choice.
~~~
~~~text
Audit all icons in brand/icons for consistency: stroke widths, corner radii, optical size, padding, visual weight. List outliers and fix them. Show before/after.
~~~

## Acceptance checklist
- [ ] Style approved on 6 pilot icons before drawing the rest
- [ ] All listed icons exist and look like one family
- [ ] Clear at 16–24 px; no colour hard-coded; `check-icons` passes in CI
- [ ] Status icons are paired with text and colour
- [ ] Gallery shows every icon

## Commit
`feat(icons): custom thread-and-ticket icon set and Icon component`
