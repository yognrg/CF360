"use client";

import { useState } from "react";
import { Play, Check } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { AdvanceButton } from "@/components/stages/advance-button";
import { SCORE_WEIGHTS } from "@/lib/scoring";
import type { Prompt } from "@/lib/types";

const CHECKS = [
  "Brand colours and logo lock-up",
  "T&C disclaimer frame present",
  "Offer accuracy (9.50%, terms)",
  "Max 8 words per screen",
];

export function LeadReviewView({ prompt }: { prompt: Prompt | null }) {
  const { toast } = useToast();
  const [comment, setComment] = useState(
    "Looks good. Approving for vernacular localization.",
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading text-text">Lead Review</h2>
        <Tag tone="warning">Awaiting approval</Tag>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Video */}
        <Card className="p-4">
          <div className="relative flex aspect-[9/16] items-center justify-center overflow-hidden rounded-control bg-gradient-to-b from-text to-text-sub">
            <button className="flex h-14 w-14 items-center justify-center rounded-pill bg-white/90 text-text shadow-toast">
              <Play className="ml-0.5 h-6 w-6" />
            </button>
            <span className="absolute bottom-3 left-3 rounded-pill bg-black/50 px-2 py-1 text-caption text-white">
              0:00 / 0:15
            </span>
          </div>
        </Card>

        {/* Review panel */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader
              title="Compliance Checklist"
              badge={<Tag tone="success">4 of 4 passed</Tag>}
            />
            <ul className="flex flex-col gap-3 p-6">
              {CHECKS.map((c) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-success text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-body text-text">{c}</span>
                </li>
              ))}
            </ul>
          </Card>

          {prompt && (
            <Card>
              <CardHeader
                title="Prompt Validation"
                badge={
                  <Tag tone={prompt.passed ? "success" : "warning"}>
                    {prompt.total_score}% · {prompt.passed ? "Pass" : "Below"}
                  </Tag>
                }
              />
              <p className="px-6 py-4 text-caption text-text-sub">
                {SCORE_WEIGHTS.map((w) => `${w.label} ${prompt.scores[w.key]}`).join(" · ")}
              </p>
            </Card>
          )}

          <Card>
            <CardHeader title="Review Comment" />
            <div className="p-6">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </Card>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  variant: "warning",
                  title: "Changes requested",
                  description: "Sent back to production with your comment.",
                })
              }
            >
              Request Changes
            </Button>
            <AdvanceButton
              to="vernacular"
              href="/vernacular"
              toastTitle="Approved"
              toastDescription="Moving to vernacular localization."
            >
              Approve
            </AdvanceButton>
          </div>
        </div>
      </div>
    </div>
  );
}
