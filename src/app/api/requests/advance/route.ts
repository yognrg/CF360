import { NextRequest } from "next/server";
import { z } from "zod";
import { handle, HttpError } from "@/lib/api";
import { requireCapability } from "@/lib/auth";
import { advanceStage, getActiveRequest, setStage } from "@/lib/db";
import { STAGE_ORDER } from "@/lib/types";

const Schema = z.object({
  requestId: z.string().optional(),
  to: z.enum(STAGE_ORDER as [string, ...string[]]).optional(),
});

export async function POST(req: NextRequest) {
  return handle(async () => {
    requireCapability("act_pipeline");
    const { requestId, to } = Schema.parse(await req.json().catch(() => ({})));
    const id = requestId ?? getActiveRequest().id;
    const request = to
      ? setStage(id, to as (typeof STAGE_ORDER)[number])
      : advanceStage(id);
    if (!request) throw new HttpError("Request not found", 404);
    return request;
  });
}
