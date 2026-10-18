import { NextRequest } from "next/server";
import { z } from "zod";
import { handle, HttpError } from "@/lib/api";
import { requireCapability } from "@/lib/auth";
import {
  createRequest,
  getActiveRequest,
  listRequests,
  updateRequest,
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

const UpdateSchema = z
  .object({
    requestId: z.string().optional(),
    format_name: z.string().min(1).max(120).nullable().optional(),
    template_id: z.string().min(1).max(120).nullable().optional(),
    review_note: z.string().max(1000).nullable().optional(),
  })
  .refine(
    (v) => v.format_name !== undefined || v.template_id !== undefined || v.review_note !== undefined,
    "Nothing to update",
  );

/** Save a pipeline choice (format, template or review note) on a request. */
export async function PATCH(req: NextRequest) {
  return handle(async () => {
    requireCapability("act_pipeline");
    const { requestId, ...patch } = UpdateSchema.parse(await req.json().catch(() => ({})));
    const id = requestId ?? getActiveRequest().id;
    const request = updateRequest(id, patch);
    if (!request) throw new HttpError("Request not found", 404);
    return toRequestRow(request);
  });
}
