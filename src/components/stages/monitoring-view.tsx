"use client";

import { useMemo, useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Lightbulb } from "lucide-react";
import { chartBlues, colors } from "@/tokens";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  buildMonitoring,
  formatDelta,
  formatMetric,
  METRICS,
  RANGES,
  type MetricKey,
  type RangeDays,
} from "@/lib/monitoring";
import type { Metric, MonitoringKpi } from "@/lib/types";

const KEYS: MetricKey[] = ["views", "ctr", "conversions", "watch"];

export function MonitoringView({
  kpis,
  channels,
  languages,
}: {
  kpis: MonitoringKpi[];
  channels: Metric[];
  languages: Metric[];
}) {
  const [range, setRange] = useState<RangeDays>(30);
  const [metric, setMetric] = useState<MetricKey>("views");
  const [by, setBy] = useState<"channel" | "language">("channel");

  const model = useMemo(() => buildMonitoring(kpis, channels, languages), [kpis, channels, languages]);
  const stats = useMemo(
    () => Object.fromEntries(KEYS.map((k) => [k, model.stat(k, range)])) as Record<MetricKey, ReturnType<typeof model.stat>>,
    [model, range],
  );
  // breakdown rows are a 30-day snapshot; sums scale with the range, rates stay
  const scale = stats.views.current / model.views;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-heading text-text">Monitoring</h2>
          <p className="text-caption text-text-faint">
            Gold Loan offer reel, all channels and languages
          </p>
        </div>
        <Segmented
          label="Date range"
          value={range}
          onChange={setRange}
          options={RANGES.map((r) => ({ value: r, label: `${r}D`, title: `Last ${r} days` }))}
        />
      </div>

      {/* KPI cards double as the metric picker for the whole screen */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" role="group" aria-label="Choose a metric">
        {KEYS.map((k) => (
          <KpiCard
            key={k}
            metricKey={k}
            stat={stats[k]}
            active={metric === k}
            onSelect={() => setMetric(k)}
          />
        ))}
      </div>

      <Highlights channels={channels} languages={languages} stats={stats} range={range} />

      <Card className="mt-4">
        <CardHeader
          title={`${METRICS[metric].short} over time`}
          description={`Daily, last ${range} days`}
          action={
            <div className="flex items-center gap-4 text-caption text-text-sub">
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-4 rounded-pill bg-primary" />
                This period
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 border-t-2 border-dashed border-text-faint/60" />
                Previous
              </span>
            </div>
          }
        />
        <TrendChart metricKey={metric} stat={stats[metric]} range={range} />
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader
            title={`${METRICS[metric].short} by ${by}`}
            description={by === "channel" ? "Where the reel was shown" : "Which dub or subtitle version"}
            action={
              <Segmented
                label="Break down by"
                value={by}
                onChange={setBy}
                options={[
                  { value: "channel", label: "Channel" },
                  { value: "language", label: "Language" },
                ]}
              />
            }
          />
          <Breakdown rows={by === "channel" ? channels : languages} metricKey={metric} scale={scale} by={by} />
        </Card>

        <Card>
          <CardHeader title="Language mix" description="Share of views" />
          <LanguageDonut languages={languages} scale={scale} />
        </Card>
      </div>
    </div>
  );
}

/* ── pieces ─────────────────────────────────────────────────────────────── */

function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; title?: string }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-control border border-border bg-bg p-0.5">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            title={o.title}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-8 rounded-[6px] px-3 text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              on ? "bg-surface text-text shadow-card" : "text-text-sub hover:text-text",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function DeltaChip({ metricKey, delta }: { metricKey: MetricKey; delta: number }) {
  // every metric here is better when it goes up
  const good = delta >= 0;
  const Icon = delta >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 whitespace-nowrap rounded-pill px-2 py-0.5 text-caption font-medium",
        good ? "bg-success-soft text-success-ink" : "bg-danger-soft text-danger-ink",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {formatDelta(metricKey, delta)}
    </span>
  );
}

function KpiCard({
  metricKey,
  stat,
  active,
  onSelect,
}: {
  metricKey: MetricKey;
  stat: { current: number; delta: number; series: { value: number }[] };
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "group rounded-card border bg-surface p-4 text-left shadow-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        active ? "border-primary ring-1 ring-primary" : "border-border hover:border-text-faint/40",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={cn("text-caption", active ? "font-medium text-primary" : "text-text-sub")}>
          {METRICS[metricKey].label}
        </p>
      </div>
      <p className="mt-2 text-display font-bold tabular-nums text-text">
        {formatMetric(metricKey, stat.current)}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <DeltaChip metricKey={metricKey} delta={stat.delta} />
        <Sparkline values={stat.series.map((p) => p.value)} active={active} />
      </div>
    </button>
  );
}

function Sparkline({ values: raw, active }: { values: number[]; active: boolean }) {
  // a rolling average, so the card shows the direction rather than every weekly wobble
  const win = Math.max(1, Math.round(raw.length / 5));
  const values = raw.map((_, i) => {
    const part = raw.slice(Math.max(0, i - win + 1), i + 1);
    return part.reduce((a, b) => a + b, 0) / part.length;
  });
  const w = 72;
  const h = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - 2 - ((v - min) / (max - min || 1)) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="hidden shrink-0 sm:block">
      <polyline
        points={pts}
        fill="none"
        stroke={active ? colors.primary : colors["text-faint"]}
        strokeOpacity={active ? 1 : 0.5}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Highlights({
  channels,
  languages,
  stats,
  range,
}: {
  channels: Metric[];
  languages: Metric[];
  stats: Record<MetricKey, { delta: number }>;
  range: RangeDays;
}) {
  const totalCh = channels.reduce((s, c) => s + c.views, 0);
  const topCh = [...channels].sort((a, b) => b.views - a.views)[0];
  const byCtr = [...languages].sort((a, b) => b.ctr - a.ctr);
  const best = byCtr[0];
  const worst = byCtr[byCtr.length - 1];
  const items = [
    topCh && `${topCh.variant_label} brings ${Math.round((topCh.views / totalCh) * 100)}% of all views.`,
    best && worst && `${best.variant_label} has the best click-through at ${best.ctr}%, ${worst.variant_label} the lowest at ${worst.ctr}%.`,
    `Views are ${stats.views.delta >= 0 ? "up" : "down"} ${Math.abs(stats.views.delta).toFixed(1)}% and watch time ${stats.watch.delta >= 0 ? "up" : "down"} ${Math.abs(stats.watch.delta).toFixed(1)}% against the previous ${range} days.`,
  ].filter(Boolean) as string[];

  return (
    <Card className="mt-4 px-6 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-primary-soft text-primary">
          <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <ul className="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-3">
          {items.map((t) => (
            <li key={t} className="text-body-relaxed text-text-sub">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function TrendChart({
  metricKey,
  stat,
  range,
}: {
  metricKey: MetricKey;
  stat: { series: { date: string; value: number }[]; previousSeries: { value: number }[] };
  range: RangeDays;
}) {
  const data = stat.series.map((p, i) => ({
    date: p.date,
    current: p.value,
    previous: stat.previousSeries[i]?.value,
  }));
  const fmtAxis = (v: number) =>
    metricKey === "views"
      ? v >= 1000
        ? `${Math.round(v / 1000)}K`
        : `${Math.round(v)}`
      : metricKey === "conversions"
        ? `${Math.round(v)}`
        : formatMetric(metricKey, v);

  return (
    <div className="h-64 px-2 pb-2 pt-4 sm:px-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 24, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={0.12} />
              <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={colors.line} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tick={{ fontSize: 12, fill: colors["text-faint"] }}
            tickLine={false}
            axisLine={false}
            interval={range === 7 ? 0 : range === 30 ? 6 : 14}
            minTickGap={16}
          />
          <YAxis
            tick={{ fontSize: 12, fill: colors["text-faint"] }}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => fmtAxis(Number(v))}
            domain={METRICS[metricKey].kind === "avg" ? ["auto", "auto"] : [0, "auto"]}
          />
          <Tooltip
            cursor={{ stroke: colors.border }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-control border border-border bg-surface px-3 py-2 text-caption shadow-toast">
                  <p className="mb-1 font-medium text-text">{shortDate(String(label))}</p>
                  <p className="text-text-sub">
                    This period: <span className="font-medium tabular-nums text-text">{formatMetric(metricKey, Number(payload[0]?.payload.current))}</span>
                  </p>
                  {payload[0]?.payload.previous != null && (
                    <p className="text-text-faint">
                      Previous: <span className="tabular-nums">{formatMetric(metricKey, Number(payload[0].payload.previous))}</span>
                    </p>
                  )}
                </div>
              ) : null
            }
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke={colors["text-faint"]}
            strokeOpacity={0.6}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="current"
            stroke={colors.primary}
            strokeWidth={2}
            fill="url(#trendFill)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: colors.surface, fill: colors.primary }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function valueOf(row: Metric, key: MetricKey, scale: number) {
  if (key === "views") return row.views * scale;
  if (key === "conversions") return row.conversions * scale;
  if (key === "ctr") return row.ctr;
  return row.watch_through;
}

function Breakdown({
  rows,
  metricKey,
  scale,
  by,
}: {
  rows: Metric[];
  metricKey: MetricKey;
  scale: number;
  by: "channel" | "language";
}) {
  // conversions are attributed to a language version, not to where it was shown
  if (metricKey === "conversions" && by === "channel") {
    return (
      <p className="px-6 py-8 text-center text-body-relaxed text-text-sub">
        Conversions are counted per language version, not per channel.
        <br />
        Switch to <span className="font-medium text-text">Language</span> to see them.
      </p>
    );
  }

  const isSum = METRICS[metricKey].kind === "sum";
  const list = rows
    .map((r) => ({ label: r.variant_label, value: valueOf(r, metricKey, scale) }))
    .sort((a, b) => b.value - a.value);
  const max = list[0]?.value || 1;
  const total = list.reduce((s, r) => s + r.value, 0) || 1;
  const fmt = (v: number) => (metricKey === "watch" ? `${v}%` : formatMetric(metricKey, v));

  return (
    <div className="px-6 py-4">
      {metricKey === "watch" && (
        <p className="mb-3 text-caption text-text-faint">Watch-through: share of viewers who reach the end.</p>
      )}
      <ol className="flex flex-col gap-4">
        {list.map((r, i) => (
          <li key={r.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-4">
              <span className="flex items-baseline gap-2 text-label text-text">
                <span className="w-4 text-caption tabular-nums text-text-faint">{i + 1}</span>
                {r.label}
              </span>
              <span className="flex items-baseline gap-2 tabular-nums">
                <span className="text-label text-text">{fmt(r.value)}</span>
                {isSum && (
                  <span className="w-9 text-right text-caption text-text-faint">
                    {Math.round((r.value / total) * 100)}%
                  </span>
                )}
              </span>
            </div>
            <div className="ml-6 h-2 rounded-pill bg-bg">
              <div
                className={cn("h-2 rounded-pill", i === 0 ? "bg-primary" : "bg-primary/40")}
                style={{ width: `${(r.value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ol>
      {isSum && (
        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4 text-label">
          <span className="text-text-sub">
            Total, {list.length} {by === "channel" ? "channels" : "languages"}
          </span>
          <span className="tabular-nums text-text">{fmt(total)}</span>
        </div>
      )}
    </div>
  );
}

function LanguageDonut({ languages, scale }: { languages: Metric[]; scale: number }) {
  const data = [...languages]
    .sort((a, b) => b.views - a.views)
    .map((l) => ({ name: l.variant_label, value: l.views * scale }));
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-4">
      <div className="relative h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={1.5}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {data.map((d, i) => (
                <Cell key={d.name} fill={chartBlues[i % chartBlues.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-heading tabular-nums text-text">{formatMetric("views", total)}</span>
          <span className="text-caption text-text-faint">in {data.length} languages</span>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-label">
            <span className="h-2.5 w-2.5 rounded-pill ring-1 ring-inset ring-text/10" style={{ background: chartBlues[i % chartBlues.length] }} />
            <span className="flex-1 text-text">{d.name}</span>
            <span className="tabular-nums text-text-sub">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
