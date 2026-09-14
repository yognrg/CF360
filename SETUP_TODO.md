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

## Optional — deploy to Vercel

1. Push this repo to GitHub.
2. Import it at https://vercel.com/new.
3. Add the same env vars from `.env.local` in the Vercel project settings.
4. Deploy. (Use the Supabase swap above first, or writes won't persist between
   requests on Vercel.)
