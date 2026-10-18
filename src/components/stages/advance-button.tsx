"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { sendJSON } from "@/lib/client";
import type { Stage } from "@/lib/types";

export function AdvanceButton({
  to,
  href,
  children,
  toastTitle,
  toastDescription,
  variant,
  onDone,
  body,
  disabled,
}: {
  to: Stage;
  href?: string;
  children: React.ReactNode;
  toastTitle: string;
  toastDescription?: string;
  variant?: ButtonProps["variant"];
  onDone?: () => void;
  /** Extra fields sent with the advance call (e.g. a reviewer comment). */
  body?: Record<string, unknown>;
  disabled?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const go = async () => {
    setBusy(true);
    try {
      await sendJSON("/api/requests/advance", "POST", { to, ...body });
      toast({ variant: "success", title: toastTitle, description: toastDescription });
      onDone?.();
      if (href) router.push(href);
      router.refresh();
    } catch (e) {
      toast({
        variant: "error",
        title: "Action failed",
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button onClick={go} loading={busy} variant={variant} disabled={disabled}>
      {children}
    </Button>
  );
}
