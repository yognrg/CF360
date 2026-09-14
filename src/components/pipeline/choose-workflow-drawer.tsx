"use client";

import { useRouter } from "next/navigation";
import { FileVideo, Sheet, ChevronRight } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Tag } from "@/components/ui/tag";

export function ChooseWorkflowDrawer({
  open,
  onClose,
  onNewVideo,
}: {
  open: boolean;
  onClose: () => void;
  onNewVideo: () => void;
}) {
  const router = useRouter();
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Choose Your Workflow"
      subtitle="How do you want to create this request?"
    >
      <div className="flex flex-col gap-3">
        <button
          onClick={onNewVideo}
          className="group flex items-start gap-4 rounded-card border border-border bg-surface p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary-soft/40"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary-soft text-primary">
            <FileVideo className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="text-label font-medium text-text">New Video Brief</span>
              <Tag tone="blue">Recommended</Tag>
            </span>
            <span className="mt-1 block text-body text-text-sub">
              Create a single video from one product brief. Best for one-off campaigns.
            </span>
          </span>
          <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-text-faint group-hover:text-primary" />
        </button>

        <button
          onClick={() => {
            onClose();
            router.push("/bulk-brief");
          }}
          className="group flex items-start gap-4 rounded-card border border-border bg-surface p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary-soft/40"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-bg text-text-sub">
            <Sheet className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-label font-medium text-text">Bulk Video Brief</span>
            <span className="mt-1 block text-body text-text-sub">
              Upload a sheet to generate multiple briefs at once. Best for scale.
            </span>
          </span>
          <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-text-faint group-hover:text-primary" />
        </button>
      </div>
    </Drawer>
  );
}
