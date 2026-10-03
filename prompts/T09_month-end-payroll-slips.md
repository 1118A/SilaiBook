# T09 — Month-end payroll, adjustments, slips, export

**Day:** 5 · **Time box:** 5 h · **Depends on:** T02, T07, T08
**Attach:** `CONTEXT.md`, `DESIGN_BRIEF.md` (Slip component), system design section 3

## Goal
One calm screen where the manager reviews, closes the month, and shares each tailor's salary slip. Numbers must match a hand calculation exactly.

## Prompt
~~~text
Read CLAUDE.md and DESIGN_BRIEF.md. Then do task T09. Plan first.

1. Adjustments (/manager/adjustments): add advance (upad), deduction or bonus per tailor per month with a note; list and delete (only before the month is closed). Amounts in paise via lib/money.ts.
2. Month-end screen (/manager/month-end):
   - month picker (default previous month if today is within the first 5 days, else current)
   - warning panel at the top if any entries are still pending/disputed, listing counts per tailor with links to fix them
   - table/tickets per tailor: pieces, gross, bonuses, deductions, net
   - totals row; "Net may not be negative" rule: if advances exceed gross, show a clear warning and carry-over choice (v1: just warn; do not auto carry over)
   - Preview must use the same lib/payroll.ts as the database function so they agree; add a test that compares both on a fixture.
3. Close month: a confirmation dialog stating what will be locked. Calls close_month. If pending entries remain, the manager must explicitly choose "exclude pending entries" (force_exclude_pending) and the excluded list is saved in the audit log. After closing: the month is read-only everywhere (UI and database).
4. Salary slip: a Slip component (see DESIGN_BRIEF) with unit name, tailor name and code, month, table of operations (pieces, rate, amount), gross, adjustments, net, and a footer line. Render to an image (use a small library such as html-to-image only after asking me) and share via the Web Share API with the file; fallback: download. Slip text follows the tailor's language. Make sure Gujarati and Hindi glyphs render in the exported image (fonts embedded).
5. "Share all slips": generate a slip image per tailor, offer sharing one by one; also a single PDF/print view of all slips.
6. CSV export for the accountant: UTF-8 with BOM so Excel shows Gujarati/Hindi names correctly; columns: worker code, name, pieces, gross, bonus, deduction, net, month. Amounts in rupees with two decimals, produced from paise without float math.
7. Tailors see their closed-month slip in /tailor/history.
8. Tests with a hand-calculated fixture: 3 tailors, a mid-month rate change, one advance, one bonus, one disputed entry excluded. Check totals to the paisa. Test that editing any entry in a closed month fails. Test CSV encoding.

Show me the fixture and the hand calculation in the test file as comments so I can verify them myself.
~~~

## Acceptance checklist
- [ ] Closed month totals equal your own spreadsheet calculation to the paisa
- [ ] Pending entries cannot be silently dropped
- [ ] Locked month is immutable (try to edit via the UI and via the API)
- [ ] Slip images look good on WhatsApp in all three languages (check Gujarati and Hindi glyphs!)
- [ ] CSV opens correctly in Excel with Gujarati names

## Commit
`feat(payroll): adjustments, month close, slips and csv export`
