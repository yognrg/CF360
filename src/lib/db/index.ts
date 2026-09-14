/**
 * Repository — the typed data-access layer used by server components and API
 * routes. Everything above this line is storage-agnostic: only ./store.ts knows
 * it's a JSON file. To move to Supabase, reimplement these functions.
 */
import { mutate, readDb } from "./store";
import { computeTotal } from "@/lib/scoring";
import { STAGE_ORDER } from "@/lib/types";
import type {
  Brief,
  Format,
  LanguageVariant,
  Metric,
  MonitoringKpi,
  Priority,
  Prompt,
  PromptScores,
  Publication,
  Request,
  Script,
  ScriptBeat,
  Stage,
  Template,
  User,
} from "@/lib/types";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

// ── Users ────────────────────────────────────────────────────────────────────
export function listUsers(): User[] {
  return readDb().users;
}
export function getUser(id: string): User | undefined {
  return readDb().users.find((u) => u.id === id);
}

// ── Requests ─────────────────────────────────────────────────────────────────
export type RequestFilter = "all" | "in_progress" | "lead_review" | "published";

export function listRequests(filter: RequestFilter = "all"): Request[] {
  const rows = readDb().requests.slice().sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at),
  );
  switch (filter) {
    case "lead_review":
      return rows.filter((r) => r.stage === "lead_review");
    case "published":
      return rows.filter(
        (r) => r.stage === "publishing" || r.stage === "monitoring",
      );
    case "in_progress":
      return rows.filter(
        (r) => r.stage !== "publishing" && r.stage !== "monitoring",
      );
    default:
      return rows;
  }
}

export function getRequest(id: string): Request | undefined {
  return readDb().requests.find((r) => r.id === id);
}

/** The "active" request the stage screens focus on (the Gold Loan walkthrough). */
export function getActiveRequest(): Request {
  const db = readDb();
  return db.requests.find((r) => r.id === "r_12847") ?? db.requests[0];
}

export interface NewRequestInput {
  product: string;
  category: string;
  landing_url: string;
  priority: Priority;
  format_name?: string | null;
  owner_id: string;
}

export function createRequest(input: NewRequestInput): Request {
  return mutate((db) => {
    const maxCf = db.requests.reduce((max, r) => {
      const n = Number(r.cf_id.replace(/\D/g, ""));
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 12847);
    const cfNum = maxCf + 1;
    const now = new Date().toISOString();
    const req: Request = {
      id: uid("r"),
      cf_id: `CF-${cfNum}`,
      vid_id: `VID-${24601 + (cfNum - 12847)}`,
      product: input.product,
      category: input.category,
      landing_url: input.landing_url,
      stage: "pre_production",
      priority: input.priority,
      status_label: "In Progress",
      format_name: input.format_name ?? null,
      owner_id: input.owner_id,
      created_at: now,
      updated_at: now,
    };
    db.requests.unshift(req);
    return req;
  });
}

export function advanceStage(id: string): Request | undefined {
  return mutate((db) => {
    const req = db.requests.find((r) => r.id === id);
    if (!req) return undefined;
    const idx = STAGE_ORDER.indexOf(req.stage);
    if (idx < STAGE_ORDER.length - 1) req.stage = STAGE_ORDER[idx + 1];
    req.updated_at = new Date().toISOString();
    return req;
  });
}

export function setStage(id: string, stage: Stage): Request | undefined {
  return mutate((db) => {
    const req = db.requests.find((r) => r.id === id);
    if (!req) return undefined;
    req.stage = stage;
    req.updated_at = new Date().toISOString();
    return req;
  });
}

// ── Briefs ───────────────────────────────────────────────────────────────────
export function getBrief(requestId: string): Brief | undefined {
  return readDb().briefs.find((b) => b.request_id === requestId);
}

// ── Formats & Templates ──────────────────────────────────────────────────────
export function listFormats(): Format[] {
  return readDb().formats;
}
export function getFormat(id: string): Format | undefined {
  return readDb().formats.find((f) => f.id === id);
}
export function listTemplates(): Template[] {
  return readDb().templates;
}
export function getTemplate(id: string): Template | undefined {
  return readDb().templates.find((t) => t.id === id);
}

// ── Prompts ──────────────────────────────────────────────────────────────────
export function getPrompt(requestId: string): Prompt | undefined {
  return readDb()
    .prompts.filter((p) => p.request_id === requestId)
    .sort((a, b) => b.version - a.version)[0];
}

/** Validate/save a prompt: recompute the weighted total + pass flag, store it. */
export function savePrompt(
  requestId: string,
  text: string,
  scores: PromptScores,
): Prompt {
  return mutate((db) => {
    const { total, passed } = computeTotal(scores);
    const existing = db.prompts
      .filter((p) => p.request_id === requestId)
      .sort((a, b) => b.version - a.version)[0];
    const prompt: Prompt = {
      id: uid("p"),
      request_id: requestId,
      text,
      scores,
      total_score: total,
      passed,
      version: (existing?.version ?? 0) + 1,
      created_at: new Date().toISOString(),
    };
    db.prompts.push(prompt);
    return prompt;
  });
}

// ── Scripts ──────────────────────────────────────────────────────────────────
export const MAX_REGENERATIONS = 3;

export function getScript(requestId: string): Script | undefined {
  return readDb().scripts.find((s) => s.request_id === requestId);
}

export function regenerateScript(
  requestId: string,
  nextBeats?: ScriptBeat[],
): { script?: Script; error?: string } {
  return mutate((db) => {
    const script = db.scripts.find((s) => s.request_id === requestId);
    if (!script) return { error: "No script for this request." };
    if (script.regenerations_used >= MAX_REGENERATIONS) {
      return { error: "Regeneration limit reached (3 of 3)." };
    }
    script.regenerations_used += 1;
    if (nextBeats) script.beats = nextBeats;
    return { script };
  });
}

export function updateScriptBeats(
  requestId: string,
  beats: ScriptBeat[],
): Script | undefined {
  return mutate((db) => {
    const script = db.scripts.find((s) => s.request_id === requestId);
    if (!script) return undefined;
    script.beats = beats;
    return script;
  });
}

// ── Assets ───────────────────────────────────────────────────────────────────
export function getAssets(requestId: string) {
  return readDb().assets.filter((a) => a.request_id === requestId);
}

// ── Language variants ────────────────────────────────────────────────────────
export function listVariants(requestId: string): LanguageVariant[] {
  return readDb().language_variants.filter((v) => v.request_id === requestId);
}

export function generateVariant(id: string): LanguageVariant | undefined {
  return mutate((db) => {
    const v = db.language_variants.find((x) => x.id === id);
    if (!v) return undefined;
    v.status = "generating";
    v.localization = v.localization ?? "Dubbed";
    v.updated_at = new Date().toISOString();
    return v;
  });
}

export function setVariantStatus(
  id: string,
  status: LanguageVariant["status"],
): LanguageVariant | undefined {
  return mutate((db) => {
    const v = db.language_variants.find((x) => x.id === id);
    if (!v) return undefined;
    v.status = status;
    v.updated_at = new Date().toISOString();
    return v;
  });
}

// ── Publications ─────────────────────────────────────────────────────────────
export function listPublications(requestId: string): Publication[] {
  return readDb().publications.filter((p) => p.request_id === requestId);
}

export interface PublishInput {
  destinations: string[];
  scheduled_at: string | null;
  /** Simulate a failure on this destination (drives the error toast). */
  failDestination?: string | null;
}

export function publish(
  requestId: string,
  input: PublishInput,
): { published: Publication[]; failed: Publication[] } {
  return mutate((db) => {
    const published: Publication[] = [];
    const failed: Publication[] = [];
    for (const dest of input.destinations) {
      const willFail = input.failDestination === dest;
      const pub: Publication = {
        id: uid("pub"),
        request_id: requestId,
        destination: dest,
        scheduled_at: input.scheduled_at,
        status: willFail ? "failed" : input.scheduled_at ? "scheduled" : "published",
      };
      db.publications.push(pub);
      (willFail ? failed : published).push(pub);
    }
    return { published, failed };
  });
}

// ── Metrics ──────────────────────────────────────────────────────────────────
export function listMetrics(requestId: string): Metric[] {
  return readDb().metrics.filter((m) => m.request_id === requestId);
}
export function listKpis(requestId: string): MonitoringKpi[] {
  return readDb().monitoring_kpis.filter((k) => k.request_id === requestId);
}
