import { NextRequest } from "next/server";
import { z } from "zod";
import { handle, HttpError } from "@/lib/api";
import { requireCapability } from "@/lib/auth";
import { getActiveRequest, regenerateScript } from "@/lib/db";

const Schema = z.object({ requestId: z.string().optional() });

export async function POST(req: NextRequest) {
  return handle(async () => {
    requireCapability("act_pipeline");
    const { requestId } = Schema.parse(await req.json().catch(() => ({})));
    const id = requestId ?? getActiveRequest().id;
    const { script, error } = regenerateScript(id);
    if (error) throw new HttpError(error, 409);
    return script;
  });
}
