import { getUser } from "@/lib/db";
import { timeAgo } from "@/lib/format";
import type { Request } from "@/lib/types";

export interface RequestRow extends Request {
  owner_name: string;
  updated_label: string;
}

export function toRequestRow(r: Request): RequestRow {
  return {
    ...r,
    owner_name: getUser(r.owner_id)?.name ?? "Unassigned",
    updated_label: timeAgo(r.updated_at),
  };
}
