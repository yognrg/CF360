/**
 * Local JSON-file data store. This is the ONLY module that touches the
 * filesystem — the whole app talks to the repository in ./index.ts, which
 * talks to this. Swapping to Supabase/Postgres means reimplementing this file
 * and index.ts; nothing else changes. (See DECISIONS.md D1.)
 *
 * Server-only. Never import from a client component.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Database } from "@/lib/types";
import { buildSeed } from "./seed";

/**
 * Pick a writable data directory.
 * - Explicit CF360_DATA_DIR always wins.
 * - On serverless hosts (Vercel/AWS Lambda) the project filesystem is
 *   READ-ONLY, so fall back to the OS temp dir. Data lives for the life of a
 *   warm instance and re-seeds on a cold start — fine for a live demo. For
 *   durable, shared persistence, swap the store to Postgres (see SETUP_TODO.md).
 * - Otherwise use a local `.data` folder next to the project.
 */
function resolveDataDir(): string {
  if (process.env.CF360_DATA_DIR) {
    return path.resolve(process.cwd(), process.env.CF360_DATA_DIR);
  }
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) return path.join(os.tmpdir(), "cf360-data");
  return path.resolve(process.cwd(), ".data");
}

const DATA_DIR = resolveDataDir();
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function ensureSeeded() {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    const seed = buildSeed();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf-8");
  }
}

/** Read the entire database. */
export function readDb(): Database {
  ensureSeeded();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw) as Database;
}

/** Persist the entire database (atomic: write temp then rename). */
export function writeDb(db: Database): void {
  ensureDir();
  const tmp = path.join(DATA_DIR, `db.${process.pid}.tmp`);
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tmp, DB_FILE);
}

/**
 * Read-modify-write helper. The mutator receives the live db object, mutates
 * it, and optionally returns a value to hand back to the caller.
 */
export function mutate<T>(fn: (db: Database) => T): T {
  const db = readDb();
  const result = fn(db);
  writeDb(db);
  return result;
}

/** Test/dev helper: wipe the store so it re-seeds on next read. */
export function resetDb(): void {
  if (fs.existsSync(DB_FILE)) fs.rmSync(DB_FILE);
  ensureSeeded();
}
