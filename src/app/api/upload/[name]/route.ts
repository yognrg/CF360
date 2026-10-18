import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/uploads";

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".csv": "text/csv",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

/** Serve an uploaded file back (used where the project folder is read-only). */
export async function GET(_req: NextRequest, { params }: { params: { name: string } }) {
  // names are "<timestamp>_<safe name>"; anything else is not one of ours
  if (!/^\d+_[a-zA-Z0-9._-]+$/.test(params.name)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const file = path.join(UPLOAD_DIR, params.name);
  if (!fs.existsSync(file)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const type = TYPES[path.extname(params.name).toLowerCase()] ?? "application/octet-stream";
  return new NextResponse(fs.readFileSync(file), {
    headers: {
      "content-type": type,
      "content-disposition": `attachment; filename="${params.name}"`,
      "x-content-type-options": "nosniff",
    },
  });
}
