"use client";

import { usePathname } from "next/navigation";
import { Stepper, PRE_PRODUCTION_STEPS, PROGRESS_LABEL } from "@/components/ui/stepper";

const STEP_BY_PATH: Record<string, number> = {
  "/pre-production/brief": 0,
  "/pre-production/format": 1,
  "/pre-production/template": 2,
  "/pre-production/storyboard": 3,
  "/pre-production/script": 4,
};

export function PreProdStepper() {
  const pathname = usePathname();
  const current = STEP_BY_PATH[pathname] ?? 0;
  return (
    <div className="mt-6 rounded-card border border-border bg-surface px-6 py-4 shadow-card">
      <p className="mb-3 text-caption font-medium tracking-wide text-text-faint">
        {PROGRESS_LABEL}
      </p>
      {/* the six steps need ~680px, so on a phone the bar scrolls sideways. The padding keeps the active ring from being clipped by the scroll box. */}
      <div className="overflow-x-auto py-0.5">
        <div className="min-w-[680px]">
          <Stepper steps={PRE_PRODUCTION_STEPS} current={current} />
        </div>
      </div>
    </div>
  );
}
