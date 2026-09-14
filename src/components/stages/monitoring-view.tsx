"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { fmtCompact } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Metric, MonitoringKpi } from "@/lib/types";

const BAR_COLORS = ["#2563EB", "#60A5FA", "#93C5FD", "#BFDBFE"];

export function MonitoringView({
  kpis,
  channels,
  languages,
}: {
  kpis: MonitoringKpi[];
  channels: Metric[];
  languages: Metric[];
}) {
  const chartData = channels
    .slice()
    .sort((a, b) => b.views - a.views)
    .map((c) => ({ name: c.variant_label, views: c.views }));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading text-text">Monitoring</h2>
        <span className="text-caption text-text-faint">Last 30 days</span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.id} className="p-4">
            <p className="text-caption text-text-sub">{k.label}</p>
            <p className="mt-2 text-display font-bold text-text">{k.value}</p>
            <p className="mt-1 flex items-center gap-1 text-caption">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  k.direction === "up" ? "text-success" : "text-danger",
                )}
              >
                {k.direction === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {k.delta}
              </span>
              <span className="text-text-faint">{k.sub}</span>
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Views by channel chart */}
        <Card>
          <CardHeader title="Views by Channel" />
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F2" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => fmtCompact(Number(v))}
                />
                <Tooltip
                  formatter={(v) => [fmtCompact(Number(v)), "Views"]}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E5E7EB",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="views" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Performance by language */}
        <Card>
          <CardHeader title="Performance by Language" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {["Language", "Impressions", "CTR", "Conversions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-caption font-medium text-text-sub">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {languages.map((m) => (
                  <tr key={m.id} className="border-b border-line last:border-0">
                    <td className="px-6 py-3 text-label font-medium text-text">
                      {m.variant_label}
                    </td>
                    <td className="px-6 py-3 text-body tabular-nums text-text-sub">
                      {fmtCompact(m.views)}
                    </td>
                    <td className="px-6 py-3 text-body tabular-nums text-text-sub">
                      {m.ctr}%
                    </td>
                    <td className="px-6 py-3 text-body tabular-nums text-text-sub">
                      {m.conversions.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
