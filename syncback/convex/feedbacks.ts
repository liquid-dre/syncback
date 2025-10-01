import { mutation, query, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";

type FeedbackDoc = Doc<"feedbacks">;

function averageRating(entries: FeedbackDoc[]) {
  if (entries.length === 0) {
    return 0;
  }

  const total = entries.reduce((sum, entry) => sum + entry.rating, 0);
  return total / entries.length;
}

function percentageShare(entries: FeedbackDoc[], predicate: (entry: FeedbackDoc) => boolean) {
  if (entries.length === 0) {
    return 0;
  }

  const matches = entries.reduce((count, entry) => (predicate(entry) ? count + 1 : count), 0);
  return (matches / entries.length) * 100;
}

function percentChange(current: number, previous: number, { allowInfinity = false } = {}) {
  if (Number.isNaN(current) || Number.isNaN(previous)) {
    return 0;
  }

  if (previous === 0) {
    if (!allowInfinity) {
      return 0;
    }
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

async function fetchAllFeedback(ctx: QueryCtx, businessId: Id<"businesses">) {
  const feedback: FeedbackDoc[] = [];
  let cursor: string | undefined;

  while (true) {
    const page = await ctx.db
      .query("feedbacks")
      .withIndex("by_businessId_createdAt", (q) => q.eq("businessId", businessId))
      .order("desc")
      .paginate(cursor ? { cursor, numItems: 200 } : { numItems: 200 });

    feedback.push(...page.page);

    if (page.done) {
      break;
    }

    cursor = page.continueCursor ?? undefined;
  }

  return feedback;
}

function toDateKey(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const submit = mutation({
  args: {
    slug: v.string(),
    rating: v.number(),
    message: v.string(),
    source: v.optional(v.union(v.literal("qr"), v.literal("link"), v.literal("kiosk"))),
    ipHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.rating < 0.5 || args.rating > 5) {
      throw new Error("Rating must be between 0.5 and 5.");
    }

    if (Math.abs(args.rating * 2 - Math.round(args.rating * 2)) > 1e-8) {
      throw new Error("Rating must be provided in increments of 0.5 stars.");
    }

    if (!args.message.trim()) {
      throw new Error("Feedback message cannot be empty.");
    }

    const business = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!business) {
      throw new Error("Business not found.");
    }

    const timestamp = Date.now();
    const feedbackId = await ctx.db.insert("feedbacks", {
      businessId: business._id,
      rating: args.rating,
      message: args.message.trim(),
      createdAt: timestamp,
      status: "new",
      source: args.source ?? "qr",
      ipHash: args.ipHash,
    });

    const dateKey = toDateKey(timestamp);
    const existingAggregate = await ctx.db
      .query("aggregates_daily")
      .withIndex("by_businessId_date", (q) =>
        q.eq("businessId", business._id).eq("date", dateKey),
      )
      .unique();

    if (existingAggregate) {
      const newCount = existingAggregate.count + 1;
      const newAvg =
        (existingAggregate.avgRating * existingAggregate.count + args.rating) /
        newCount;

      await ctx.db.patch(existingAggregate._id, {
        count: newCount,
        avgRating: newAvg,
      });
    } else {
      await ctx.db.insert("aggregates_daily", {
        businessId: business._id,
        date: dateKey,
        count: 1,
        avgRating: args.rating,
        createdAt: timestamp,
      });
    }

    return { feedbackId };
  },
});

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

export const dashboardData = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const allFeedback = await fetchAllFeedback(ctx, args.businessId);

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const periodMs = 30 * dayMs;
    const currentPeriodStart = now - periodMs;
    const previousPeriodStart = currentPeriodStart - periodMs;

    const currentFeedback = allFeedback.filter((entry) => entry.createdAt >= currentPeriodStart);
    const previousFeedback = allFeedback.filter(
      (entry) => entry.createdAt >= previousPeriodStart && entry.createdAt < currentPeriodStart,
    );

    const ratingBucket = (rating: number) =>
      Math.min(5, Math.max(1, Math.round(Number.isFinite(rating) ? rating : 0)));

    const displayedAverageEntries = currentFeedback.length > 0 ? currentFeedback : allFeedback;
    const displayedAverage = averageRating(displayedAverageEntries);
    const currentAverage = averageRating(currentFeedback);
    const previousAverage = averageRating(previousFeedback);
    const averageDiff =
      currentFeedback.length > 0 && previousFeedback.length > 0
        ? percentChange(currentAverage, previousAverage)
        : 0;

    const isFiveStar = (entry: FeedbackDoc) => ratingBucket(entry.rating) === 5;
    const displayedFiveStarEntries = currentFeedback.length > 0 ? currentFeedback : allFeedback;
    const displayedFiveStarShare = percentageShare(displayedFiveStarEntries, isFiveStar);
    const currentFiveStarShare = percentageShare(currentFeedback, isFiveStar);
    const previousFiveStarShare = percentageShare(previousFeedback, isFiveStar);
    const fiveStarDiff =
      currentFeedback.length > 0 && previousFeedback.length > 0
        ? percentChange(currentFiveStarShare, previousFiveStarShare)
        : 0;

    const isResolved = (entry: FeedbackDoc) => entry.status !== "new";
    const displayedResolvedEntries = currentFeedback.length > 0 ? currentFeedback : allFeedback;
    const displayedResolvedShare = percentageShare(displayedResolvedEntries, isResolved);
    const currentResolvedShare = percentageShare(currentFeedback, isResolved);
    const previousResolvedShare = percentageShare(previousFeedback, isResolved);
    const resolvedDiff =
      currentFeedback.length > 0 && previousFeedback.length > 0
        ? percentChange(currentResolvedShare, previousResolvedShare)
        : 0;

    const currentVolume = currentFeedback.length;
    const displayedVolume = currentVolume > 0 ? currentVolume : allFeedback.length;
    const volumeDiff =
      currentVolume > 0
        ? percentChange(currentVolume, previousFeedback.length, { allowInfinity: true })
        : 0;

    const metrics =
      allFeedback.length === 0
        ? []
        : [
            {
              title: "Average rating",
              icon: "rating" as const,
              value: displayedAverage.toFixed(2),
              diff: Math.round(averageDiff),
            },
            {
              title: "5-star share",
              icon: "promoters" as const,
              value: `${Math.round(displayedFiveStarShare)}%`,
              diff: Math.round(fiveStarDiff),
            },
            {
              title: "Feedback volume",
              icon: "volume" as const,
              value: displayedVolume.toString(),
              diff: Math.round(volumeDiff),
            },
            {
              title: "Follow-up resolved",
              icon: "trends" as const,
              value: `${Math.round(displayedResolvedShare)}%`,
              diff: Math.round(resolvedDiff),
            },
          ];

    const monthsToShow = 6;
    const monthBuckets = new Map<string, { sum: number; count: number }>();
    for (const entry of allFeedback) {
      const date = new Date(entry.createdAt);
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      const bucket = monthBuckets.get(key) ?? { sum: 0, count: 0 };
      bucket.sum += entry.rating;
      bucket.count += 1;
      monthBuckets.set(key, bucket);
    }

    const trendMonths: { label: string; key: string }[] = [];
    const currentMonth = new Date();
    for (let index = monthsToShow - 1; index >= 0; index -= 1) {
      const date = new Date(
        Date.UTC(
          currentMonth.getUTCFullYear(),
          currentMonth.getUTCMonth() - index,
          1,
          0,
          0,
          0,
        ),
      );
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      trendMonths.push({ label: monthFormatter.format(date), key });
    }

    const ratingTrend = trendMonths.map(({ key, label }) => {
      const bucket = monthBuckets.get(key);
      const average = bucket && bucket.count > 0 ? bucket.sum / bucket.count : 0;
      return { month: label, average: Math.round(average * 100) / 100 };
    });

    const distributionCounts = [0, 0, 0, 0, 0, 0];
    for (const entry of allFeedback) {
      const bucket = ratingBucket(entry.rating);
      distributionCounts[bucket] += 1;
    }

    const totalFeedback = allFeedback.length;
    const ratingDistribution = [1, 2, 3, 4, 5].map((stars) => ({
      segment: `${stars} Star${stars === 1 ? "" : "s"}`,
      value:
        totalFeedback === 0
          ? 0
          : Math.round((distributionCounts[stars] / totalFeedback) * 100),
    }));

    const recentRatings = [...allFeedback]
      .reverse()
      .map((entry) => ({
        rating: entry.rating,
        receivedAt: new Date(entry.createdAt).toISOString(),
      }));

    const maxFeedbackEntries = 200;
    const recentFeedback = allFeedback.slice(0, maxFeedbackEntries).map((entry) => ({
      id: String(entry._id),
      receivedAt: new Date(entry.createdAt).toISOString(),
      feedback: entry.message,
      rating: entry.rating,
    }));

    return {
      metrics,
      ratingTrend,
      ratingDistribution,
      recentRatings,
      recentFeedback,
    };
  },
});
