"use client";

import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { StepActions } from "@/components/pre-production/step-actions";
import { FormatDetailsDrawer } from "./format-details-drawer";
import type { Format } from "@/lib/types";

export function FormatSelection({ formats }: { formats: Format[] }) {
  const [selected, setSelected] = useState<Format | null>(null);
  const [open, setOpen] = useState(false);

  const view = (f: Format) => {
    setSelected(f);
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-heading text-text">Format Library</h2>
          <p className="mt-1 text-body text-text-sub">
            Sprinklr recommended plus existing library. Click any format for details.
          </p>
        </div>
        <Button variant="secondary">
          <Plus className="h-4 w-4" />
          Add Format
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((f) => (
          <Card key={f.id} className="flex flex-col p-4">
            <div className="flex items-start justify-between">
              <h3 className="text-label font-semibold text-text">{f.name}</h3>
              {f.badge && (
                <Tag tone={f.badge === "Recommended" ? "blue" : "success"}>
                  {f.badge}
                </Tag>
              )}
            </div>
            <p className="mt-2 text-body text-text-sub">
              {f.aspect_ratio} · {f.duration_range}
            </p>
            <button
              onClick={() => view(f)}
              className="mt-4 inline-flex items-center gap-1 text-label font-medium text-primary hover:underline"
            >
              View Details
              <ChevronRight className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>

      <StepActions
        backHref="/pre-production/brief"
        nextHref="/pre-production/template"
        nextLabel="Continue to Template"
      />

      <FormatDetailsDrawer
        format={selected}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
