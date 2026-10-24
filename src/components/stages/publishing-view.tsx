"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Store, MonitorPlay, Youtube, Instagram } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useToast } from "@/components/ui/toast";
import { sendJSON } from "@/lib/client";
import { cn } from "@/lib/cn";

const CHANNELS = [
  { id: "Homepage Banner", label: "Homepage Banner", sub: "bajajfinserv.in hero carousel", icon: Home },
  { id: "Bajaj Mall Category", label: "Bajaj Mall Category", sub: "Gold Loan category pages", icon: Store },
  { id: "Video Wall", label: "Video Wall", sub: "In-app video feed", icon: MonitorPlay },
  { id: "YouTube Shorts", label: "YouTube Shorts", sub: "Bajaj Finserv official channel", icon: Youtube },
  { id: "Instagram Reels", label: "Instagram Reels", sub: "@bajajfinserv", icon: Instagram },
];

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-pill transition-colors",
        on ? "bg-primary" : "bg-border",
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-pill bg-white shadow-sm transition-transform",
          on ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}

export function PublishingView() {
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(CHANNELS.map((c) => [c.id, true])),
  );
  const [mode, setMode] = useState<"now" | "later">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [busy, setBusy] = useState(false);

  const chosen = () => CHANNELS.filter((c) => selected[c.id]).map((c) => c.id);

  // default the schedule to tomorrow 09:00 in the visitor's own time zone
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const pad = (n: number) => String(n).padStart(2, "0");
    setScheduledAt(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`);
  }, []);

  /** Publish the selected channels, or just `only` when retrying. */
  const doPublish = async (only?: string[]) => {
    const destinations = only ?? chosen();
    if (destinations.length === 0) {
      toast({ variant: "warning", title: "Select at least one channel" });
      return;
    }
    if (mode === "later") {
      const when = new Date(scheduledAt);
      if (!scheduledAt || Number.isNaN(when.getTime())) {
        toast({ variant: "warning", title: "Pick a date and time" });
        return;
      }
      if (when.getTime() <= Date.now()) {
        toast({ variant: "warning", title: "Pick a time in the future" });
        return;
      }
    }
    setBusy(true);
    try {
      const result = await sendJSON<{ published: unknown[]; failed: { destination: string }[] }>(
        "/api/publications",
        "POST",
        {
          destinations,
          scheduled_at: mode === "later" ? new Date(scheduledAt).toISOString() : null,
          failDestination: !only && simulateFailure ? destinations[0] : null,
        },
      );

      if (result.failed.length > 0) {
        toast({
          variant: "error",
          title: "Some channels failed",
          description: `${result.failed.map((f) => f.destination).join(", ")} did not publish.`,
          duration: 0,
          // retry only what failed, so channels that already published are not published twice
          action: {
            label: "Retry",
            onClick: () => doPublish(result.failed.map((f) => f.destination)),
          },
        });
      } else if (mode === "later") {
        toast({
          variant: "success",
          title: "Scheduled successfully",
          description: `Publishing on ${new Date(scheduledAt).toLocaleString()}.`,
        });
      } else {
        toast({
          variant: "success",
          title: "Published successfully",
          description: `Live across ${chosen().length} channels.`,
        });
        router.push("/monitoring");
        router.refresh();
      }
    } catch (e) {
      toast({
        variant: "error",
        title: "Publish failed",
        description: e instanceof Error ? e.message : undefined,
        action: { label: "Retry", onClick: () => doPublish(destinations) },
        duration: 0,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading text-text">Publishing</h2>
        <span className="text-caption text-text-faint">Ready to publish</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader
            title="Distribution Channels"
            description="Select where this video and its language variants will be published."
          />
          <div className="flex flex-col divide-y divide-line">
            {CHANNELS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.id} className="flex items-center gap-3 px-6 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-control bg-bg text-text-sub">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-label font-medium text-text">{c.label}</span>
                    <span className="block text-caption text-text-faint">{c.sub}</span>
                  </span>
                  <Toggle
                    label={`Publish to ${c.label}`}
                    on={selected[c.id]}
                    onChange={(v) => setSelected((s) => ({ ...s, [c.id]: v }))}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Schedule" />
            <div className="flex flex-col gap-3 p-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  checked={mode === "now"}
                  onChange={() => setMode("now")}
                  className="mt-1 accent-primary"
                />
                <span>
                  <span className="block text-label font-medium text-text">Publish now</span>
                  <span className="block text-caption text-text-faint">
                    Goes live immediately across selected channels
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  checked={mode === "later"}
                  onChange={() => setMode("later")}
                  className="mt-1 accent-primary"
                />
                <span className="flex-1">
                  <span className="mb-2 block text-label font-medium text-text">
                    Schedule for later
                  </span>
                  <DateTimePicker
                    value={scheduledAt}
                    onChange={setScheduledAt}
                    disabled={mode !== "later"}
                  />
                </span>
              </label>
            </div>
          </Card>

          <Card className="p-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-caption text-text-sub">
                Simulate a channel failure (demo the error toast)
              </span>
            </label>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.push("/vernacular")}>
          Back
        </Button>
        <Button onClick={() => doPublish()} loading={busy}>
          {mode === "later" ? "Schedule" : "Publish Now"}
        </Button>
      </div>
    </div>
  );
}
