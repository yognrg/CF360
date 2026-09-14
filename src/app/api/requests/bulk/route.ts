import { NextRequest } from "next/server";
import { z } from "zod";
import { handle } from "@/lib/api";
import { requireCapability } from "@/lib/auth";
import { createRequest } from "@/lib/db";

const Row = z.object({
  product: z.string().min(1),
  category: z.string().min(1),
  landing_url: z.string().min(1),
  format_name: z.string().nullable().optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
});

const Schema = z.object({ rows: z.array(Row).min(1) });

export async function POST(req: NextRequest) {
  return handle(async () => {
    const user = requireCapability("raise_request");
    const { rows } = Schema.parse(await req.json());
    const created = rows.map((r) =>
      createRequest({
        product: r.product,
        category: r.category,
        landing_url: r.landing_url,
        format_name: r.format_name ?? null,
        priority: r.priority ?? "medium",
        owner_id: user.id,
      }),
    );
    return { count: created.length };
  });
}
