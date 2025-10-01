"use client";

import type { CSSProperties } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RatingsTrendDatum = {
  month: string;
  average: number;
};

type RatingTrendChartProps = {
  data: RatingsTrendDatum[];
};

const tooltipStyles: CSSProperties = {
  backgroundColor: "rgba(15, 23, 42, 0.9)",
  border: "none",
  borderRadius: "16px",
  color: "white",
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
  padding: "12px 16px",
};

export function RatingTrendChart({ data }: RatingTrendChartProps) {
  const averages = data
    .map((datum) => (Number.isFinite(datum.average) ? datum.average : 0))
    .filter((value) => Number.isFinite(value));
  const minAverage = averages.length > 0 ? Math.min(...averages) : 0;
  const maxAverage = averages.length > 0 ? Math.max(...averages) : 5;
  const padding = 0.2;
  let lowerBound = Math.max(0, Math.floor((minAverage - padding) * 10) / 10);
  let upperBound = Math.min(5, Math.ceil((maxAverage + padding) * 10) / 10);

  if (!Number.isFinite(lowerBound)) {
    lowerBound = 0;
  }
  if (!Number.isFinite(upperBound) || upperBound <= lowerBound) {
    upperBound = Math.min(5, lowerBound + 1);
  }
  if (upperBound === lowerBound) {
    lowerBound = Math.max(0, lowerBound - 0.5);
    upperBound = Math.min(5, upperBound + 0.5);
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className="text-slate-500 dark:text-slate-300">
      <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 8" stroke="currentColor" strokeOpacity={0.25} vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
        <YAxis
          domain={[lowerBound, upperBound]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "currentColor", fontSize: 12 }}
          allowDecimals
        />
        <Tooltip
          cursor={{ stroke: "rgba(14,165,233,0.2)", strokeWidth: 2 }}
          contentStyle={tooltipStyles}
          labelStyle={{
            color: "rgba(226, 232, 240, 0.8)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
          formatter={(value: number) => [`${value.toFixed(2)} ★`, "Average rating"]}
        />
        <Line
          type="monotone"
          dataKey="average"
          stroke="#0ea5e9"
          strokeWidth={3}
          dot={{ r: 5, fill: "#0ea5e9", strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          fill="url(#lineGradient)"
          animationDuration={800}
          animationEasing="ease-in-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
