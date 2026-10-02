# 09 — PWA, Offline & Reports
**Task:** Make it installable, resilient, and shareable.
**Requirements:**
- Web manifest, icons, install prompt; service worker for app shell caching.
- Offline entry queue in IndexedDB; sync with idempotency keys to avoid duplicates; show "pending sync" state.
- Conflict rule: server wins on verified rows; client edits to verified rows are refused with a message.
- PDF salary slips (language-aware fonts embedded) and CSV exports; Share button for WhatsApp via Web Share API.
- Basic data backup export for owners.
**Done when:** airplane-mode entries sync correctly after reconnect with zero duplicates; slips render Gujarati/Hindi correctly.
