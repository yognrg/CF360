import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export const PRE_PRODUCTION_STEPS = [
  "Brief",
  "Format",
  "Template",
  "Storyboard",
  "Script",
  "Generate",
] as const;

export type PreProductionStep = (typeof PRE_PRODUCTION_STEPS)[number];

/** Horizontal progress rail. `current` is the active step index (0-based). */
export function Stepper({
  steps = PRE_PRODUCTION_STEPS as readonly string[],
  current,
}: {
  steps?: readonly string[];
  current: number;
}) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-pill text-caption font-semibold",
                  done && "bg-primary text-white",
                  active && "bg-primary-soft text-primary ring-1 ring-primary",
                  !done && !active && "bg-bg text-text-faint",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-label",
                  active ? "font-medium text-text" : "text-text-sub",
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-px min-w-2 flex-1",
                  done ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export const PROGRESS_LABEL = "PROGRESS";
