"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, RefreshCw, Film, ImageIcon } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { AdvanceButton } from "@/components/stages/advance-button";
import { cn } from "@/lib/cn";

const STEPS = [
  "Assets prepared",
  "Voiceover synthesized (Hinglish)",
  "Rendering video frames",
  "Quality check",
  "Ready for review",
];

export function ProductionView() {
  const router = useRouter();
  const [phase, setPhase] = useState<"ready" | "rendering">("ready");
  const [progress, setProgress] = useState(100);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const regenerate = () => {
    setPhase("rendering");
    setProgress(0);
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          timer.current && clearInterval(timer.current);
          setPhase("ready");
          return 100;
        }
        return Math.min(100, p + 7);
      });
    }, 140);
  };

  const rendering = phase === "rendering";
  // step index reached (0..5)
  const reached = rendering ? Math.min(4, Math.floor((progress / 100) * 5)) : 5;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading text-text">Production</h2>
        <Tag tone={rendering ? "warning" : "success"}>
          {rendering ? "Rendering" : "Ready"}
        </Tag>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Preview */}
        <Card className="p-4">
          <div className="relative flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-control bg-gradient-to-b from-text to-text-sub">
            {rendering ? (
              <div className="flex flex-col items-center gap-2 text-white/90">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-caption">{progress}%</span>
              </div>
            ) : (
              <video
                controls
                playsInline
                preload="metadata"
                poster="/media/gold-loan-offer-reel-poster.jpg"
                className="h-full w-full object-contain"
              >
                <source src="/media/gold-loan-offer-reel.webm" type="video/webm" />
                <source src="/media/gold-loan-offer-reel.mp4" type="video/mp4" />
              </video>
            )}
            <span className="pointer-events-none absolute left-3 top-3 rounded-pill bg-black/50 px-2 py-1 text-caption text-white">
              00:10 · Hindi
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {["9:16", "1:1", "16:9"].map((v, i) => (
              <span
                key={v}
                className={cn(
                  "rounded-pill px-2 py-1 text-caption",
                  i === 0
                    ? "bg-primary-soft font-medium text-primary"
                    : "border border-border text-text-sub",
                )}
              >
                {v}
              </span>
            ))}
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto"
              onClick={regenerate}
              disabled={rendering}
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </Card>

        {/* Progress + outputs */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader
              title="Generation Progress"
              badge={<Tag tone="gray">AI</Tag>}
              action={
                <span className="text-caption text-text-faint">
                  {rendering ? "ETA ~2 min" : "Completed"}
                </span>
              }
            />
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-body text-text-sub">Rendering 1080 x 1920</span>
                <span className="text-label font-medium tabular-nums text-text">
                  {progress}%
                </span>
              </div>
              <div className="mb-5 h-2 w-full overflow-hidden rounded-pill bg-bg">
                <div
                  className="h-full rounded-pill bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <ul className="flex flex-col gap-3">
                {STEPS.map((s, i) => {
                  const done = i < reached;
                  const active = i === reached && rendering;
                  return (
                    <li key={s} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-pill",
                          done && "bg-success text-white",
                          active && "bg-primary-soft text-primary",
                          !done && !active && "bg-bg text-text-faint",
                        )}
                      >
                        {done ? (
                          <Check className="h-3 w-3" />
                        ) : active ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-pill bg-current" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-body",
                          done || active ? "text-text" : "text-text-faint",
                        )}
                      >
                        {s}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>

          <Card>
            <CardHeader title="Output Files" />
            <div className="flex flex-col divide-y divide-line">
              <OutputRow
                icon={<Film className="h-5 w-5 text-text-faint" />}
                name="GoldLoan_OfferReel_1080x1920.mp4"
                meta="MP4"
                ready={!rendering}
              />
              <OutputRow
                icon={<ImageIcon className="h-5 w-5 text-text-faint" />}
                name="GoldLoan_OfferReel_thumb.jpg"
                meta="JPG"
                ready={!rendering}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.push("/pre-production/script")}>
          Back
        </Button>
        <AdvanceButton
          disabled={rendering}
          to="lead_review"
          href="/lead-review"
          toastTitle="Sent to Lead Review"
          toastDescription="The reviewer has been notified."
        >
          Send to Lead Review
        </AdvanceButton>
      </div>
    </div>
  );
}

function OutputRow({
  icon,
  name,
  meta,
  ready,
}: {
  icon: React.ReactNode;
  name: string;
  meta: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-3">
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body text-text">{name}</span>
        <span className="block text-caption text-text-faint">
          {meta} · {ready ? "ready" : "rendering"}
        </span>
      </span>
      <Tag tone={ready ? "success" : "gray"}>{ready ? "Ready" : "Pending"}</Tag>
    </div>
  );
}
