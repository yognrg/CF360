# DECISIONS.md

Every choice made on your behalf, with the reasoning. Newest first.

## D7 — Publishing has a "Simulate a channel failure" demo toggle

The Publishing screen includes a small checkbox that forces one channel to fail,
so the required Error toast + Retry flow can be demonstrated on demand. On retry
it publishes successfully. Without it, every publish would always succeed and the
error branch would be unreachable in a demo.

## D6 — Stage screens focus on one "active request" (CF-12847)

The Figma walkthrough shows CF-12847 (Gold Loan) on every stage screen. So the
stage screens (Pre-production → Monitoring) all operate on that active request,
which is seeded with data in every table. Advancing a stage (Send to Lead Review,
Approve, Publish, …) really updates the request's `stage` via the API, so the
pipeline tag and the context bar reflect it. A per-request routing scheme
(`/requests/[id]/…`) would be the next step for a multi-request production build.

## D5 — Prompt score is the computed weighted sum, not the Figma mock's number

The Figma Storyboarding frame shows "82% · Pass" alongside sub-scores
(Compliment 92, Brand 85, Hook 80, Template 78, USP 88, Platform 90). Those
sub-scores, run through the **required** weighting (Compliment 25%, Brand 20%,
Hook 20%, Template 15%, USP 10%, Platform 10%), actually total ~86%. The mock's
"82%" is illustrative and inconsistent with its own sub-scores. Per the brief
("implement exactly" the weighted formula), the app shows the **computed** total,
so you may see 86% where the mock said 82%. The pass threshold (80%) is identical.
Editing the prompt and re-validating recomputes the score from the text.

## D1 — Local-first SQLite/JSON data store instead of cloud Supabase

**Decision:** Use a local, file-backed data store (JSON documents under `.data/`,
accessed through one typed repository module) with cookie-based demo auth and
local file storage, instead of cloud Supabase.

**Why:** The acceptance criteria require the app to *"run locally with `npm install`
then one start command, using only the values in `.env.example`."* Cloud Supabase
cannot meet that for a non-developer — it needs a Supabase account, a created
project, and pasted keys before anything runs. A local store means the app boots
and seeds itself with zero external setup.

**Containment:** All data access goes through `src/lib/db/*`. Swapping to
Supabase/Postgres later means reimplementing that one module — screens and API
routes don't change. The swap steps are in `SETUP_TODO.md`.

**Trade-off:** A local file store is not suitable for a multi-user production
deploy on Vercel (serverless filesystems are read-only/ephemeral). For production
persistence, follow the Supabase swap in `SETUP_TODO.md`.

## D2 — `better-sqlite3` avoided in favour of a JSON document store

**Decision:** Use a JSON-file store rather than an embedded SQL engine.

**Why:** `better-sqlite3` is a native addon that compiles against your Node
version. This machine runs Node 21 (non-LTS), for which prebuilt binaries are
often unavailable, forcing a source build that needs Visual Studio C++ build
tools. That is a fragile first-run experience for a non-developer. A JSON store
has no native build step and runs identically on any OS/Node.

## D3 — Next.js 14 + Tailwind 3 (not the newest majors)

**Decision:** Pin Next.js 14.2 and Tailwind CSS 3.4.

**Why:** Tailwind 4 moves configuration into CSS and drops the `tailwind.config`
file the brief expects; Next 15 + React 19 are newer than much of the ecosystem.
The pinned versions are the most stable pairing for a token-driven design system
and the listed libraries.

## D4 — Demo auth with a role switcher

**Decision:** Sign-in picks one of the three seeded users (raiser / producer /
admin); a role switcher in the top bar swaps the active user for demos. The
session is a signed HTTP-only cookie.

**Why:** The brief explicitly allows "a simple role switcher for demo." Role
gating is still enforced on the server (API routes check the session's role), so
a raiser genuinely cannot perform producer actions.
