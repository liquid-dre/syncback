import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
type DailyAggregateDoc = Doc<"aggregates_daily">;
type SummaryAggregateDoc = Doc<"aggregates_summary">;

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

function toDateKey(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  return Date.parse(`${dateKey}T00:00:00Z`);
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

function ensureRatingBuckets(buckets?: number[]) {
  const base = buckets && buckets.length === 6 ? buckets.slice() : new Array(6).fill(0);
  return base.map((value) => (Number.isFinite(value) ? value : 0));
}

function ratingBucket(rating: number) {
  return Math.min(5, Math.max(1, Math.round(Number.isFinite(rating) ? rating : 0)));
}

function aggregateSummary(summary: SummaryAggregateDoc | null) {
  const totalCount = summary?.totalCount ?? 0;
  const totalRatingSum = summary?.totalRatingSum ?? 0;
  const fiveStarCount = summary?.fiveStarCount ?? 0;
  const ratingBuckets = ensureRatingBuckets(summary?.ratingBuckets);

  return {
    totalCount,
    totalRatingSum,
    fiveStarCount,
    ratingBuckets,
  };
}

function sumFromAggregate(entry: DailyAggregateDoc) {
  const sumRating = entry.sumRating ?? entry.avgRating * entry.count;
  const fiveStarCount = entry.fiveStarCount ?? 0;
  return { sumRating, fiveStarCount };
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
    const ratingBucketIndex = ratingBucket(args.rating);
    const fiveStarIncrement = ratingBucketIndex === 5 ? 1 : 0;

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
      .withIndex("by_businessId_date", (q) => q.eq("businessId", business._id).eq("date", dateKey))
      .unique();

    if (existingAggregate) {
      const { sumRating } = sumFromAggregate(existingAggregate);
      const updatedCount = existingAggregate.count + 1;
      const updatedSum = sumRating + args.rating;
      const updatedFiveStars = (existingAggregate.fiveStarCount ?? 0) + fiveStarIncrement;

      await ctx.db.patch(existingAggregate._id, {
        count: updatedCount,
        sumRating: updatedSum,
        avgRating: updatedSum / updatedCount,
        fiveStarCount: updatedFiveStars,
      });
    } else {
      await ctx.db.insert("aggregates_daily", {
        businessId: business._id,
        date: dateKey,
        count: 1,
        sumRating: args.rating,
        avgRating: args.rating,
        fiveStarCount: fiveStarIncrement,
        createdAt: timestamp,
      });
    }

    const summary = await ctx.db
      .query("aggregates_summary")
      .withIndex("by_businessId", (q) => q.eq("businessId", business._id))
      .unique();

    const buckets = ensureRatingBuckets(summary?.ratingBuckets);
    buckets[ratingBucketIndex] += 1;

    if (summary) {
      await ctx.db.patch(summary._id, {
        totalCount: (summary.totalCount ?? 0) + 1,
        totalRatingSum: (summary.totalRatingSum ?? 0) + args.rating,
        fiveStarCount: (summary.fiveStarCount ?? 0) + fiveStarIncrement,
        ratingBuckets: buckets,
        lastFeedbackAt: timestamp,
      });
    } else {
      await ctx.db.insert("aggregates_summary", {
        businessId: business._id,
        totalCount: 1,
        totalRatingSum: args.rating,
        fiveStarCount: fiveStarIncrement,
        ratingBuckets: buckets,
        lastFeedbackAt: timestamp,
      });
    }

    return { feedbackId };
  },
});

export const dashboardData = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const [summary, recentFeedbackPage] = await Promise.all([
      ctx.db
        .query("aggregates_summary")
        .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
        .unique(),
      ctx.db
        .query("feedbacks")
        .withIndex("by_businessId_createdAt", (q) => q.eq("businessId", args.businessId))
        .order("desc")
        .paginate({ cursor: null, numItems: 200 }),
    ]);

    const recentFeedbackDocs = recentFeedbackPage.page;
    const summaryTotals = aggregateSummary(summary);

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const periodMs = 30 * dayMs;
    const currentPeriodStart = now - periodMs;
    const previousPeriodStart = currentPeriodStart - periodMs;

    const monthsToShow = 6;
    const currentMonth = new Date();
    const earliestMonthTimestamp = Date.UTC(
      currentMonth.getUTCFullYear(),
      currentMonth.getUTCMonth() - (monthsToShow - 1),
      1,
      0,
      0,
      0,
    );
    const earliestNeededTimestamp = Math.min(previousPeriodStart, earliestMonthTimestamp);

    const dailyAggregates: DailyAggregateDoc[] = [];
    let cursor: string | null = null;

    while (true) {
      const page = await ctx.db
        .query("aggregates_daily")
        .withIndex("by_businessId_date", (q) => q.eq("businessId", args.businessId))
        .order("desc")
        .paginate({ cursor, numItems: 200 });

      dailyAggregates.push(...page.page);

      if (page.isDone) {
        break;
      }

      const lastEntry = page.page.at(-1);
      if (!lastEntry) {
        break;
      }

      if (parseDateKey(lastEntry.date) < earliestNeededTimestamp) {
        break;
      }

      cursor = page.continueCursor ?? null;
    }

    const dailyWithTimestamp = dailyAggregates.map((entry) => ({
      entry,
      timestamp: parseDateKey(entry.date),
    }));

    const entriesForRange = (start: number, end?: number) =>
      dailyWithTimestamp.filter(({ timestamp }) => {
        if (timestamp < start) {
          return false;
        }
        if (end !== undefined && timestamp >= end) {
          return false;
        }
        return true;
      });

    const accumulate = (collection: { entry: DailyAggregateDoc }[]) => {
      return collection.reduce(
        (acc, { entry }) => {
          const { sumRating, fiveStarCount } = sumFromAggregate(entry);
          return {
            count: acc.count + entry.count,
            sum: acc.sum + sumRating,
            fiveStars: acc.fiveStars + fiveStarCount,
          };
        },
        { count: 0, sum: 0, fiveStars: 0 },
      );
    };

    const currentPeriod = accumulate(entriesForRange(currentPeriodStart));
    const previousPeriod = accumulate(entriesForRange(previousPeriodStart, currentPeriodStart));

    const totalAverage =
      summaryTotals.totalCount > 0 ? summaryTotals.totalRatingSum / summaryTotals.totalCount : 0;
    const currentAverage = currentPeriod.count > 0 ? currentPeriod.sum / currentPeriod.count : 0;
    const previousAverage = previousPeriod.count > 0 ? previousPeriod.sum / previousPeriod.count : 0;
    const displayedAverage = currentPeriod.count > 0 ? currentAverage : totalAverage;

    const totalFiveStarShare =
      summaryTotals.totalCount > 0 ? (summaryTotals.fiveStarCount / summaryTotals.totalCount) * 100 : 0;
    const currentFiveStarShare =
      currentPeriod.count > 0 ? (currentPeriod.fiveStars / currentPeriod.count) * 100 : 0;
    const previousFiveStarShare =
      previousPeriod.count > 0 ? (previousPeriod.fiveStars / previousPeriod.count) * 100 : 0;
    const displayedFiveStarShare = currentPeriod.count > 0 ? currentFiveStarShare : totalFiveStarShare;

    const averageDiff =
      currentPeriod.count > 0 && previousPeriod.count > 0
        ? percentChange(currentAverage, previousAverage)
        : 0;
    const fiveStarDiff =
      currentPeriod.count > 0 && previousPeriod.count > 0
        ? percentChange(currentFiveStarShare, previousFiveStarShare)
        : 0;

    const displayedVolume = currentPeriod.count > 0 ? currentPeriod.count : summaryTotals.totalCount;
    const volumeDiff =
      currentPeriod.count > 0
        ? percentChange(currentPeriod.count, previousPeriod.count, { allowInfinity: true })
        : 0;

    const metrics =
      summaryTotals.totalCount === 0
        ? []
        : [
            {
              title: "Average rating",
              icon: "rating" as const,
              value: displayedAverage.toFixed(2),
              diff: Math.round(averageDiff),
            },
            {
              title: "5-star share percentage",
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
          ];

    const monthBuckets = new Map<string, { sum: number; count: number }>();
    for (const { entry } of dailyWithTimestamp) {
      const key = entry.date.slice(0, 7);
      const bucket = monthBuckets.get(key) ?? { sum: 0, count: 0 };
      const { sumRating } = sumFromAggregate(entry);
      bucket.sum += sumRating;
      bucket.count += entry.count;
      monthBuckets.set(key, bucket);
    }

    const trendMonths: { label: string; key: string }[] = [];
    for (let index = monthsToShow - 1; index >= 0; index -= 1) {
      const date = new Date(
        Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - index, 1, 0, 0, 0),
      );
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      trendMonths.push({ label: monthFormatter.format(date), key });
    }

    const ratingTrend = trendMonths.map(({ key, label }) => {
      const bucket = monthBuckets.get(key);
      const average = bucket && bucket.count > 0 ? bucket.sum / bucket.count : 0;
      return { month: label, average: Math.round(average * 100) / 100 };
    });

    const ratingDistribution = [1, 2, 3, 4, 5].map((stars) => {
      const count = summaryTotals.ratingBuckets[stars] ?? 0;
      return {
        segment: `${stars} Star${stars === 1 ? "" : "s"}`,
        value:
          summaryTotals.totalCount === 0
            ? 0
            : Math.round((count / summaryTotals.totalCount) * 100),
      };
    });

    const recentRatings = [...recentFeedbackDocs]
      .reverse()
      .map((entry) => ({ rating: entry.rating, receivedAt: new Date(entry.createdAt).toISOString() }));

    const recentFeedback = recentFeedbackDocs.map((entry) => ({
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
      totalFeedbackCount: summaryTotals.totalCount,
    };
  },
});
