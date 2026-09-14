/**
 * Demo auth: a signed HTTP-only cookie holds the active user id. A role switcher
 * lets you sign in as any seeded user. Role gating is enforced on the SERVER —
 * see requireUser / requireCapability, used by every mutating API route.
 */
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getUser, listUsers } from "@/lib/db";
import type { Role, User } from "@/lib/types";

export const SESSION_COOKIE = "cf360_session";
const SECRET = process.env.APP_SESSION_SECRET || "cf360-dev-secret-change-me";
const DEFAULT_USER_ID = "u_param";

function sign(value: string): string {
  const mac = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${mac}`;
}

export function makeSessionValue(userId: string): string {
  return sign(userId);
}

function verify(signed: string | undefined): string | null {
  if (!signed) return null;
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return null;
  const value = signed.slice(0, idx);
  const mac = signed.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  // constant-time compare
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return value;
}

/** The signed-in user, or the seeded default (so the demo always has a user). */
export function getCurrentUser(): User {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  const userId = verify(raw) ?? DEFAULT_USER_ID;
  return getUser(userId) ?? getUser(DEFAULT_USER_ID) ?? listUsers()[0];
}

// ── Capabilities (the single source of truth for role gating) ────────────────
export type Capability =
  | "raise_request"
  | "view_pipeline"
  | "act_pipeline" // any producer action across stages
  | "manage_users";

const ROLE_CAPS: Record<Role, Capability[]> = {
  raiser: ["view_pipeline", "raise_request"],
  producer: ["view_pipeline", "raise_request", "act_pipeline"],
  admin: ["view_pipeline", "raise_request", "act_pipeline", "manage_users"],
};

export function can(user: User, cap: Capability): boolean {
  return ROLE_CAPS[user.role].includes(cap);
}

/** For API routes: throws a typed error if the current user lacks the cap. */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.status = status;
  }
}

export function requireUser(): User {
  const user = getCurrentUser();
  if (!user) throw new AuthError("Not signed in", 401);
  return user;
}

export function requireCapability(cap: Capability): User {
  const user = requireUser();
  if (!can(user, cap)) {
    throw new AuthError(
      `Your role (${user.role}) is not allowed to perform this action.`,
      403,
    );
  }
  return user;
}
