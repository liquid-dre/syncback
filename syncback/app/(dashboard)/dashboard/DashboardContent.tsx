"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  PerformanceOverviewSection,
  type PerformanceOverviewSectionProps,
} from "./sections/PerformanceOverviewSection";
import {
  RatingDistributionSection,
  type RatingDistributionSectionProps,
} from "./sections/RatingDistributionSection";
import { RatingTrendSection, type RatingTrendSectionProps } from "./sections/RatingTrendSection";
import { RecentFeedbackSection, type RecentFeedbackSectionProps } from "./sections/RecentFeedbackSection";
import { RecentRatingsSection, type RecentRatingsSectionProps } from "./sections/RecentRatingsSection";

const ONE_HOUR_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15_000;

type DashboardData = {
  metrics: PerformanceOverviewSectionProps["metrics"];
  ratingTrend: RatingTrendSectionProps["data"];
  ratingDistribution: RatingDistributionSectionProps["data"];
  recentRatings: RecentRatingsSectionProps["ratings"];
  recentFeedback: RecentFeedbackSectionProps["feedback"];
  totalFeedbackCount: number;
} | null;

type DashboardResponse = {
  businessName: string;
  dashboardData: DashboardData;
  hasConvexError: boolean;
};

export type DashboardContentProps = {
  initialBusinessName: string;
  initialDashboardData: DashboardData;
  initialHasConvexError: boolean;
};

export function DashboardContent({
  initialBusinessName,
  initialDashboardData,
  initialHasConvexError,
}: DashboardContentProps) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData);
  const [hasConvexError, setHasConvexError] = useState(initialHasConvexError);
  const [isReloading, setIsReloading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const activeRequest = useRef<AbortController | null>(null);
  const isMounted = useRef(true);
  const isReloadingRef = useRef(false);

  useEffect(() => {
    setBusinessName(initialBusinessName);
  }, [initialBusinessName]);

  useEffect(() => {
    setDashboardData(initialDashboardData);
  }, [initialDashboardData]);

  useEffect(() => {
    setHasConvexError(initialHasConvexError);
  }, [initialHasConvexError]);

  useEffect(() => {
    if (!initialHasConvexError && initialDashboardData) {
      setLastUpdatedAt(Date.now());
    }
  }, [initialDashboardData, initialHasConvexError]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      activeRequest.current?.abort();
    };
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (isReloadingRef.current) {
      return;
    }

    const controller = new AbortController();
    let didTimeout = false;
    const timeoutId = window.setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);
    activeRequest.current?.abort();
    activeRequest.current = controller;
    isReloadingRef.current = true;
    setIsReloading(true);

    try {
      const response = await fetch("/api/dashboard/data", {
        cache: "no-store",
        method: "GET",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh dashboard data: ${response.statusText}`);
      }

      const payload = (await response.json()) as DashboardResponse;

      if (!isMounted.current) {
        return;
      }

      setBusinessName(payload.businessName || "Your business");
      setHasConvexError(Boolean(payload.hasConvexError));

      if (!payload.hasConvexError) {
        setDashboardData(payload.dashboardData ?? null);
        setLastUpdatedAt(Date.now());
      } else if (payload.dashboardData) {
        setDashboardData(payload.dashboardData);
      }
    } catch (error) {
      const abortError = error as Error;
      const isAbortError = abortError.name === "AbortError";

      if (isAbortError && !didTimeout) {
        return;
      }

      const logMessage = didTimeout
        ? "Dashboard refresh request timed out"
        : "Failed to refresh dashboard data";
      console.error(logMessage, error);

      if (isMounted.current) {
        setHasConvexError(true);
        router.refresh();
      }
    } finally {
      window.clearTimeout(timeoutId);
      if (isMounted.current) {
        setIsReloading(false);
      }

      if (activeRequest.current === controller) {
        activeRequest.current = null;
      }

      isReloadingRef.current = false;
    }
  }, [router]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "hidden") {
        return;
      }

      refreshDashboard();
    }, ONE_HOUR_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refreshDashboard]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      if (lastUpdatedAt === null) {
        refreshDashboard();
        return;
      }

      if (Date.now() - lastUpdatedAt >= ONE_HOUR_MS) {
        refreshDashboard();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lastUpdatedAt, refreshDashboard]);

  const totalFeedbackCount = dashboardData?.totalFeedbackCount ?? 0;

  const lastUpdatedAtMemo = useMemo(() => lastUpdatedAt, [lastUpdatedAt]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 sm:px-8 lg:px-12">
      <PerformanceOverviewSection
        businessName={businessName}
        metrics={dashboardData?.metrics ?? []}
        hasConvexError={hasConvexError}
        onReload={refreshDashboard}
        isReloading={isReloading}
        lastUpdatedAt={lastUpdatedAtMemo}
        autoRefreshIntervalMs={ONE_HOUR_MS}
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <RatingTrendSection data={dashboardData?.ratingTrend ?? []} />
        <RatingDistributionSection data={dashboardData?.ratingDistribution ?? []} />
      </div>
      <RecentRatingsSection ratings={dashboardData?.recentRatings ?? []} totalCount={totalFeedbackCount} />
      <RecentFeedbackSection feedback={dashboardData?.recentFeedback ?? []} totalCount={totalFeedbackCount} />
    </main>
  );
}
