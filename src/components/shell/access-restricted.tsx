import Link from "next/link";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Page } from "@/components/shell/page-header";
import type { Role } from "@/lib/types";

export function AccessRestricted({ role }: { role: Role }) {
  return (
    <Page>
      <Card className="mx-auto mt-16 max-w-content p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-pill bg-warning-soft">
          <Lock className="h-6 w-6 text-warning" />
        </div>
        <h2 className="mt-4 text-heading text-text">Producer access required</h2>
        <p className="mx-auto mt-2 max-w-md text-body-relaxed text-text-sub">
          You are signed in as a <span className="font-medium">{role}</span>. This
          stage is limited to producers and admins. Request Raisers can view the
          pipeline and raise new requests.
        </p>
        <Link
          href="/pipeline"
          className="mt-4 inline-flex h-control items-center rounded-control bg-primary px-4 text-label font-medium text-white hover:bg-primary/90"
        >
          Back to Pipeline
        </Link>
      </Card>
    </Page>
  );
}
