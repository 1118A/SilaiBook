# 03 — Piece Entry & Lots
**Context:** Users are busy and often low-tech; entry must take under 10 seconds.
**Task:** Build entry screens and lot/operation/tailor management.
**Requirements:**
- Quick-entry screen: pick tailor (manager) → lot → operation (rate auto-fills, editable by manager) → pieces via big number pad → Save. "Repeat last entry" button.
- Tailor view: only own entries; today's total shown large.
- Manager CRUD for tailors, lots, operations (with default rates). Archive instead of delete.
- Entry list with filters: date range, tailor, lot, status.
- Lot page: total pieces target vs done, remaining, % complete.
- Validate with zod; friendly errors in the user's language.
**Done when:** entering 35 pieces at ₹33 stores 115500 paise rate-snapshot math correctly (35×3300) and shows ₹1,155 in the list; lot progress updates.
