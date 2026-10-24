"use client";

import { ImageSlot } from "@/components/ui/image-slot";
import { beatStill } from "@/lib/media";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, RefreshCw } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { useToast } from "@/components/ui/toast";
import { sendJSON } from "@/lib/client";
import type { Script, ScriptBeat } from "@/lib/types";

const MAX = 3;

export function ScriptGeneration({ initialScript }: { initialScript: Script }) {
  const router = useRouter();
  const { toast } = useToast();
  const [beats, setBeats] = useState<ScriptBeat[]>(initialScript.beats);
  const [used, setUsed] = useState(initialScript.regenerations_used);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const left = MAX - used;

  const setCell = (i: number, key: keyof ScriptBeat, value: string) =>
    setBeats((prev) =>
      prev.map((b, idx) => (idx === i ? { ...b, [key]: value } : b)),
    );

  const save = async () => {
    setBusy(true);
    try {
      await sendJSON<Script>("/api/scripts", "PATCH", { beats });
      setEditing(false);
      toast({ variant: "success", title: "Script saved" });
    } catch (e) {
      toast({ variant: "error", title: "Could not save", description: msg(e) });
    } finally {
      setBusy(false);
    }
  };

  const regenerate = async () => {
    setBusy(true);
    try {
      const res = await sendJSON<Script>("/api/scripts/regenerate", "POST", {});
      setUsed(res.regenerations_used);
      setBeats(res.beats);
      toast({
        variant: "success",
        title: "Script regenerated",
        description: `${MAX - res.regenerations_used} of ${MAX} regenerations left.`,
      });
    } catch (e) {
      toast({ variant: "warning", title: "Regenerate blocked", description: msg(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader
          title="Generated Script"
          badge={<Tag tone="blue">AI generated</Tag>}
          description="Editable script table from the validated prompt. Edit inline, nudge, or regenerate (max 3)."
          action={
            <div className="flex items-center gap-2">
              {editing ? (
                <Button size="sm" onClick={save} loading={busy}>
                  Save
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={regenerate}
                loading={busy}
                disabled={left <= 0}
                title={left <= 0 ? "Regeneration limit reached" : undefined}
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                {["Beat", "Visual", "Voiceover (Hinglish)", "Dur"].map((h) => (
                  <th key={h} className="px-6 py-3 text-caption font-medium text-text-sub">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {beats.map((b, i) => (
                <tr key={i} className="border-b border-line align-top last:border-0">
                  <td className="whitespace-nowrap px-6 py-3 text-label font-medium text-text">
                    {b.beat}
                  </td>
                  <td className="px-6 py-3 text-body text-text">
                    <div className="flex items-start gap-3">
                      <ImageSlot
                        src={beatStill(b.beat)}
                        alt={`${b.beat} frame`}
                        className="aspect-[9/16] w-10 shrink-0"
                      />
                      {editing ? (
                        <input
                          value={b.visual}
                          onChange={(e) => setCell(i, "visual", e.target.value)}
                          className="w-full rounded-control border border-border bg-surface px-2 py-1 text-body focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="pt-0.5">{b.visual}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-body text-text-sub">
                    {editing ? (
                      <input
                        value={b.voiceover}
                        onChange={(e) => setCell(i, "voiceover", e.target.value)}
                        className="w-full rounded-control border border-border bg-surface px-2 py-1 text-body focus:border-primary focus:outline-none"
                      />
                    ) : (
                      b.voiceover
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-body tabular-nums text-text-sub">
                    {b.duration}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 border-t border-line px-6 py-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-caption text-text-sub">
            Regenerations left: {left} of {MAX}
          </span>
        </div>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.push("/pre-production/storyboard")}>
          Back
        </Button>
        <Button onClick={() => router.push("/production")}>Generate Video</Button>
      </div>
    </div>
  );
}

function msg(e: unknown) {
  return e instanceof Error ? e.message : undefined;
}
