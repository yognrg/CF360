"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Tag } from "@/components/ui/tag";
import { StepActions } from "@/components/pre-production/step-actions";
import { FormatDetailsDrawer } from "./format-details-drawer";
import { sendJSON } from "@/lib/client";
import { cn } from "@/lib/cn";
import { ImageSlot } from "@/components/ui/image-slot";
import { formatCover } from "@/lib/media";
import type { Format } from "@/lib/types";

export function FormatSelection({
  formats,
  chosenName,
}: {
  formats: Format[];
  chosenName: string | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Format | null>(null);
  const [chosen, setChosen] = useState<string | null>(chosenName);
  const [open, setOpen] = useState(false);

  const use = async (f: Format) => {
    try {
      await sendJSON("/api/requests", "PATCH", { format_name: f.name });
      setChosen(f.name);
      setOpen(false);
      toast({ variant: "success", title: "Format selected", description: f.name });
      router.refresh();
    } catch (e) {
      toast({
        variant: "error",
        title: "Could not save the format",
        description: e instanceof Error ? e.message : undefined,
      });
    }
  };

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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((f) => (
          <Card
            key={f.id}
            className={cn(
              "flex flex-col p-4",
              f.name === chosen && "border-primary ring-1 ring-primary",
            )}
          >
            <ImageSlot
              src={formatCover(f.name)}
              alt={`${f.name} format cover`}
              label="Cover · 16:9"
              className="mb-4 aspect-video w-full"
            />
            <div className="flex items-start justify-between">
              <h3 className="text-label font-semibold text-text">{f.name}</h3>
              {f.name === chosen ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-primary text-white">
                  <Check className="h-3.5 w-3.5" aria-label="Selected" />
                </span>
              ) : (
                f.badge && (
                  <Tag tone={f.badge === "Recommended" ? "blue" : "success"}>
                    {f.badge}
                  </Tag>
                )
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
        onUse={use}
        chosen={selected?.name === chosen}
      />
    </div>
  );
}
