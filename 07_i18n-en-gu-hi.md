# 07 — Multilingual: English, ગુજરાતી, हिन्दी
**Task:** Full i18n with a language switcher everywhere.
**Requirements:**
- next-intl routes `/en`, `/gu`, `/hi`; per-user saved language; first-visit default from browser, with a visible switch on the login screen.
- All UI strings in `messages/*.json`; no hard-coded text. Use ICU plurals.
- Numbers/dates/currency via `Intl` (₹, Indian digit grouping). Optional toggle for Gujarati/Devanagari numerals.
- Fonts: Noto Sans Gujarati and Noto Sans Devanagari (self-hosted via next/font) with fallbacks; check line height so scripts don't clip.
- Use simple, shop-floor vocabulary (e.g., "પીસ", "પગાર", "लॉट"); have a native tailor or manager review translations.
- Add an icon-first design for key actions so low-literacy users still succeed.
- Pseudo-localisation test for layout overflow.
**Done when:** every screen is usable in all 3 languages with no truncated or overlapping text.
