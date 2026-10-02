# SilaiBook

Piece-rate payroll app for garment units (tailors + managers), India.

## Tech Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend/DB/Auth:** Supabase (Postgres + Auth + Row Level Security)
- **i18n:** next-intl (English, ગુજરાતી, हिन्दी)
- **Charts:** Recharts
- **Testing:** Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Supabase project (free tier is fine)

### Setup

1. Clone this repo:
   ```bash
   git clone <repo-url>
   cd silaibook-kit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase project URL and anon key.

4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run format` | Format code with Prettier |

## Project Structure

```
silaibook-kit/
├── app/
│   ├── [locale]/        # Locale-based routing (en, gu, hi)
│   │   ├── layout.tsx   # Locale layout with NextIntlClientProvider
│   │   └── page.tsx     # Home page
│   ├── globals.css      # Global styles
│   └── layout.tsx       # Root layout
├── components/          # Reusable UI components
├── docs/                # Architecture docs
├── i18n/                # Internationalisation config
│   ├── request.ts       # next-intl request config
│   └── routing.ts       # Supported locales
├── lib/
│   ├── date.ts          # Date utilities (date-fns wrappers)
│   ├── money.ts         # Money utilities (integer paise)
│   ├── money.test.ts    # Money unit tests
│   └── supabase/        # Supabase client (browser + server)
├── messages/            # i18n message files
│   ├── en.json          # English
│   ├── gu.json          # Gujarati
│   └── hi.json          # Hindi
├── supabase/
│   └── migrations/      # Database migrations
├── .env.example         # Environment variable template
├── middleware.ts         # next-intl middleware
└── vitest.config.ts     # Test configuration
```

## Core Rules

1. Money is always stored as **integer paise** (1 INR = 100 paise). Never use floats.
2. Only **verified** entries count in salary calculations.
3. UI in **English, Gujarati, Hindi**. No hard-coded text strings.
