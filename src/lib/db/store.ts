/**
 * Local JSON-file data store. This is the ONLY module that touches the
 * filesystem — the whole app talks to the repository in ./index.ts, which
 * talks to this. Swapping to Supabase/Postgres means reimplementing this file
 * and index.ts; nothing else changes. (See DECISIONS.md D1.)
 *
 * Server-only. Never import from a client component.
 */
import fs from "node:fs";
import path from "node:path";
import type { Database } from "@/lib/types";
import { buildSeed } from "./seed";

const DATA_DIR = path.resolve(
  process.cwd(),
  process.env.CF360_DATA_DIR || ".data",
);
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
