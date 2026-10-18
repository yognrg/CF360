"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { AdvanceButton } from "@/components/stages/advance-button";
import { sendJSON } from "@/lib/client";
import { PASS_THRESHOLD, SCORE_WEIGHTS } from "@/lib/scoring";
import type { Prompt, PromptScores } from "@/lib/types";

const DEFAULT_COMMENT = "Looks good. Approving for vernacular localization.";

/**
 * What the lead checks before approving. Each check reads the matching prompt
 * validation score and passes at the same 80 threshold the prompt itself uses,
 * so editing the prompt in Storyboard changes this list.
 */
const CHECKS: { label: string; score: keyof PromptScores }[] = [
  { label: "Brand colours and logo lock-up", score: "brand" },
  { label: "T&C disclaimer frame present", score: "compliment" },
  { label: "Offer accuracy (9.50%, terms)", score: "usp" },
  { label: "Max 8 words per screen", score: "hook" },
];

export function LeadReviewView({
  prompt,
  reviewNote,
}: {
  prompt: Prompt | null;
  reviewNote: string | null;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState(reviewNote ?? DEFAULT_COMMENT);

  const results = CHECKS.map((c) => ({
    ...c,
    passed: prompt ? prompt.scores[c.score] >= PASS_THRESHOLD : false,
  }));
  const passedCount = results.filter((r) => r.passed).length;

  const requestChanges = async () => {
    setBusy(true);
    try {
      await sendJSON("/api/requests/advance", "POST", { to: "production", comment });
      toast({
        variant: "warning",
        title: "Changes requested",
        description: "Sent back to production with your comment.",
      });
      router.refresh();
    } catch (e) {
      toast({
        variant: "error",
        title: "Action failed",
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading text-text">Lead Review</h2>
        <Tag tone="warning">Awaiting approval</Tag>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Video: same 360px column as the Production preview */}
        <Card className="p-4">
          <video
            controls
            playsInline
            preload="metadata"
            className="aspect-[9/16] w-full rounded-control bg-text object-contain"
          >
            <source src="/media/gold-loan-offer-reel.webm" type="video/webm" />
            <source src="/media/gold-loan-offer-reel.mp4" type="video/mp4" />
          </video>
          <p className="mt-3 text-caption text-text-sub">Gold Loan offer reel · 0:15 · placeholder</p>
        </Card>

        {/* Review panel */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader
              title="Compliance Checklist"
              badge={
                prompt ? (
                  <Tag tone={passedCount === CHECKS.length ? "success" : "warning"}>
                    {passedCount} of {CHECKS.length} passed
                  </Tag>
                ) : (
                  <Tag tone="gray">Not validated</Tag>
                )
              }
            />
            <ul className="flex flex-col gap-3 p-6">
              {results.map((r) => (
                <li key={r.label} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={
                      r.passed
                        ? "flex h-5 w-5 items-center justify-center rounded-pill bg-success text-white"
                        : "flex h-5 w-5 items-center justify-center rounded-pill bg-danger text-white"
                    }
                  >
                    {r.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                  <span className="text-body text-text">{r.label}</span>
                  <span className="sr-only">{r.passed ? "passed" : "not passed"}</span>
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
              <p className="p-6 text-caption text-text-sub">
                {SCORE_WEIGHTS.map((w) => `${w.label} ${prompt.scores[w.key]}`).join(" · ")}
              </p>
            </Card>
          )}

          <Card>
            <CardHeader title="Review Comment" />
            <div className="p-6">
              <Textarea
                aria-label="Review comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={1000}
              />
            </div>
          </Card>

          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" loading={busy} onClick={requestChanges}>
              Request Changes
            </Button>
            <AdvanceButton
              to="vernacular"
              href="/vernacular"
              body={{ comment }}
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
