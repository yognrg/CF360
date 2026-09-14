"use client";

import { Film, FileText, Check, X, Download } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { fmtBytes } from "@/lib/format";
import type { Format } from "@/lib/types";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-4">
      <p className="mb-2 text-caption font-medium tracking-wide text-text-faint">
        {label}
      </p>
      {children}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-body text-text-sub">{label}</span>
      <span className="text-label font-medium text-text">{value}</span>
    </div>
  );
}

export function FormatDetailsDrawer({
  format,
  open,
  onClose,
}: {
  format: Format | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={560}
      title="Format Details"
      subtitle={format?.name}
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>Use this format</Button>
        </div>
      }
    >
      {format && (
        <div className="divide-y divide-line">
          <div className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-title font-bold text-text">{format.name}</h3>
              <span className="text-caption text-text-faint">Due 14 Apr</span>
            </div>
            <p className="mt-1 text-body text-text-sub">
              {format.duration_range} · Short-form · Vertical {format.aspect_ratio}
            </p>
          </div>

          {format.reference_video_url && (
            <Section label="REFERENCE VIDEO">
              <div className="flex items-center gap-3 rounded-control border border-border bg-bg px-3 py-2">
                <Film className="h-5 w-5 text-text-faint" />
                <span className="min-w-0 flex-1 truncate text-body text-text">
                  {format.reference_video_url}
                </span>
                <Download className="h-4 w-4 text-text-faint" />
              </div>
            </Section>
          )}

          {format.adobe_files.length > 0 && (
            <Section label="ADOBE TEMPLATE">
              <div className="flex flex-col gap-2">
                {format.adobe_files.map((f) => (
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
            </Section>
          )}

          <Section label="TEMPLATE SPECS">
            <div className="rounded-control border border-border bg-bg px-3 py-2">
              <SpecRow label="Resolution" value={format.specs.resolution} />
              <SpecRow label="Duration" value={format.specs.duration} />
              <SpecRow label="Editable layers" value={format.specs.editable_layers} />
              <SpecRow
                label="Brand colours"
                value={format.specs.brand_locked ? "Locked" : "Editable"}
              />
              <SpecRow label="Text slots" value={format.specs.text_slots} />
              <SpecRow label="Image slots" value={format.specs.image_slots} />
            </div>
          </Section>

          <Section label="USAGE GUIDELINES">
            <div className="flex flex-col gap-3">
              <Guide label="When to use" value={format.usage_guidelines.when_to_use} />
              <Guide label="Structure" value={format.usage_guidelines.structure} />
              <Guide label="Best platforms" value={format.usage_guidelines.best_platforms} />
              <Guide label="Tone" value={format.usage_guidelines.tone} />
            </div>
          </Section>

          <Section label="DO'S & DON'TS">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ul className="flex flex-col gap-2">
                {format.dos.map((d) => (
                  <li key={d} className="flex gap-2 text-body-relaxed text-text">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {d}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-2">
                {format.donts.map((d) => (
                  <li key={d} className="flex gap-2 text-body-relaxed text-text">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </div>
      )}
    </Drawer>
  );
}

function Guide({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label font-medium text-text">{label}</p>
      <p className="mt-0.5 text-body-relaxed text-text-sub">{value}</p>
    </div>
  );
}
