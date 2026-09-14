"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  variant?: ToastVariant;
  title: string;
  description?: string;
  /** Optional action button, e.g. "Retry". */
  action?: { label: string; onClick: () => void };
  /** Auto-dismiss after ms. Default 5000; pass 0 to disable. */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: typeof Info; iconClass: string; ring: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-success",
    ring: "border-l-success",
  },
  error: { icon: XCircle, iconClass: "text-danger", ring: "border-l-danger" },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-warning",
    ring: "border-l-warning",
  },
  info: { icon: Info, iconClass: "text-primary", ring: "border-l-primary" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = { variant: "info", duration: 5000, ...opts, id };
      setItems((prev) => [...prev, item]);
      if (item.duration && item.duration > 0) {
        setTimeout(() => dismiss(id), item.duration);
      }
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[360px] max-w-[calc(100vw-32px)] flex-col gap-2">
        {items.map((t) => {
          const style = VARIANT_STYLES[t.variant ?? "info"];
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-2 rounded-card border border-border border-l-4 bg-surface p-4 shadow-toast",
                style.ring,
              )}
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.iconClass)} />
              <div className="min-w-0 flex-1">
                <p className="text-label font-medium text-text">{t.title}</p>
                {t.description && (
                  <p className="mt-1 text-body text-text-sub">{t.description}</p>
                )}
                {t.action && (
                  <button
                    type="button"
                    onClick={() => {
                      t.action?.onClick();
                      dismiss(t.id);
                    }}
                    className="mt-2 text-label font-medium text-primary hover:underline"
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-control p-1 text-text-faint hover:bg-bg hover:text-text-sub"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
