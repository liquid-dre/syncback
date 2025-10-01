"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type RecentRating = {
  rating: number;
  receivedAt: string;
};

type RecentRatingsAreaChartProps = {
  ratings: RecentRating[];
  minimumWindow?: number;
};

const tooltipStyles: CSSProperties = {
  backgroundColor: "rgba(15, 23, 42, 0.9)",
  border: "none",
  borderRadius: "16px",
  color: "white",
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
  padding: "12px 16px",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function RecentRatingsAreaChart({
  ratings,
  minimumWindow = 5,
}: RecentRatingsAreaChartProps) {
  const totalRatings = ratings.length;

  const hasRatings = totalRatings > 0;
  const sliderMax = hasRatings ? totalRatings : minimumWindow;
  const sliderMin = hasRatings ? Math.min(minimumWindow, sliderMax) : minimumWindow;

  const [windowSize, setWindowSize] = useState(() =>
    Math.max(sliderMin, Math.min(sliderMax, minimumWindow)),
  );

  useEffect(() => {
    setWindowSize((current) => {
      if (current < sliderMin) {
        return sliderMin;
      }
      if (current > sliderMax) {
        return sliderMax;
      }
      return current;
    });
  }, [sliderMax, sliderMin]);

  const ticks = useMemo(() => {
    if (sliderMax === sliderMin) {
      return [sliderMax];
    }
    return Array.from({ length: sliderMax - sliderMin + 1 }, (_, index) => sliderMin + index);
  }, [sliderMax, sliderMin]);

  const skipInterval = useMemo(() => {
    if (ticks.length <= 6) {
      return 1;
    }
    return Math.ceil(ticks.length / 6);
  }, [ticks.length]);

  const visibleRatings = useMemo(() => {
    const count = Math.min(windowSize, sliderMax);
    return ratings.slice(sliderMax - count);
  }, [ratings, sliderMax, windowSize]);

  const chartData = useMemo(
    () =>
      visibleRatings.map((entry) => ({
        label: dateFormatter.format(new Date(entry.receivedAt)),
        rating: entry.rating,
      })),
    [visibleRatings],
  );

  const averageRating = useMemo(() => {
    if (visibleRatings.length === 0) {
      return 0;
    }
    const total = visibleRatings.reduce((sum, entry) => sum + entry.rating, 0);
    return total / visibleRatings.length;
  }, [visibleRatings]);

  if (!hasRatings) {
    return (
      <div className="flex h-full min-h-[18rem] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300">
        <p>No ratings have been collected yet. Share your feedback link to start seeing momentum here.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Label htmlFor="ratings-window" className="flex items-center justify-between text-slate-700 dark:text-slate-200">
          <span>Last {windowSize} ratings</span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Average {averageRating.toFixed(2)} ★</span>
        </Label>
        <div>
          <Slider
            id="ratings-window"
            min={sliderMin}
            max={sliderMax}
            value={[windowSize]}
            onValueChange={([value]) =>
              setWindowSize(Math.max(sliderMin, Math.min(sliderMax, value)))
            }
            aria-label="Select the number of recent ratings to display"
          />
          <span
            className="mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          >
            {ticks.map((tick, index) => {
              const showLabel =
                index % skipInterval === 0 || index === 0 || index === ticks.length - 1;
              return (
                <span key={tick} className="flex w-0 flex-col items-center justify-center gap-2">
                  <span
                    className={cn(
                      "h-1 w-px bg-slate-400/70 dark:bg-slate-600/60",
                      !showLabel && "h-0.5",
                    )}
                  />
                  <span className={cn(!showLabel && "opacity-0")}>{tick}</span>
                </span>
              );
            })}
          </span>
        </div>
      </div>

      <div className="h-72 w-full text-slate-500 dark:text-slate-300">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 8" stroke="currentColor" strokeOpacity={0.25} vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "currentColor", fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[1, 5]}
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
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
              formatter={(value: number) => [`${value.toFixed(2)} ★`, "Rating"]}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke="#0ea5e9"
              strokeWidth={3}
              fill="url(#areaGradient)"
              dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
