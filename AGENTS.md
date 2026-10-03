# SilaiBook — standing rules for all agents
Product: piece-rate payroll app for garment units (tailors + managers), India.
Read ./silaibook-kit/00_MAIN.md before any task. Do not change the stack or
core rules without asking me.

1. Build one task file at a time, in order (01 to 10). Do only the file I name.
2. Give a short plan before writing code.
3. Money = integer paise, never floats. Only verified entries count in salary.
4. All UI in English, Gujarati, Hindi. No hard-coded text.
5. Simple UI, big touch targets, for low-tech users on cheap Android phones.
6. After each task: run lint + tests, report against the file's "Done when"
   list, and list anything unfinished.
7. Never put secrets in code. Use .env.local and keep .env.example updated.
8. If unclear, ask. Do not guess.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
