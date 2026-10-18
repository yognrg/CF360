import { cn } from "@/lib/cn";
import type { Priority, Stage, VariantStatus } from "@/lib/types";

export type TagTone = "success" | "warning" | "danger" | "blue" | "gray";

const TONES: Record<TagTone, string> = {
  success: "bg-success-soft text-success-ink",
  warning: "bg-warning-soft text-warning-ink",
  danger: "bg-danger-soft text-danger-ink",
  blue: "bg-primary-soft text-primary",
  gray: "bg-bg text-text-sub border border-border",
};

export function Tag({
  tone = "gray",
  children,
  className,
}: {
  tone?: TagTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-pill px-2 py-1 text-caption font-medium",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ── Mappers so tags stay consistent everywhere ───────────────────────────────
export const STAGE_TONE: Record<Stage, TagTone> = {
  pipeline: "gray",
  pre_production: "warning",
  production: "blue",
  lead_review: "blue",
  vernacular: "blue",
  publishing: "success",
  monitoring: "success",
};

export const PRIORITY_TONE: Record<Priority, TagTone> = {
  high: "danger",
  medium: "warning",
  low: "gray",
};

export const VARIANT_STATUS_TONE: Record<VariantStatus, TagTone> = {
  master: "blue",
  ready: "success",
  generating: "warning",
  queued: "gray",
  failed: "danger",
};
