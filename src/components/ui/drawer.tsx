"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  width = 480,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  width?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);

  // a closed drawer stays in the DOM for its slide-out, so keep it out of the tab order
  useEffect(() => {
    if (root.current) root.current.inert = !open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* scrim */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-text/20 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      {/* panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{ width }}
        className={cn(
          "absolute right-0 top-0 flex h-full max-w-[92vw] flex-col bg-surface shadow-drawer transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h2 className="text-heading text-text">{title}</h2>
            {subtitle && <p className="mt-1 text-body text-text-sub">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-control p-1 text-text-faint hover:bg-bg hover:text-text-sub"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        {footer && (
          <div className="border-t border-line px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
