"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Page, PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Tag, STAGE_TONE, PRIORITY_TONE } from "@/components/ui/tag";
import { getJSON } from "@/lib/client";
import { STAGE_LABELS } from "@/lib/types";
import type { RequestRow } from "@/lib/dto";
import { ChooseWorkflowDrawer } from "./choose-workflow-drawer";
import { NewRequestDrawer } from "./new-request-drawer";
import { cn } from "@/lib/cn";

type FilterKey = "all" | "in_progress" | "lead_review" | "published";
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in_progress", label: "In Progress" },
  { key: "lead_review", label: "Lead Review" },
  { key: "published", label: "Published" },
];

export function PipelineClient({
  initialRows,
}: {
  initialRows: RequestRow[];
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [chooseOpen, setChooseOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const { data: rows = [] } = useQuery({
    queryKey: ["requests", filter],
    queryFn: () => getJSON<RequestRow[]>(`/api/requests?filter=${filter}`),
    initialData: filter === "all" ? initialRows : undefined,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.cf_id.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q) ||
        (r.format_name ?? "").toLowerCase().includes(q) ||
        r.owner_name.toLowerCase().includes(q),
    );
  }, [rows, search]);

  return (
    <Page>
      <PageHeader
        title="Video Pipeline"
        actions={
          <Button onClick={() => setChooseOpen(true)}>
            <Plus className="h-4 w-4" />
            Raise a Request
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-pill px-3 py-1.5 text-label transition-colors",
                filter === f.key
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-text-sub hover:bg-bg",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="w-64">
          <Input
            placeholder="Search requests"
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              {["CF ID", "Product", "Format", "Stage", "Priority", "Updated", "Owner"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-caption font-medium text-text-sub"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-line last:border-0 hover:bg-bg/60"
              >
                <td className="px-4 py-3 text-label font-semibold text-text">
                  {r.cf_id}
                </td>
                <td className="px-4 py-3 text-body text-text">{r.product}</td>
                <td className="px-4 py-3 text-body text-text-sub">
                  {r.format_name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Tag tone={STAGE_TONE[r.stage]}>{STAGE_LABELS[r.stage]}</Tag>
                </td>
                <td className="px-4 py-3">
                  <Tag tone={PRIORITY_TONE[r.priority]}>
                    {r.priority[0].toUpperCase() + r.priority.slice(1)}
                  </Tag>
                </td>
                <td className="px-4 py-3 text-body text-text-sub">
                  {r.updated_label}
                </td>
                <td className="px-4 py-3 text-body text-text">{r.owner_name}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-body text-text-faint">
                  No requests match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <ChooseWorkflowDrawer
        open={chooseOpen}
        onClose={() => setChooseOpen(false)}
        onNewVideo={() => {
          setChooseOpen(false);
          setNewOpen(true);
        }}
      />
      <NewRequestDrawer open={newOpen} onClose={() => setNewOpen(false)} />
    </Page>
  );
}
