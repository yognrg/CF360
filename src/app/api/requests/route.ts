import { NextRequest } from "next/server";
import { z } from "zod";
import { handle } from "@/lib/api";
import { requireCapability } from "@/lib/auth";
import {
  createRequest,
  listRequests,
  type RequestFilter,
} from "@/lib/db";
import { toRequestRow } from "@/lib/dto";

const FILTERS: RequestFilter[] = ["all", "in_progress", "lead_review", "published"];

export async function GET(req: NextRequest) {
  return handle(() => {
    requireCapability("view_pipeline");
    const f = req.nextUrl.searchParams.get("filter") as RequestFilter | null;
    const filter = f && FILTERS.includes(f) ? f : "all";
    return listRequests(filter).map(toRequestRow);
  });
}

const CreateSchema = z.object({
  product: z.string().min(1, "Product is required"),
  category: z.string().min(1, "Category is required"),
  landing_url: z.string().min(1, "Landing page URL is required"),
  priority: z.enum(["high", "medium", "low"]),
  format_name: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  return handle(async () => {
    const user = requireCapability("raise_request");
    const body = await req.json();
    const input = CreateSchema.parse(body);
    const request = createRequest({ ...input, owner_id: user.id });
    return toRequestRow(request);
  });
}
