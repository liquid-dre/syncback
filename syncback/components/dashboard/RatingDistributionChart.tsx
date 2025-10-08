"use client";

import type { CSSProperties } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type RatingDistributionDatum = {
  segment: string;
  value: number;
  label: string;
};

type RatingDistributionChartProps = {
  data: RatingDistributionDatum[];
};

const tooltipStyles: CSSProperties = {
  backgroundColor: "rgba(15, 23, 42, 0.9)",
  border: "none",
  borderRadius: "16px",
  color: "white",
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
  padding: "12px 16px",
};

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  const maxValue = data.reduce(
    (currentMax, entry) =>
      Number.isFinite(entry.value) ? Math.max(currentMax, entry.value) : currentMax,
    0,
  );
  const domainMax = Math.max(10, Math.ceil((maxValue + 5) / 10) * 10);

  return (
    <ResponsiveContainer width="100%" height="100%" className="text-slate-500 dark:text-slate-300">
      <RadarChart data={data} outerRadius="70%">
        <defs>
          <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <PolarGrid stroke="currentColor" strokeOpacity={0.25} radialLines={false} />
        <PolarAngleAxis dataKey="segment" tick={{ fill: "currentColor", fontSize: 12 }} />
        <PolarRadiusAxis
          angle={45}
          domain={[0, domainMax]}
          tickCount={5}
          tick={{ fill: "currentColor", fontSize: 11 }}
        />
        <Radar
          name="Ratings"
          dataKey="value"
          stroke="#10b981"
          fill="url(#radarGradient)"
          fillOpacity={0.65}
          animationDuration={800}
          animationEasing="ease-in-out"
        />
        <Tooltip
          contentStyle={tooltipStyles}
          formatter={(value: number) => [`${value}%`, "Share"]}
          labelFormatter={(label: string, payload) => {
            const firstDatum = payload?.[0]?.payload as RatingDistributionDatum | undefined;
            if (firstDatum) {
              return firstDatum.label;
            }
            const parsedLabel = Number.parseFloat(label);
            if (Number.isFinite(parsedLabel)) {
              const isSingular = Math.abs(parsedLabel - 1) < 1e-8;
              return `${Number.isInteger(parsedLabel) ? parsedLabel : parsedLabel.toFixed(1)} ${
                isSingular ? "Star" : "Stars"
              }`;
            }
            return label;
          }}
          labelStyle={{
            color: "rgba(226, 232, 240, 0.8)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
