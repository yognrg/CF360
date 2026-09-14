# CF360 — Content Factory 360

An internal web app for Bajaj Finserv's video content team. CF360 moves a product
brief through a pipeline: **raise a request → write a brief → pick a format &
template → generate a storyboard & validated prompt → generate a script → produce
a video → lead review → localise into regional languages → publish → monitor.**

Built from the Figma design `UX-Content-Creation / CF 360`.

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. On first run the app creates a local data store
and seeds realistic sample data (the Gold Loan campaign, request CF-12847,
language variants, monitoring numbers), so every screen has content immediately.

No accounts, keys, or external services are needed to run locally. See
`SETUP_TODO.md` for optional cloud/deploy steps.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS 3, driven by design tokens (`src/tokens.ts`) |
| Icons | lucide-react |
| Server state | TanStack Query |
| Forms & validation | react-hook-form + zod |
| Charts | Recharts |
| Data | Local JSON document store (`.data/`) behind a typed repository |
| Auth | Signed-cookie demo session, 3 roles, role switcher |

See `DECISIONS.md` for why these were chosen (notably the local-first data store
instead of cloud Supabase).

## Roles

- **Request Raiser** — view the pipeline and raise requests only.
- **Producer** — full access to every pipeline stage.
- **Admin** — everything, plus user management.

Role gating is enforced on the server (API routes), not just by hiding buttons.
Use the role switcher in the top bar to demo each role.

## Environment variables

Copy `.env.example` to `.env.local`. Every variable has a working default, so
this is optional for local use. Variables are documented in `.env.example`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (seeds data on first run) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |

## Project structure

```
src/
  app/            Next.js routes (screens) + API routes
  components/
    ui/           Reusable component library (Button, Tag, Card, Toast, Upload…)
  lib/
    db/           Local data store + typed repository (the swappable data layer)
    types.ts      Domain model
  tokens.ts       Design tokens — the single source of truth
```

## Documentation

- `DECISIONS.md` — every choice made on your behalf.
- `SETUP_TODO.md` — optional cloud database & deploy steps.
