# B00 — BRAND BRIEF (attach to every branding prompt)

## How to use the branding set

| File | What it produces | Tool |
|---|---|---|
| `B00_BRAND_BRIEF.md` | Shared facts and rules (this file) | — |
| `B01_logo-concepts-svg.md` | Three original logo mark directions as clean SVG | AI coding agent |
| `B02_logo-finalize-and-lockups.md` | The chosen logo, polished, with all lockups | AI coding agent |
| `B03_icon-set-svg.md` | A consistent custom icon set + React component | AI coding agent |
| `B04_app-icons-favicons-pwa-assets.md` | Favicon, PWA/Android/iOS icons, social image, build script | AI coding agent |
| `B05_ai-image-generator-prompts.md` | Text prompts for image generators (inspiration, illustrations) | Any image generator |
| `B06_integrate-brand-in-app.md` | Logo and icons placed across the app | AI coding agent |

**Recommended order:** B05 (optional inspiration) → B01 → pick one → B02 → B03 → B04 → B06.
**Why SVG built by an agent instead of an image generator?** SVG is crisp at every size, tiny in file size, recolourable for dark mode, and editable. Image generators produce pixels, often with flawed shapes and unreliable Gujarati/Hindi text. Use them for ideas, then redraw cleanly.

---

## Brand facts

- **Working name:** Dhaga — ધાગો (Gujarati), धागा (Hindi); means "thread". *This is a placeholder.* Before you invest in the identity, search the name in the Indian trade mark registry, on Google Play, and on the web for existing products in textiles or software. If it clashes, pick another name and rerun these prompts; nothing else needs to change.
- **Promise (tagline ideas, pick one after testing with users):** "Every piece counted. Every rupee clear." / "દરેક પીસની ગણતરી" / "हर पीस का हिसाब".
- **Audience:** garment-unit managers and tailors in Gujarat and nearby markets; many read little; cheap Android phones.
- **Personality:** trustworthy, warm, hands-on, precise. A craft-and-ledger feeling, not corporate tech, not startup-glossy.
- **Core ideas to draw from:** the thread, the needle's eye, the bundle ticket with notched edges, the running stitch (dashed line), the tick that confirms.
- **Colours:** indigo `#2B3A8C` (primary), turmeric `#E9A21B` (accent), cloth `#FBF6EC` (background), ink `#1F2340` (text), leaf `#2E7D4F` (yes), madder `#B3382A` (no). Dark mode variants are in `DESIGN_BRIEF.md`.
- **Scripts the brand must show:** Latin, Gujarati, Devanagari.

## Hard rules for every branding task

1. **Original work only.** The mark must not imitate any existing logo, mascot, or app icon. Do not reproduce or "get close to" a known brand. If a result reminds you of something, change it.
2. **No lettering invented from scratch for Gujarati/Hindi.** Use real font glyphs (for example Noto Sans Gujarati / Noto Sans Devanagari, bold) converted to outlines. Hand-drawn Indic letterforms are easy to get subtly wrong and look unprofessional to native readers.
3. **No religious or sacred symbols, no hands/faces, no flags.**
4. **Few shapes.** The mark must be recognisable at 16 px and drawn with simple geometry.
5. **Colour limit:** at most 2 brand colours plus ink; must also work in one colour (all-ink and all-white).
6. **No gradients, shadows, glows, or blur** inside the logo and icons.
7. **Licences:** only fonts and tools whose licences allow commercial use (Noto fonts are under the SIL Open Font License — verify the current licence text for each file you ship). If you use an AI image generator for ideas, read its terms on commercial use and ownership.
8. **Accessibility:** logo on its approved backgrounds meets AA contrast (3:1 minimum for graphics; text parts 4.5:1). Measured pairs from the palette:
   - indigo on cream 9.3:1 ✔, ink on cream 14.2:1 ✔, turmeric on indigo 4.6:1 ✔
   - **turmeric on cream or white is only 2.0:1 ✘** — so turmeric may be a *decorative accent only* on light backgrounds. The shape that carries the meaning (needle, ticket outline, tick) must be indigo or ink. Turmeric can carry meaning only on indigo or night backgrounds.
   - **indigo on night (#14172B) is only 1.8:1 ✘** — on dark backgrounds always use the reversed version (cloth/white shapes, gold accent), never the indigo version.
   - dark-mode accent `#8E9BFF` on night is 7.0:1 ✔

## Tests every mark must pass

- **16 px test:** still identifiable as a favicon.
- **Squint test:** blur the image; the main shape still reads.
- **One-colour test:** all ink, and all white on indigo.
- **Mask test:** inside a circle and a rounded square (Android/iOS app icon) with no cropping of key parts.
- **Four backgrounds:** cream `#FBF6EC`, white, indigo `#2B3A8C`, night `#14172B`.
- **Distance test:** show it for 2 seconds to someone; ask them to describe it. If they can't, simplify.

## Deliverable folder layout

```
brand/
  README.md                 usage rules, clear space, min sizes, don'ts
  svg/
    mark.svg                icon only (colour)
    mark-mono-ink.svg
    mark-mono-white.svg
    logo-horizontal.svg     mark + Dhaga + ધાગો · धागा
    logo-stacked.svg
    wordmark.svg
  icons/                    custom icons (svg), one file per icon
  exports/                  generated PNG/ICO (git-ignored or committed, your choice)
  preview.html              static page showing everything on all backgrounds
```
App icons for the web go to `app/public/` (B04 handles it).
