# 04 — Verification Workflow
**Task:** Manager approves or rejects pending entries with a single tap.
**Requirements:**
- "To verify" inbox grouped by tailor and day, with count badge.
- Big green Yes / red No buttons; swipe on mobile; bulk "Verify all for this tailor/day".
- Rejection requires a short reason (preset chips + free text); tailor sees the reason and can resubmit.
- Manager-entered entries are auto-verified (configurable).
- Verified entries are read-only unless the month is reopened; every change goes to `audit_log`.
- Optional notification: in-app badge now; WhatsApp/SMS only later.
**Done when:** only verified entries appear in salary totals; rejected ones show a reason to the tailor; audit log shows who did what.
