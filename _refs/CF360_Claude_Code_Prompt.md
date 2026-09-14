# CF360 — Build Prompt for Claude Code

> Copy everything below the line into Claude Code as your first message. It tells Claude Code what to build, which free tools to use, how to read the Figma design, and how to work in phases so nothing important is skipped. You do not need to be a developer to use this. Where a choice is needed, the prompt tells Claude Code to pick a sensible default and keep going.

---

## Role and goal

You are the lead full-stack engineer building **CF360**, an internal web app for Bajaj Finserv's video content team. CF360 takes a product brief and moves it through a pipeline: raise a request, write a brief, pick a format and template, generate a storyboard and validated prompt, generate a script, produce a video, get it reviewed, localise it into regional languages, publish it, and monitor performance.

The complete UI already exists as a Figma design. Your job is to turn it into a working, production-quality web application with a real database, authentication, file upload, and the core business logic. Build it end to end. When you hit a decision I have not specified, choose the simplest robust option, write it down in `DECISIONS.md`, and continue. Do not stop to ask me unless something is truly blocking.

## Who uses it (roles)

- **Request Raiser** (example user: Param Joshi): can view the pipeline and raise requests only.
- **Producer** (example user: Sushant Singh): full access to the whole pipeline (production, review, vernacular, publishing, monitoring).
- **Admin**: everything, plus user management.

Build role-based access from the start. A raiser must not see producer-only actions.

## The design (source of truth)

The design lives in Figma. Read it, do not invent your own layout.

- Figma file: `https://www.figma.com/design/2nnYV7FP3v9l0Bpv6qulhT/UX-Content-Creation`
- File key: `2nnYV7FP3v9l0Bpv6qulhT`
- Page: **CF360 — Rebuild**
- The page is organised into sections that map one to one to the app's navigation: `1 · Pipeline`, `2 · Pre-production`, `3 · Production`, `4 · Lead Review`, `5 · Vernacular`, `6 · Publishing`, `7 · Monitoring`, plus `Style Guide`, `Components` (reusable states), and `Draft` (ignore Draft, it is archived).

**How to read the design (do this first):**
1. If the Figma Dev Mode MCP server is available to you, connect to it and pull frames, auto-layout, variables, and the `Components` section directly. This is the most accurate path.
2. If not, ask me to export the frames as PNGs and the `Style Guide` frame, and I will provide them. Work from those plus the design tokens below.

Match spacing, type, and components to the Figma file. The design is built on an 8px grid with the Inter typeface, so keep to that.

## Design tokens (already defined, use these exactly)

Create these as the single source of truth (for example a `tokens.ts` and Tailwind theme). Do not hardcode colors anywhere else.

**Colors**
- primary `#2563EB`, primary-soft `#EFF4FF`
- text `#111827`, text-sub `#6B7280`, text-faint `#9CA3AF`
- border `#E5E7EB`, line `#EEF0F2`
- bg `#F9FAFB`, surface `#FFFFFF`
- success `#10B981`, success-soft `#E7F7F0`
- warning `#F59E0B`, warning-soft `#FEF6E7`
- danger `#EF4444`, danger-soft `#FDECEC`

**Type (Inter, even sizes, line-heights on the 8px grid)**
- display 24/32 bold, title 20/24 bold, heading 16/24 semibold
- label 14/16 medium, body 14/16 regular, body-relaxed 14/20, caption 12/16 regular

**Spacing / sizing**
- spacing scale: 4, 8, 16, 24, 32 (8px grid, 4 allowed as a half-step)
- radius: 8 (buttons, inputs), 10 (cards), 999 (pills)
- control height 40, top bar 56, side nav 240, content column 720

## Recommended tech stack (all free)

Use this stack unless you have a strong reason not to. It is well supported, free to start, and pairs cleanly with the design.

- **Framework:** Next.js (App Router) with **TypeScript**. This gives you the frontend and a backend (API routes) in one project, and deploys free on Vercel.
- **Styling:** **Tailwind CSS**, with the tokens above wired into `tailwind.config`. 
- **Icons:** **lucide-react** (the design already uses Lucide-style line icons, so these match).
- **Data fetching / server state:** **TanStack Query (React Query)**.
- **Forms and validation:** **react-hook-form** with **zod**.
- **Charts (Monitoring screen):** **Recharts**.

### Backend and database (pick one, all have a free tier)

Primary recommendation, because it gives you database + auth + file storage in one dashboard with almost no setup:

- **Supabase** — free Postgres database, built-in auth (email, magic link, OAuth), and file storage for videos and templates. Best all-in-one for this project. Use `@supabase/supabase-js`.

Good alternatives if you prefer:
- **Firebase** — free Firestore database, auth, and storage. Strong for file uploads.
- **PocketBase** — open source, a single file you run yourself; SQLite database + auth + file storage. Simplest to self-host, great if you want everything local first.
- **Neon** or **Xata** or **Turso** — free serverless SQL databases (pair with a separate auth and storage service).
- **Appwrite** — open source backend (database, auth, storage) with a free cloud tier.

**Default: use Supabase.** Put all keys in a `.env.local` file, never in the code. Create a `.env.example` listing every variable name (without values) so I know what to fill in.

### File and media storage

Videos, reference clips, and Adobe template files need storage. Use **Supabase Storage** (or Firebase Storage). For image or video transforms, **Cloudinary** has a free tier. Enforce the 10 MB upload limit that the UI shows, and reject anything larger with the Error upload state.

### Deploy (free)

Deploy the finished app to **Vercel** (native for Next.js). Netlify or Cloudflare Pages also work. Set up the free tier and give me the steps to connect it.

## Data model (create these tables)

Use snake_case columns. Adjust names if needed but keep the shape.

- **users**: id, name, email, role (`raiser` | `producer` | `admin`), avatar_url, created_at
- **requests**: id, cf_id (e.g. CF-12847), vid_id, product, category, landing_url, stage (`pipeline` | `pre_production` | `production` | `lead_review` | `vernacular` | `publishing` | `monitoring`), priority (`high` | `medium` | `low`), status_label, owner_id, created_at, updated_at
- **briefs**: id, request_id, product_info (json), seo_info (json), audio_intelligence (json), source (`auto_filled` | `manual`)
- **formats**: id, name, aspect_ratio (e.g. 9:16), duration_range, usage_guidelines (json), dos (json array), donts (json array)
- **templates**: id, format_id, name, specs (json: resolution, duration, editable_layers, text_slots, image_slots, brand_locked), reference_video_url, adobe_files (json array)
- **prompts**: id, request_id, text, scores (json), total_score, passed (bool), version, created_at
- **scripts**: id, request_id, beats (json array of {beat, visual, voiceover, duration}), regenerations_used (int, max 3)
- **assets**: id, request_id, file_url, duration_seconds, size_bytes, resolution, status (`generating` | `generated` | `failed`)
- **language_variants**: id, request_id, language, status (`master` | `ready` | `generating` | `queued` | `failed`), voiceover_url, duration_seconds
- **publications**: id, request_id, destination (e.g. homepage, video_wall, youtube, instagram), scheduled_at, status (`scheduled` | `published` | `failed`)
- **metrics**: id, request_id, variant_label, platform, views, ctr, watch_through, conversions, captured_at

Seed the database with realistic sample data that matches the Figma screens (Gold Loan campaign, CF-12847, the pipeline rows, the language variants, the monitoring numbers) so every screen has something to show on first run.

## Core business logic (implement exactly)

1. **Prompt validation score.** When a prompt is validated, score it out of 100 as a weighted sum:
   - Compliment 25%, Brand 20%, Hook 20%, Template 15%, USP 10%, Platform 10%.
   - A prompt **passes at 80% or above**. Only a passing prompt can move forward to script generation. Store each sub-score and the total.
2. **Script regeneration limit.** A script can be regenerated a maximum of 3 times. Track `regenerations_used` and disable the button at the limit.
3. **Role gating.** Raisers can create and view requests only. Producers can act on every stage. Enforce this on the server (API), not just by hiding buttons.
4. **Upload state machine.** File upload moves Default to Uploading to Success, with an Error branch for oversize or failed uploads. The design already has this as a 4-state component; wire the real states to it.
5. **Publish success and error.** When a video publishes, show the Success **toast** ("Published successfully"). If any destination fails, show the Error toast and let the user retry.
6. **Stage transitions.** Advancing a request updates its `stage` and its progress. The stepper in the UI reflects the current stage.

## Components to build (match the Figma Components section)

Build a small, reusable component library first, then compose screens from it. At minimum: Button (primary, secondary, ghost, soft; sizes 40 default), Tag / status pill (success, warning, danger, blue, gray), Input and read-only field, Card, Side nav item, Top bar, Stepper, Table, **Toast** (success, error, warning, info), and **File Upload** (default, uploading, success, error). The Toast and Upload components already exist in the Figma `Components` section as variant sets, with their state props; mirror those props in code.

## Screens to build (in navigation order)

1. **Pipeline** — request table with filters (All, In Progress, Lead Review, Published), search, priority and stage tags, and a "Raise a Request" button that opens the Choose Workflow drawer.
2. **Choose Workflow** (drawer) — New Video Brief or Bulk Video Brief.
3. **CF360 Brief** — auto-filled Product Information, SEO Information, Audio and Intelligence; Accept and Continue.
4. **Format Selection** — format library grid; each format opens a Format Details drawer (reference video, Adobe template files, specs, usage guidelines, dos and donts).
5. **Template Selection** — template library grid.
6. **Storyboarding and Prompts** — master prompt editor and a Validation Score card that runs the scoring logic above.
7. **Script Generation** — editable script table (beats, visuals, voiceover, duration), regenerate (max 3).
8. **Production** — Video Generation and Generated Video states, then Send to Lead Review.
9. **Lead Review** — video preview, Auto QA checklist, reviewer notes, Approve or Request Changes.
10. **Vernacular** — language variants table with per-language status.
11. **Publishing** — destination toggles with schedule, Publish Now (fires the success toast).
12. **Monitoring** — KPI stat cards and a top-performing-variants table with a chart.
13. **Bulk Brief** — upload a sheet (uses the File Upload component), preview parsed rows, generate briefs in bulk.

## Build in phases (do them in order, commit after each)

1. **Setup.** Create the Next.js + TypeScript + Tailwind project. Wire the tokens into Tailwind. Add lucide-react. Set up `.env.example`. Initialise git.
2. **Backend.** Create the Supabase project, the tables above, storage buckets, and row-level security matching the roles. Add the seed data. Generate typed database clients.
3. **Auth.** Email or magic-link login, a session, and the three roles. A simple role switcher for demo is fine.
4. **Component library.** Build the shared components from the Figma `Components` and `Style Guide` sections. Verify against the tokens.
5. **Screens.** Build the screens in navigation order, wiring each to real data from the database. Reproduce the Figma layout faithfully.
6. **Business logic.** Prompt scoring, regeneration limit, upload state machine, stage transitions, publish success and error toasts, role gating on the API.
7. **Polish and deploy.** Loading and empty states, error handling, responsive behaviour, then deploy to Vercel and give me the URL and the steps to run it locally.

## Definition of done (acceptance criteria)

- Every screen in the navigation renders with real data from the database, not hardcoded mock JSX.
- Colors, type, spacing, and radii match the tokens exactly; no stray hex values.
- A raiser account cannot perform producer-only actions (checked on the server).
- Validating a prompt computes the weighted score and blocks progress below 80%.
- Uploading a file shows Default to Uploading to Success, and rejects files over 10 MB with the Error state.
- Publishing shows the Success toast; a simulated failure shows the Error toast with retry.
- The app runs locally with `npm install` then one start command, using only the values in `.env.example`.
- `README.md` explains setup, environment variables, and how to run and deploy. `DECISIONS.md` lists every choice you made on my behalf.

## What I will provide when you ask

- Access to the Figma file (or exported PNGs of each frame and the Style Guide).
- My Supabase project keys once you tell me exactly which variables to create, or I will let you create the project and paste the keys into `.env.local` following your instructions.

## Ground rules

- Keep secrets in `.env.local`; never commit them.
- Prefer clarity over cleverness; I am not a developer and will read your code and notes.
- Small, frequent commits with clear messages.
- If a free-tier limit or a missing key blocks you, write the exact step I need to take in `SETUP_TODO.md` and keep building everything else.

Start with Phase 1 now. Confirm the stack you are using in one short paragraph, then begin.
