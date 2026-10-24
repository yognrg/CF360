"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { ImageSlot } from "@/components/ui/image-slot";
import { beatStill, STORYBOARD_BEATS } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { sendJSON } from "@/lib/client";
import { SCORE_WEIGHTS, PASS_THRESHOLD } from "@/lib/scoring";
import { cn } from "@/lib/cn";
import type { Prompt } from "@/lib/types";

export function StoryboardPrompts({
  initialPrompt,
}: {
  initialPrompt: Prompt | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [text, setText] = useState(initialPrompt?.text ?? "");
  const [editing, setEditing] = useState(false);
  const [prompt, setPrompt] = useState<Prompt | null>(initialPrompt);
  const [validating, setValidating] = useState(false);

  const validate = async () => {
    setValidating(true);
    try {
      const res = await sendJSON<Prompt>("/api/prompts/validate", "POST", { text });
      setPrompt(res);
      setEditing(false);
      toast({
        variant: res.passed ? "success" : "warning",
        title: res.passed
          ? `Validated · ${res.total_score}% — Pass`
          : `Validated · ${res.total_score}% — Below threshold`,
        description: res.passed
          ? "Prompt saved to library. You can generate the script."
          : `Needs ${PASS_THRESHOLD}% to proceed. Refine the prompt and re-validate.`,
      });
    } catch (e) {
      toast({ variant: "error", title: "Validation failed", description: msg(e) });
    } finally {
      setValidating(false);
    }
  };

  const passed = prompt?.passed ?? false;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* Master Prompt */}
        <Card className="flex flex-col">
          <CardHeader
            title="Master Prompt"
            badge={<Tag tone="blue">AI generated</Tag>}
            description="Build master prompt from brief data, validate quality, save to library."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditing((v) => !v)}
              >
                {editing ? "Done" : "Edit"}
              </Button>
            }
          />
          <div className="flex flex-1 flex-col gap-4 p-6">
            {editing ? (
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="min-h-[180px]"
              />
            ) : (
              <p className="rounded-control border border-border bg-bg p-4 text-body-relaxed text-text">
                {text}
              </p>
            )}
            <div className="flex items-center gap-2">
              <Button onClick={validate} loading={validating}>
                <ShieldCheck className="h-4 w-4" />
                Validate
              </Button>
              {prompt && (
                <span className="text-caption text-text-faint">
                  Version {prompt.version}
                </span>
              )}
            </div>
            <div className="mt-auto border-t border-line pt-4">
              <p className="mb-2 text-caption font-medium text-text-faint">Storyboard frames</p>
              <div className="grid max-w-[340px] grid-cols-4 gap-2">
                {STORYBOARD_BEATS.map((beat) => (
                  <figure key={beat}>
                    <ImageSlot src={beatStill(beat)} alt={`${beat} frame`} className="aspect-[9/16] w-full" />
                    <figcaption className="mt-1 text-center text-caption text-text-sub">{beat}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Validation Score */}
        <Card className="flex flex-col">
          <CardHeader title="Validation Score" badge={<Sparkles className="h-4 w-4 text-primary" />} />
          <div className="flex flex-col gap-4 p-6">
            {prompt ? (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-display font-bold",
                      passed ? "text-success-ink" : "text-warning-ink",
                    )}
                  >
                    {prompt.total_score}%
                  </span>
                  <Tag tone={passed ? "success" : "warning"}>
                    {passed ? "Pass" : "Below threshold"}
                  </Tag>
                </div>

                <div className="flex flex-col gap-3">
                  {SCORE_WEIGHTS.map((w) => {
                    const val = prompt.scores[w.key];
                    return (
                      <div key={w.key}>
                        <div className="mb-1 flex items-center justify-between text-caption">
                          <span className="text-text-sub">
                            {w.label} · {Math.round(w.weight * 100)}%
                          </span>
                          <span className="font-medium tabular-nums text-text">{val}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-pill bg-bg">
                          <div
                            className={cn(
                              "h-full rounded-pill",
                              val >= 80 ? "bg-success" : val >= 60 ? "bg-warning" : "bg-danger",
                            )}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-caption text-text-faint">
                  Threshold to pass: {PASS_THRESHOLD}%. Prompt saved to library on pass.
                </p>
              </>
            ) : (
              <p className="text-body text-text-sub">
                Validate the prompt to see the quality score.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Footer actions with pass gate */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.push("/pre-production/template")}>
          Back
        </Button>
        <Button
          disabled={!passed}
          title={passed ? undefined : `Prompt must score ${PASS_THRESHOLD}%+ to proceed`}
          onClick={() => router.push("/pre-production/script")}
        >
          Generate Script
        </Button>
      </div>
    </div>
  );
}

function msg(e: unknown) {
  return e instanceof Error ? e.message : undefined;
}
