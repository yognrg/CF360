"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Back / Continue bar used at the foot of each pre-production step. */
export function StepActions({
  backHref,
  backLabel = "Back",
  nextHref,
  nextLabel = "Continue",
  nextDisabled,
  nextTitle,
}: {
  backHref: string;
  backLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextTitle?: string;
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <Link href={backHref}>
        <Button variant="secondary" type="button">
          {backLabel}
        </Button>
      </Link>
      {nextHref &&
        (nextDisabled ? (
          <Button disabled title={nextTitle}>
            {nextLabel}
          </Button>
        ) : (
          <Link href={nextHref}>
            <Button>{nextLabel}</Button>
          </Link>
        ))}
    </div>
  );
}
