"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

/** value / onChange use local "yyyy-MM-dd'T'HH:mm" (same as datetime-local). */
function parseValue(value: string): Date {
  const d = value ? new Date(value) : new Date();
  return isNaN(d.getTime()) ? new Date() : d;
}
function toValue(d: Date): string {
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}) {
  const selected = useMemo(() => parseValue(value), [value]);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected));
  const [activeDate, setActiveDate] = useState(selected);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // When opening, sync view + focus the active day.
  useEffect(() => {
    if (open) {
      setViewMonth(startOfMonth(selected));
      setActiveDate(selected);
    }
  }, [open, selected]);

  // Move DOM focus to the active day button.
  useEffect(() => {
    if (!open) return;
    const el = gridRef.current?.querySelector<HTMLButtonElement>(
      '[data-active="true"]',
    );
    el?.focus();
  }, [open, activeDate]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 });
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [viewMonth]);

  const commitDate = (day: Date) => {
    const next = new Date(day);
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    onChange(toValue(next));
  };

  const setActiveAndView = (d: Date) => {
    setActiveDate(d);
    if (!isSameMonth(d, viewMonth)) setViewMonth(startOfMonth(d));
  };

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    let next: Date | null = null;
    switch (e.key) {
      case "ArrowLeft": next = addDays(activeDate, -1); break;
      case "ArrowRight": next = addDays(activeDate, 1); break;
      case "ArrowUp": next = addDays(activeDate, -7); break;
      case "ArrowDown": next = addDays(activeDate, 7); break;
      case "Home": next = startOfWeek(activeDate, { weekStartsOn: 0 }); break;
      case "PageUp": next = subMonths(activeDate, 1); break;
      case "PageDown": next = addMonths(activeDate, 1); break;
      case "Enter":
      case " ":
        e.preventDefault();
        commitDate(activeDate);
        return;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      default:
        return;
    }
    e.preventDefault();
    if (next) setActiveAndView(next);
  };

  // Time parts (12-hour).
  const hours12 = ((selected.getHours() + 11) % 12) + 1;
  const isPM = selected.getHours() >= 12;
  const setTime = (h12: number, min: number, pm: boolean) => {
    const next = new Date(selected);
    const h24 = (h12 % 12) + (pm ? 12 : 0);
    next.setHours(h24, min, 0, 0);
    onChange(toValue(next));
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-control w-full items-center justify-between gap-2 rounded-control border border-border bg-surface px-3 text-body text-text transition-colors hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
        )}
      >
        <span>{format(selected, "d MMM yyyy, h:mm a")}</span>
        <Calendar className="h-4 w-4 shrink-0 text-text-faint" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose date and time"
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-[288px] rounded-card border border-border bg-surface p-3 shadow-toast"
        >
          {/* Month header */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewMonth((m) => subMonths(m, 1))}
              className="rounded-control p-1.5 text-text-sub hover:bg-bg"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-label font-semibold text-text" aria-live="polite">
              {format(viewMonth, "MMMM yyyy")}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="rounded-control p-1.5 text-text-sub hover:bg-bg"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 text-caption font-medium text-text-faint">
                {w}
              </span>
            ))}
          </div>

          {/* Days grid */}
          <div
            ref={gridRef}
            role="grid"
            aria-label="Calendar"
            onKeyDown={onGridKeyDown}
            className="grid grid-cols-7 gap-0.5"
          >
            {days.map((day) => {
              const inMonth = isSameMonth(day, viewMonth);
              const isSelected = isSameDay(day, selected);
              const isActive = isSameDay(day, activeDate);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  role="gridcell"
                  data-active={isActive}
                  aria-selected={isSelected}
                  aria-current={isToday(day) ? "date" : undefined}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => commitDate(day)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-control text-body transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    !inMonth && "text-text-faint",
                    inMonth && !isSelected && "text-text hover:bg-bg",
                    isSelected && "bg-primary font-medium text-white hover:bg-primary/90",
                    isToday(day) && !isSelected && "ring-1 ring-inset ring-primary/40",
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* Time row */}
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <span className="text-caption font-medium text-text-faint">Time</span>
            <div className="ml-auto flex items-center gap-1">
              <TimeSelect
                aria-label="Hour"
                value={hours12}
                options={Array.from({ length: 12 }, (_, i) => i + 1)}
                format={(n) => String(n)}
                onChange={(h) => setTime(h, selected.getMinutes(), isPM)}
              />
              <span className="text-text-faint">:</span>
              <TimeSelect
                aria-label="Minute"
                value={selected.getMinutes()}
                options={
                  MINUTES.includes(selected.getMinutes())
                    ? MINUTES
                    : [...MINUTES, selected.getMinutes()].sort((a, b) => a - b)
                }
                format={(n) => String(n).padStart(2, "0")}
                onChange={(m) => setTime(hours12, m, isPM)}
              />
              <TimeSelect
                aria-label="AM or PM"
                value={isPM ? 1 : 0}
                options={[0, 1]}
                format={(n) => (n === 0 ? "AM" : "PM")}
                onChange={(v) => setTime(hours12, selected.getMinutes(), v === 1)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeSelect({
  value,
  options,
  format: fmt,
  onChange,
  "aria-label": ariaLabel,
}: {
  value: number;
  options: number[];
  format: (n: number) => string;
  onChange: (n: number) => void;
  "aria-label": string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 rounded-control border border-border bg-surface px-1.5 text-label text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {fmt(o)}
        </option>
      ))}
    </select>
  );
}
