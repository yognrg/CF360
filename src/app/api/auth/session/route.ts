import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, makeSessionValue } from "@/lib/auth";
import { getUser } from "@/lib/db";

/** Sign in / switch active user (demo role switcher). */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { userId?: string };
  const userId = body.userId;
  if (!userId || !getUser(userId)) {
    return NextResponse.json({ error: "Unknown user" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, userId });
  res.cookies.set(SESSION_COOKIE, makeSessionValue(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
