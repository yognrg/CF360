"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Tag, VARIANT_STATUS_TONE } from "@/components/ui/tag";
import { useToast } from "@/components/ui/toast";
import { AdvanceButton } from "@/components/stages/advance-button";
import { sendJSON } from "@/lib/client";
import { timeAgo } from "@/lib/format";
import type { LanguageVariant } from "@/lib/types";

const STATUS_LABEL: Record<LanguageVariant["status"], string> = {
  master: "Master",
  ready: "Ready",
  generating: "In progress",
  queued: "Pending",
  failed: "Failed",
};

export function VernacularView({
  initialVariants,
}: {
  initialVariants: LanguageVariant[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [variants, setVariants] = useState(initialVariants);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<LanguageVariant | null>(null);

  const localized = variants.filter((v) => v.status !== "queued").length;

  const act = async (v: LanguageVariant, action: "generate" | "cancel") => {
    setBusyId(v.id);
    try {
      const updated = await sendJSON<LanguageVariant>("/api/variants", "PATCH", {
        id: v.id,
        action,
      });
      setVariants((prev) => prev.map((x) => (x.id === v.id ? updated : x)));
      toast({
        variant: "success",
        title:
          action === "generate"
            ? `Generating ${v.language}`
            : `Cancelled ${v.language}`,
      });
      router.refresh();
    } catch (e) {
      toast({
        variant: "error",
        title: "Action failed",
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading text-text">Vernacular</h2>
        <Tag tone="success">{localized} of {variants.length} localized</Tag>
      </div>

      <Card>
        <CardHeader
          title="Language Variants"
          badge={<Tag tone="blue">Auto-dub + subtitle</Tag>}
          description="Master approved in Hindi. Generate regional dubs and subtitles for distribution."
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                {["Language", "Localization", "Status", "Updated", "Action"].map((h) => (
                  <th key={h} className="px-6 py-3 text-caption font-medium text-text-sub">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id} className="border-b border-line last:border-0">
                  <td className="px-6 py-3 text-label font-medium text-text">
                    {v.language}
                  </td>
                  <td className="px-6 py-3 text-body text-text-sub">
                    {v.localization ?? "—"}
                  </td>
                  <td className="px-6 py-3">
                    <Tag tone={VARIANT_STATUS_TONE[v.status]}>
                      {STATUS_LABEL[v.status]}
                    </Tag>
                  </td>
                  <td className="px-6 py-3 text-body text-text-sub">
                    {timeAgo(v.updated_at)}
                  </td>
                  <td className="px-6 py-3">
                    {v.status === "master" ? (
                      <span className="text-caption text-text-faint">Master</span>
                    ) : v.status === "ready" ? (
                      <button
                        onClick={() => setPreviewing(v)}
                        className="text-label font-medium text-primary hover:underline"
                      >
                        Preview
                      </button>
                    ) : v.status === "generating" ? (
                      <button
                        onClick={() => act(v, "cancel")}
                        disabled={busyId === v.id}
                        className="text-label font-medium text-danger-ink hover:underline disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    ) : (
                      <Button size="sm" variant="soft" onClick={() => act(v, "generate")} loading={busyId === v.id}>
                        Generate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.push("/lead-review")}>
          Back
        </Button>
        <AdvanceButton
          to="publishing"
          href="/publishing"
          toastTitle="Sent to Publishing"
          toastDescription="Variants queued for distribution."
        >
          Send to Publishing
        </AdvanceButton>
      </div>
      <Drawer
        open={previewing !== null}
        onClose={() => setPreviewing(null)}
        width={420}
        title="Preview"
        subtitle={previewing?.language}
      >
        <video
          key={previewing?.id}
          controls
          playsInline
          preload="metadata"
          className="aspect-[9/16] w-full rounded-control bg-text object-contain"
        >
          <source src="/media/gold-loan-offer-reel.webm" type="video/webm" />
          <source src="/media/gold-loan-offer-reel.mp4" type="video/mp4" />
        </video>
        <p className="mt-3 text-caption text-text-sub">
          Placeholder reel. The dubbed {previewing?.language} version replaces it when the
          dub is rendered.
        </p>
      </Drawer>
    </div>
  );
}
