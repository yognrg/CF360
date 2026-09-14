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

/**
 * Heuristic prompt scorer: inspects the prompt text for signals in each of the
 * six dimensions and returns sub-scores (0-100). It stands in for the "AI"
 * validator so that editing the prompt genuinely changes the score.
 */
export function scorePromptText(text: string): PromptScores {
  const t = text.toLowerCase();
  const has = (...needles: string[]) => needles.some((n) => t.includes(n));
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  const compliment =
    62 +
    (has("t&c", "disclaimer") ? 16 : 0) +
    (has("brand colour", "brand color", "logo") ? 14 : 0) +
    (has("lock") ? 8 : 0);

  const brand =
    60 +
    (has("bajaj finserv") ? 20 : has("bajaj") ? 10 : 0) +
    (has("logo", "lock-up", "brand") ? 12 : 0);

  const hook =
    58 +
    (has("lead with", "hook") ? 16 : 0) +
    (has("instant", "urgency", "fomo", "now") ? 12 : 0) +
    (/\d/.test(t) ? 8 : 0);

  const template =
    58 +
    (has("max 8 words", "8 words") ? 16 : 0) +
    (has("template", "frame", "overlay") ? 12 : 0) +
    (has("lock") ? 8 : 0);

  const usp =
    60 +
    (has("%", "interest") ? 16 : 0) +
    (has("₹", "approval", "minimal docs", "doorstep") ? 16 : 0);

  const platform =
    60 +
    (has("9:16", "vertical") ? 14 : 0) +
    (has("cta", "apply now", "link in bio") ? 14 : 0) +
    (has("reel", "shorts", "homepage") ? 6 : 0);

  return {
    compliment: clamp(compliment),
    brand: clamp(brand),
    hook: clamp(hook),
    template: clamp(template),
    usp: clamp(usp),
    platform: clamp(platform),
  };
}
