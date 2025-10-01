import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    ownerUserId: v.id("users"),
    name: v.string(),
    email: v.string(),
    slug: v.string(),
    appUrl: v.string(),
    qrSvg: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("businesses")
      .withIndex("by_ownerUserId", (q) => q.eq("ownerUserId", args.ownerUserId))
      .unique();

    const timestamp = Date.now();
    const baseSlug = args.slug;
    let slug = baseSlug;
    let collisionCount = 0;

    // ensure slug uniqueness unless it belongs to the existing business
    while (true) {
      const collision = await ctx.db
        .query("businesses")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (!collision || (existing && collision._id === existing._id)) {
        break;
      }

      collisionCount += 1;
      slug = `${baseSlug}-${collisionCount}`;
    }

    const normalizedBaseUrl = args.appUrl.replace(/\/$/, "");
    const feedbackUrl = `${normalizedBaseUrl}/${slug}/feedback`;

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        slug,
        qrSvg: args.qrSvg,
        updatedAt: timestamp,
      });
      return { businessId: existing._id, slug, qrSvg: args.qrSvg, feedbackUrl };
    }

    const insertedId = await ctx.db.insert("businesses", {
      ownerUserId: args.ownerUserId,
      name: args.name,
      email: args.email,
      phone: "",
      slug,
      qrSvg: args.qrSvg,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return { businessId: insertedId, slug, qrSvg: args.qrSvg, feedbackUrl };
  },
});

export const forClerkUser = query({
  args: { clerkUserId: v.string(), appUrl: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (!user) {
      return null;
    }

    const business = await ctx.db
      .query("businesses")
      .withIndex("by_ownerUserId", (q) => q.eq("ownerUserId", user._id))
      .unique();

    if (!business) {
      return null;
    }

    const baseUrl = args.appUrl ? args.appUrl.replace(/\/$/, "") : null;
    const feedbackUrl = baseUrl ? `${baseUrl}/${business.slug}/feedback` : null;

    return {
      _id: business._id,
      name: business.name,
      email: business.email,
      slug: business.slug,
      qrSvg: business.qrSvg,
      feedbackUrl,
      createdAt: business.createdAt,
      updatedAt: business.updatedAt,
    };
  },
});
