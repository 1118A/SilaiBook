# B02 — Finalize the logo and build all lockups

**When:** right after you choose a concept in B01 · **Time box:** 2 h
**Attach:** `B00_BRAND_BRIEF.md`, the chosen concept SVG
**Tool:** AI coding agent

## Goal
A production-ready logo system: mark, horizontal and stacked lockups, wordmark, mono and reversed versions, with usage rules.

## Prompt
~~~text
Read B00_BRAND_BRIEF.md. The chosen concept is brand/svg/concepts/<FILENAME>.svg (replace with the real file). Then do task B02. Plan first.

1. Refine the mark:
   - Redraw on a clean 512 grid with documented construction (put a brand/construction.svg showing the grid, circles and measurements).
   - Apply optical corrections (stroke weights consistent, round joins, balanced negative space, visual centring rather than mathematical centring).
   - Remove anything that vanishes at 16 px; thicken details until the 16 px render is clear.
2. Produce these files in brand/svg/ (all with viewBox, no <text>, no external references, recolourable via CSS variables with fallbacks):
   - mark.svg (colour), mark-mono-ink.svg, mark-mono-white.svg, mark-on-indigo.svg (reversed colours, for dark/indigo backgrounds)
   - wordmark.svg: the word "Dhaga" in Latin. Use Noto Sans (Bold or SemiBold) glyph outlines converted to paths with adjusted tracking; no live text.
   - logo-horizontal.svg: mark on the left, "Dhaga" large, and a smaller line beneath or beside it with "ધાગો · धागा" using real glyph outlines from Noto Sans Gujarati Bold and Noto Sans Devanagari Bold converted to paths.
   - logo-stacked.svg: mark above the wordmark; the three-script line below.
   - Variants of each lockup: colour, mono-ink, mono-white.
   To convert text to outlines use fontTools or opentype.js in a small script scripts/build-wordmark.mjs (ask before adding a dev dependency); commit the script so it's reproducible. Keep font files out of the repo unless their licence allows redistribution; record the font name, version and licence in brand/README.md.
3. Rules written into brand/README.md:
   - clear space = height of the mark's key detail (state exactly which part, e.g. the tick) on all sides
   - minimum sizes: mark 16 px (digital), logo-horizontal 120 px wide, logo-stacked 80 px wide; below these use the mark only
   - approved backgrounds (cream, white, indigo, night) and which version goes on which
   - don'ts with small visual examples: no stretching, no recolouring outside the palette, no shadows or outlines, no rotation, no busy photo backgrounds, no placing on low-contrast colours
   - colour values (hex) and the contrast ratio of each approved pairing
4. Update brand/preview.html to show every file on all four backgrounds, at minimum sizes and 2x, and the clear-space overlay.
5. Add a script scripts/check-brand.mjs that fails if any SVG in brand/svg: has width/height instead of viewBox, contains <text>, <image>, filters, gradients or external URLs, or is larger than 8 KB. Add npm run brand:check and include it in CI.

At the end, list anything you could not do (for example missing font outlines) and what I must do by hand.
~~~

## Acceptance checklist
- [ ] Mark, wordmark, horizontal and stacked lockups exist in colour, mono-ink, mono-white
- [ ] Gujarati and Hindi text are real font outlines, and a native speaker confirms they look right
- [ ] `npm run brand:check` passes in CI
- [ ] Mark is clear at 16 px
- [ ] `brand/README.md` has clear space, minimum sizes, and don'ts

## Commit
`feat(brand): final logo, lockups and usage guide`
