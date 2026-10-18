import { Tag, STAGE_TONE } from "@/components/ui/tag";
import type { Request, Stage } from "@/lib/types";
import { STAGE_LABELS } from "@/lib/types";

/** Standard content padding wrapper for a screen. */
export function Page({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1120px] p-4 sm:p-8">{children}</div>;
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-title font-bold text-text">{title}</h1>
        {subtitle && <p className="mt-1 text-body text-text-sub">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/** The CF / VID / status / product strip shown on every stage screen. */
export function RequestContextBar({
  request,
  statusTone = "blue",
  statusLabel,
}: {
  request: Request;
  statusTone?: "blue" | "success" | "warning" | "gray";
  statusLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-card border border-border bg-surface px-6 py-3 shadow-card">
      <Meta label="CF" value={request.cf_id} />
      <Meta label="VID" value={request.vid_id} />
      <Meta label="Product" value={request.product} />
      <div className="ml-auto flex items-center gap-3">
        <Tag tone={statusTone}>{statusLabel ?? request.status_label}</Tag>
        <span className="text-caption text-text-faint">Stage:</span>
        <Tag tone={STAGE_TONE[request.stage as Stage]}>
          {STAGE_LABELS[request.stage as Stage]}
        </Tag>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-caption text-text-faint">{label}:</span>
      <span className="text-label font-medium text-text">{value}</span>
    </span>
  );
}
