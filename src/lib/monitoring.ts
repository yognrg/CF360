/**
 * Monitoring maths. The seed only stores a 30-day snapshot, so this builds a
 * deterministic daily series that reproduces it exactly: the last 30 days sum
 * (or average) to the seeded KPI, and the 30 days before differ by the seeded
 * change. 7- and 90-day views are read from the same series, so every range
 * stays consistent with the snapshot.
 */
import type { Metric, MonitoringKpi } from "@/lib/types";

export type MetricKey = "views" | "ctr" | "conversions" | "watch";
export type RangeDays = 7 | 30 | 90;

export const RANGES: RangeDays[] = [7, 30, 90];
const DAYS = 180; // two of the longest range, so 90D also has a previous period
const BLOCK = 30;

export const METRICS: Record<
  MetricKey,
  { label: string; short: string; kind: "sum" | "avg"; unit: string }
> = {
  views: { label: "Total Views", short: "Views", kind: "sum", unit: "" },
  ctr: { label: "Click-through Rate", short: "CTR", kind: "avg", unit: "%" },
  conversions: { label: "Conversions", short: "Conversions", kind: "sum", unit: "" },
  watch: { label: "Avg Watch Time", short: "Watch time", kind: "avg", unit: "s" },
};

export type Point = { date: string; value: number };
export type RangeStat = {
  current: number;
  previous: number;
  /** relative % for sums and watch time, percentage points for CTR */
  delta: number;
  series: Point[];
  previousSeries: Point[];
};

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const num = (s: string) => parseFloat(s.replace(/[^\d.-]/g, "")) || 0;

/** One value per day, oldest first, built to hit `blocks` (oldest block first). */
function daily(blocks: number[], kind: "sum" | "avg", seed: number, swing: number) {
  const rand = rng(seed);
  const out: number[] = [];
  blocks.forEach((target, b) => {
    const w = Array.from({ length: BLOCK }, (_, d) => {
      const day = b * BLOCK + d;
      // a weekly rhythm (weekends lift short video) plus a little day-to-day noise
      return 1 + swing * Math.sin((2 * Math.PI * (day + 2)) / 7) + swing * (rand() - 0.5);
    });
    const mean = w.reduce((s, x) => s + x, 0) / BLOCK;
    w.forEach((x) => {
      out.push(kind === "sum" ? (target / BLOCK) * (x / mean) : target * (x / mean));
    });
  });
  return out;
}

export function buildMonitoring(kpis: MonitoringKpi[], channels: Metric[], languages: Metric[]) {
  const kpi = (id: string) => kpis.find((k) => k.id === id);
  const views = channels.reduce((s, c) => s + c.views, 0);
  const conversions = languages.reduce((s, l) => s + l.conversions, 0);
  const ctr = num(kpi("k_ctr")?.value ?? "0");
  const watch = num(kpi("k_watch")?.value ?? "0");
  const change = (id: string) => num(kpi(id)?.delta ?? "0");

  // older blocks drift down gently, so the long view shows steady growth
  const sumBlocks = (latest: number, pct: number) => {
    const prev = latest / (1 + pct / 100);
    return [1.2, 1.15, 1.11, 1.07, 1].map((f) => prev / f).concat(latest);
  };
  const series: Record<MetricKey, number[]> = {
    views: daily(sumBlocks(views, change("k_views")), "sum", 11, 0.12),
    conversions: daily(sumBlocks(conversions, change("k_conv")), "sum", 23, 0.14),
    ctr: daily(
      [0.6, 0.45, 0.3, 0.15, 0].map((d) => ctr - change("k_ctr") - d).concat(ctr),
      "avg",
      37,
      0.05,
    ),
    watch: daily(
      [1.04, 1.03, 1.02, 1.01, 1]
        .map((f) => (watch / (1 + change("k_watch") / 100)) * f)
        .concat(watch),
      "avg",
      41,
      0.04,
    ),
  };

  const end = new Date(channels[0]?.captured_at ?? Date.now());
  const dateOf = (i: number) => {
    const d = new Date(end);
    d.setDate(d.getDate() - (DAYS - 1 - i));
    return d.toISOString().slice(0, 10);
  };

  function stat(key: MetricKey, range: RangeDays): RangeStat {
    const s = series[key];
    const cur = s.slice(DAYS - range);
    const prev = s.slice(DAYS - 2 * range, DAYS - range);
    const agg = (xs: number[]) =>
      METRICS[key].kind === "sum"
        ? xs.reduce((a, b) => a + b, 0)
        : xs.reduce((a, b) => a + b, 0) / xs.length;
    const current = agg(cur);
    const previous = agg(prev);
    const delta = key === "ctr" ? current - previous : (current / previous - 1) * 100;
    return {
      current,
      previous,
      delta,
      series: cur.map((value, i) => ({ date: dateOf(DAYS - range + i), value })),
      previousSeries: prev.map((value, i) => ({ date: dateOf(DAYS - 2 * range + i), value })),
    };
  }

  return { stat, views };
}

export function formatMetric(key: MetricKey, v: number): string {
  if (key === "views") {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `${Math.round(v / 1_000)}K`;
    return `${Math.round(v)}`;
  }
  if (key === "conversions") return Math.round(v).toLocaleString("en-IN");
  if (key === "ctr") return `${v.toFixed(1)}%`;
  return `${v.toFixed(1)}s`;
}

export function formatDelta(key: MetricKey, d: number): string {
  const sign = d > 0 ? "+" : d < 0 ? "−" : "";
  const abs = Math.abs(d).toFixed(1);
  return key === "ctr" ? `${sign}${abs} pts` : `${sign}${abs}%`;
}
