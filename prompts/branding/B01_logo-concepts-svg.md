# B01 — Logo concepts as clean SVG (three directions)

**When:** Day 2, after T04 (or any time before launch) · **Time box:** 1–2 h
**Attach:** `B00_BRAND_BRIEF.md`, `DESIGN_BRIEF.md`
**Tool:** AI coding agent in your repo

## Goal
Three original, simple logo marks drawn as hand-readable SVG, shown side by side so you can choose one.

## Prompt
~~~text
Read B00_BRAND_BRIEF.md and DESIGN_BRIEF.md. Then do task B01. Plan first (list the three concepts in one line each) and wait for my "go".

Create three logo MARK concepts (symbol only, no text) as SVG files in brand/svg/concepts/. They must be original, not resembling any existing brand.

Technical rules for every SVG:
- viewBox="0 0 512 512", no width/height attributes, no external fonts, no raster images, no <text>.
- Build from simple primitives (circle, rect, rounded rect, line, arc paths) on a 16-unit construction grid; keep the path count low and readable; add comments explaining the geometry.
- Max 2 brand colours + ink from the palette in B00; define them as CSS custom properties with fallbacks (e.g. fill="var(--mark-primary, #2B3A8C)"), so the same file can be recoloured.
- No gradients, shadows, filters, or opacity tricks.
- Strokes must have round caps and joins; if you use strokes, ALSO provide an outlined (stroke-to-path) version so it scales and exports predictably.
- Keep a safe margin: artwork within the central 80% of the canvas (inside a 410x410 square centred).

Concept A - "Thread through the needle": an elongated needle eye (rounded slot) with ONE continuous thread line that loops through it and ends in a small confirming tick. Idea: stitching + confirmation.
Concept B - "Ticket and tick": a rounded bundle-ticket with two semicircular notches on the left edge, a dashed running-stitch line inside, and a bold tick. Idea: the piece ticket that is confirmed.
Concept C - "Thread monogram": a single continuous thread line (round caps) forming the Gujarati letter ધ (dha) in a simplified, geometric way. IMPORTANT: derive the shape from the real glyph outline of ધ in Noto Sans Gujarati Bold (extract it with fontTools or opentype.js - ask before adding a dev dependency), then simplify it; do not invent your own letterform. Add a tiny needle-tip at one end of the thread.

Then create brand/preview.html (static, no build step) that displays each concept:
- at 16, 24, 32, 64, 128 and 256 px
- on cream #FBF6EC, white, indigo #2B3A8C and night #14172B (the mark should switch to its reversed colours on dark backgrounds via CSS variables)
- in a circle mask and a rounded-square mask (Android/iOS icon shapes)
- all-ink and all-white versions

Finally, critique your own three concepts honestly against the tests in B00 (16px, squint, one-colour, mask, four backgrounds). Say which you would pick and why, and what you would change. Do not describe any concept as resembling a specific existing brand.
~~~

## How to choose
1. Open `brand/preview.html` on your phone and on a monitor.
2. Show the three marks for 2 seconds each to five people (ideally two managers, one tailor). Ask: "What does this make you think of?" and "Which would you trust with your salary records?"
3. Pick one. If none works, use B05 for fresh ideas and rerun with a new direction.

## Acceptance checklist
- [ ] Three SVGs exist, each under ~2 KB and readable
- [ ] Each passes the 16 px and one-colour tests
- [ ] Preview page shows every size, background, and mask
- [ ] Concept C uses a real glyph as its base (if you kept it)
- [ ] You have chosen one and written why in `NOTES.md`

## Commit
`feat(brand): three logo mark concepts and preview page`
