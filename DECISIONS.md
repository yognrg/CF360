# DECISIONS.md

Every choice made on your behalf, with the reasoning. Newest first.

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
