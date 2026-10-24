import Link from "next/link";
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

/**
 * Horizontal progress rail. `current` is the active step index (0-based).
 * Steps sit in equal columns, so every connector is the same length whatever
 * the label. Completed steps link back when `hrefs` gives them a route.
 */
export function Stepper({
  steps = PRE_PRODUCTION_STEPS as readonly string[],
  current,
  hrefs,
  label = "Progress",
}: {
  steps?: readonly string[];
  current: number;
  hrefs?: readonly (string | undefined)[];
  label?: string;
}) {
  const total = steps.length;
  const next = steps[current + 1];

  return (
    <nav aria-label={label}>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="text-label text-text">
          <span className="text-text-faint">
            Step {current + 1} of {total}
          </span>
          <span className="mx-2 text-border" aria-hidden="true">
            /
          </span>
          {steps[current]}
        </p>
        {next && <p className="text-caption text-text-faint">Next: {next}</p>}
      </div>

      {/* phone: one segment per step, the labels would not fit under six circles */}
      <div className="flex gap-1 sm:hidden" aria-hidden="true">
        {steps.map((step, i) => (
          <span
            key={step}
            className={cn(
              "h-1 flex-1 rounded-pill",
              i <= current ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>

      <ol
        className="hidden sm:grid"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const href = done ? hrefs?.[i] : undefined;

          const marker = (
            <>
              <span
                className={cn(
                  "relative z-10 flex h-6 w-6 items-center justify-center rounded-pill text-caption font-semibold transition-colors",
                  done && "bg-primary text-white group-hover:bg-primary/90",
                  active && "bg-surface text-primary ring-2 ring-primary ring-offset-2 ring-offset-surface",
                  !done && !active && "border border-border bg-surface text-text-faint",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "mt-2 text-caption",
                  done && "text-text-sub group-hover:text-primary",
                  active && "font-medium text-text",
                  !done && !active && "text-text-faint",
                )}
              >
                {step}
                {done && <span className="sr-only"> (completed)</span>}
              </span>
            </>
          );

          return (
            <li
              key={step}
              className="relative flex flex-col items-center text-center"
              aria-current={active ? "step" : undefined}
            >
              {i < total - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-1/2 top-[11px] h-0.5 w-full",
                    done ? "bg-primary" : "bg-border",
                  )}
                />
              )}
              {href ? (
                <Link
                  href={href}
                  className="group flex flex-col items-center rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {marker}
                </Link>
              ) : (
                <span className="flex flex-col items-center">{marker}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
