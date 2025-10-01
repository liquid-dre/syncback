import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const ensure = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    organisationName: v.string(),
    organisationID: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    const timestamp = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        organisationName: args.organisationName,
        organisationID: args.organisationID,
        lastSeenAt: timestamp,
      });

      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      organisationName: args.organisationName,
      organisationID: args.organisationID,
      createdAt: timestamp,
      lastSeenAt: timestamp,
    });
  },
});

export const byClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email,
      organisationName: user.organisationName,
      organisationID: user.organisationID,
      createdAt: user.createdAt,
      lastSeenAt: user.lastSeenAt ?? null,
    };
  },
});
