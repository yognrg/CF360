"use client";

import { useState } from "react";
import { Check, FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { StepActions } from "@/components/pre-production/step-actions";
import { cn } from "@/lib/cn";
import { fmtBytes } from "@/lib/format";
import type { Template } from "@/lib/types";

export function TemplateSelection({ templates }: { templates: Template[] }) {
  const [selectedId, setSelectedId] = useState<string>(templates[0]?.id ?? "");
  const [details, setDetails] = useState<Template | null>(null);

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-heading text-text">Template Library</h2>
          <Tag tone="blue">Sprinklr recommended</Tag>
        </div>
        <p className="mt-1 text-body text-text-sub">
          Choose a base template. Specs and brand locks are inherited automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => {
          const active = t.id === selectedId;
          return (
            <Card
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={cn(
                "flex cursor-pointer flex-col p-4 transition-colors",
                active ? "border-primary ring-1 ring-primary" : "hover:border-primary/40",
              )}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-label font-semibold text-text">{t.name}</h3>
                {active ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-primary text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  t.badge && (
                    <Tag tone={t.badge === "Recommended" ? "blue" : "success"}>
                      {t.badge}
                    </Tag>
                  )
                )}
              </div>
              <p className="mt-2 text-body text-text-sub">
                {t.videos_count} videos · {t.duration_range}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDetails(t);
                }}
                className="mt-4 text-left text-label font-medium text-primary hover:underline"
              >
                View Details
              </button>
            </Card>
          );
        })}
      </div>

      <StepActions
        backHref="/pre-production/format"
        nextHref="/pre-production/storyboard"
        nextLabel="Continue"
      />

      <Drawer
        open={!!details}
        onClose={() => setDetails(null)}
        width={480}
        title="Template Details"
        subtitle={details?.name}
      >
        {details && (
          <div className="flex flex-col gap-4">
            <div className="rounded-control border border-border bg-bg px-3 py-2">
              {[
                ["Resolution", details.specs.resolution],
                ["Duration", details.specs.duration],
                ["Editable layers", String(details.specs.editable_layers)],
                ["Text slots", String(details.specs.text_slots)],
                ["Image slots", String(details.specs.image_slots)],
                ["Brand colours", details.specs.brand_locked ? "Locked" : "Editable"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1.5">
                  <span className="text-body text-text-sub">{k}</span>
                  <span className="text-label font-medium text-text">{v}</span>
                </div>
              ))}
            </div>
            {details.adobe_files.length > 0 && (
              <div>
                <p className="mb-2 text-caption font-medium text-text-faint">
                  ADOBE TEMPLATE
                </p>
                <div className="flex flex-col gap-2">
                  {details.adobe_files.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center gap-3 rounded-control border border-border bg-bg px-3 py-2"
                    >
                      <FileText className="h-5 w-5 text-text-faint" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body text-text">{f.name}</span>
                        <span className="block text-caption text-text-faint">
                          {f.type} · {fmtBytes(f.size_bytes)}
                        </span>
                      </span>
                      <Download className="h-4 w-4 text-text-faint" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={() => {
              setSelectedId(details.id);
              setDetails(null);
            }}>
              Use this template
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
