import type { RatingDistributionChart } from "@/components/dashboard/RatingDistributionChart";
import type { RatingTrendChart } from "@/components/dashboard/RatingTrendChart";
import type { RecentFeedbackTable } from "@/components/dashboard/RecentFeedbackTable";
import type { RecentRatingsAreaChart } from "@/components/dashboard/RecentRatingsAreaChart";
import type { StatsGrid } from "@/components/dashboard/StatsGrid";

export type StatsGridProps = Parameters<typeof StatsGrid>[0];
export type RatingTrendChartProps = Parameters<typeof RatingTrendChart>[0];
export type RatingDistributionChartProps = Parameters<typeof RatingDistributionChart>[0];
export type RecentRatingsAreaChartProps = Parameters<typeof RecentRatingsAreaChart>[0];
export type RecentFeedbackTableProps = Parameters<typeof RecentFeedbackTable>[0];
