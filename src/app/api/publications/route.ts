import { NextRequest } from "next/server";
import { z } from "zod";
import { handle, HttpError } from "@/lib/api";
import { requireCapability } from "@/lib/auth";
import { getActiveRequest, publish, setStage } from "@/lib/db";

const Schema = z.object({
  requestId: z.string().optional(),
  destinations: z.array(z.string()).min(1, "Select at least one channel"),
  scheduled_at: z.string().nullable().optional(),
  failDestination: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  return handle(async () => {
    requireCapability("act_pipeline");
    const input = Schema.parse(await req.json());
    const id = input.requestId ?? getActiveRequest().id;

    const result = publish(id, {
      destinations: input.destinations,
      scheduled_at: input.scheduled_at ?? null,
      failDestination: input.failDestination ?? null,
    });

    // Full immediate success → the request moves to Monitoring.
    if (result.failed.length === 0 && !input.scheduled_at) {
      setStage(id, "monitoring");
    }
    return result;
  });
}
