import { mutation } from "./_generated/server";
import { v } from "convex/values";

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
