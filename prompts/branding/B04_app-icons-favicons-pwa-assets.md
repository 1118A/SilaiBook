# B04 — App icons, favicon, PWA assets and social image

**When:** after B02 · **Time box:** 2 h
**Attach:** `B00_BRAND_BRIEF.md`, `brand/svg/mark.svg`
**Tool:** AI coding agent

## Goal
Every icon file browsers, Android, iOS and social apps ask for, generated from one SVG by a repeatable script.

## Assets to produce

| File (in `app/public/`) | Size | Notes |
|---|---|---|
| `favicon.svg` | vector | Mark only; uses an internal `prefers-color-scheme` media query so it stays visible in dark browser tabs |
| `favicon.ico` | 32×32 (and 16×16 inside) | Fallback for older browsers |
| `apple-touch-icon.png` | 180×180 | Opaque background (indigo), mark centred with generous padding; iOS rounds the corners itself |
| `icons/icon-192.png`, `icons/icon-512.png` | 192, 512 | "any" purpose, transparent or indigo background per brand rules |
| `icons/maskable-512.png` (and 192) | 512 | Full-bleed indigo background; the mark must sit inside the central safe zone (a circle of 80% of the canvas diameter, so it survives circle/squircle masks) |
| `icons/monochrome.svg` (optional) | vector | Single-colour shape for Android themed icons if you wrap with Capacitor later |
| `og-image.png` | 1200×630 | Social share preview: cream background, logo-horizontal, tagline, three scripts |
| `logo-horizontal.svg` | vector | Copy for use in the app |
| Play Store icon (later) | 512×512 | Needed only if you publish a wrapped app |

## Prompt
~~~text
Read B00_BRAND_BRIEF.md and brand/README.md. Then do task B04. Plan first.

1. Write scripts/build-brand-assets.mjs that reads brand/svg/*.svg and generates every file in the table above into app/public/ (ask before adding a dev dependency such as sharp or a PWA assets generator; propose the lightest option and explain the choice). The script must be deterministic and runnable with npm run brand:assets. Also write the generated file list to brand/exports/MANIFEST.txt with dimensions.
2. favicon.svg: include <style> with @media (prefers-color-scheme: dark) switching the colours so the mark remains visible on dark tab strips.
3. Maskable icons: place the mark within the central 80% safe zone on a full-bleed indigo square (#2B3A8C). Add a test that renders the maskable icon through a circle mask and a rounded-square mask and fails if any non-background pixels fall outside the safe zone.
4. Update index.html <head>: favicon links (svg + ico), apple-touch-icon, theme-color (#2B3A8C light; add a dark variant via media attribute), og:title, og:description, og:image, twitter:card, and description in the default language.
5. Update the web app manifest (vite-plugin-pwa config): name "Dhaga", short_name "Dhaga", icons listed with separate entries for purpose "any" and purpose "maskable" (do not combine them in one "any maskable" entry), theme_color, background_color #FBF6EC, display "standalone", start_url "/", lang "gu" with additional localized names if supported.
6. og-image.png: 1200x630, cream background, logo-horizontal on the left, the tagline in the three scripts rendered from font outlines (not live text), safe margins 64px. Also output a 600x315 version.
7. Add tests: all files exist, dimensions match the table, manifest icons resolve, maskable safe zone test passes, favicon.svg parses.
8. Document in docs/brand-assets.md how to regenerate, and how to check on a device.
~~~

## Verify yourself
1. Chrome DevTools → Application → Manifest: no warnings; icons all load; "Installability" passes.
2. Install the PWA on an Android phone: the home-screen icon is not cropped, not blurry, and not blank white.
3. Paste maskable-512.png into a maskable-icon preview tool (for example maskable.app) and try all shapes.
4. Check the tab icon in light and dark browser themes.
5. Share the URL in WhatsApp or a link-preview tester; confirm the preview image appears (link previews can be cached, so test with a fresh URL if needed).

## Acceptance checklist
- [ ] `npm run brand:assets` regenerates everything identically
- [ ] Manifest shows separate "any" and "maskable" icons, no console warnings
- [ ] Installed icon looks right on a real Android phone
- [ ] Safe-zone test passes
- [ ] Social preview works

## Commit
`feat(brand): favicon, pwa icons, social image and asset pipeline`
