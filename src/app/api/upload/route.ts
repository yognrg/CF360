import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { requireCapability } from "@/lib/auth";
import { AuthError } from "@/lib/auth";

const MAX_BYTES = Number(process.env.CF360_MAX_UPLOAD_BYTES || 10 * 1024 * 1024);
const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");

function safeName(name: string) {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  return `${Date.now()}_${base}`;
}

export async function POST(req: NextRequest) {
  try {
    // Only pipeline actors (producers/admins) upload production assets.
    requireCapability("act_pipeline");

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error: `File exceeds the ${(MAX_BYTES / 1024 / 1024).toFixed(0)} MB limit.`,
        },
        { status: 413 },
      );
    }

    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const name = safeName(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);

    return NextResponse.json({
      url: `/uploads/${name}`,
      name: file.name,
      size: file.size,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
