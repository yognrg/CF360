"use client";

import { usePathname } from "next/navigation";
import { Stepper, PRE_PRODUCTION_STEPS } from "@/components/ui/stepper";

const STEP_PATHS = [
  "/pre-production/brief",
  "/pre-production/format",
  "/pre-production/template",
  "/pre-production/storyboard",
  "/pre-production/script",
  // Generate is the hand-off to Production, started from the Script step
  undefined,
] as const;

export function PreProdStepper() {
  const pathname = usePathname();
  const found = STEP_PATHS.indexOf(pathname as (typeof STEP_PATHS)[number]);
  const current = found < 0 ? 0 : found;
  return (
    <div className="mb-6 rounded-card border border-border bg-surface px-6 py-4 shadow-card">
      <Stepper
        steps={PRE_PRODUCTION_STEPS}
        current={current}
        hrefs={STEP_PATHS}
        label="Pre-production progress"
      />
    </div>
  );
}
