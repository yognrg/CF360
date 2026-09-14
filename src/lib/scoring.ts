import type { PromptScores } from "@/lib/types";

/**
 * Prompt validation scoring (single source of truth).
 * Weighted sum out of 100; a prompt PASSES at 80% or above.
 */
export const SCORE_WEIGHTS: { key: keyof PromptScores; label: string; weight: number }[] =
  [
    { key: "compliment", label: "Compliment", weight: 0.25 },
    { key: "brand", label: "Brand", weight: 0.2 },
    { key: "hook", label: "Hook", weight: 0.2 },
    { key: "template", label: "Template", weight: 0.15 },
    { key: "usp", label: "USP", weight: 0.1 },
    { key: "platform", label: "Platform", weight: 0.1 },
  ];

export const PASS_THRESHOLD = 80;

/** Compute the weighted total (rounded) and whether it passes. */
export function computeTotal(scores: PromptScores): { total: number; passed: boolean } {
  const raw = SCORE_WEIGHTS.reduce((sum, w) => sum + scores[w.key] * w.weight, 0);
  const total = Math.round(raw);
  return { total, passed: total >= PASS_THRESHOLD };
}
