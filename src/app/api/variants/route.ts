import { NextRequest } from "next/server";
import { z } from "zod";
import { handle, HttpError } from "@/lib/api";
import { requireCapability } from "@/lib/auth";
import { generateVariant, setVariantStatus } from "@/lib/db";

const Schema = z.object({
  id: z.string(),
  action: z.enum(["generate", "cancel", "ready"]),
});

export async function PATCH(req: NextRequest) {
  return handle(async () => {
    requireCapability("act_pipeline");
    const { id, action } = Schema.parse(await req.json());
    const variant =
      action === "generate"
        ? generateVariant(id)
        : action === "cancel"
          ? setVariantStatus(id, "queued")
          : setVariantStatus(id, "ready");
    if (!variant) throw new HttpError("Variant not found", 404);
    return variant;
  });
}
