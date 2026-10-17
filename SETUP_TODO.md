# SETUP_TODO.md

Things **you** need to do (or may optionally do). The app runs without any of
these — they are for going beyond the local demo.

## Nothing required to run locally ✅

The app boots with zero setup:

```bash
npm install
npm run dev
```

Then open http://localhost:3000. On first run it creates `.data/` and seeds the
Gold Loan campaign, the CF-12847 request, language variants, and monitoring
numbers so every screen has content.

## Optional — move to a real cloud database (for a shared/production deploy)

The local JSON store is perfect for a demo but not for a multi-user Vercel
deploy (serverless disks are read-only). To switch to Supabase:

1. Create a free project at https://supabase.com.
2. In the project's **SQL editor**, run the schema in `supabase/schema.sql`
   (generated to match `src/lib/types.ts`) — *(added in the backend phase).*
3. Copy your keys into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Reimplement `src/lib/db/store.ts` against `@supabase/supabase-js`
   (the repository interface stays the same — screens/APIs don't change).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at https://vercel.com/new (Vercel auto-detects Next.js — no config).
3. (Optional) Add env vars from `.env.example` in the Vercel project settings.
   None are required; all have working defaults.
4. Deploy.

**How data behaves on Vercel:** the app detects the read-only serverless
filesystem and keeps its JSON store in the OS temp dir. It seeds on first hit,
so every screen shows data. Writes (raise a request, validate, publish, …)
persist for the life of a *warm* instance and reset on a cold start or across
instances. That's great for a live portfolio demo. For durable, shared
persistence across all visitors, do the Supabase swap above.
