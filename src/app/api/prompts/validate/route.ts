import { NextRequest } from "next/server";
import { z } from "zod";
import { handle } from "@/lib/api";
import { requireCapability } from "@/lib/auth";
import { getActiveRequest, savePrompt } from "@/lib/db";
import { scorePromptText } from "@/lib/scoring";

const Schema = z.object({
  requestId: z.string().optional(),
  text: z.string().min(1, "Prompt text is required"),
});

export async function POST(req: NextRequest) {
  return handle(async () => {
    requireCapability("act_pipeline");
    const { requestId, text } = Schema.parse(await req.json());
    const id = requestId ?? getActiveRequest().id;
    const scores = scorePromptText(text);
    return savePrompt(id, text, scores);
  });
}
