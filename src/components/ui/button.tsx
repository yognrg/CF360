import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger";
export type ButtonSize = "default" | "sm";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 disabled:bg-primary/40",
  secondary:
    "bg-surface text-text border border-border hover:bg-bg disabled:opacity-50",
  ghost: "bg-transparent text-text-sub hover:bg-bg disabled:opacity-50",
  soft: "bg-primary-soft text-primary hover:bg-primary-soft/70 disabled:opacity-50",
  // the -ink shade, because white on the base red is only 3.8:1
  danger: "bg-danger-ink text-white hover:bg-danger-ink/90 disabled:bg-danger-ink/40",
};

const SIZES: Record<ButtonSize, string> = {
  default: "h-control px-4 text-label",
  sm: "h-8 px-3 text-label",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed";

/** Button styles for a link that should look like a button (a <button> inside an <a> is invalid). */
export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "default") {
  return cn(BASE, VARIANTS[variant], SIZES[size]);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "default", loading, className, children, disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        BASE,
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
