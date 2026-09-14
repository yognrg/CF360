import { NextRequest } from "next/server";
import { z } from "zod";
import { handle, HttpError } from "@/lib/api";
import { requireCapability } from "@/lib/auth";
import { getActiveRequest, updateScriptBeats } from "@/lib/db";

const BeatSchema = z.object({
  beat: z.string(),
  visual: z.string(),
  voiceover: z.string(),
  duration: z.number(),
});

const Schema = z.object({
  requestId: z.string().optional(),
  beats: z.array(BeatSchema),
});

export async function PATCH(req: NextRequest) {
  return handle(async () => {
    requireCapability("act_pipeline");
    const { requestId, beats } = Schema.parse(await req.json());
    const id = requestId ?? getActiveRequest().id;
    const script = updateScriptBeats(id, beats);
    if (!script) throw new HttpError("No script for this request", 404);
    return script;
  });
}
