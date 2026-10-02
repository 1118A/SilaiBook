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