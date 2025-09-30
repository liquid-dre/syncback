import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    createdAt: v.number(),
    lastSeenAt: v.optional(v.number()),
    organisationName: v.string(),
    organisationID: v.string(),
  })
    .index("by_clerkUserId", ["clerkUserId"], { unique: true })
    .index("by_email", ["email"])
    .index("by_organisationID", ["organisationID"], { unique: true }),

  businesses: defineTable({
    ownerUserId: v.id("users"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    slug: v.string(),
    qrSvg: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_ownerUserId", ["ownerUserId"])
    .index("by_slug", ["slug"], { unique: true }),

  feedbacks: defineTable({
    businessId: v.id("businesses"),
    rating: v.number(),
    message: v.string(),
    createdAt: v.number(),
    status: v.union(
      v.literal("new"),
      v.literal("seen"),
      v.literal("archived"),
    ),
    source: v.optional(
      v.union(v.literal("qr"), v.literal("link"), v.literal("kiosk")),
    ),
    ipHash: v.optional(v.string()),
  })
    .index("by_businessId", ["businessId"])
    .index("by_businessId_createdAt", ["businessId", "createdAt"]),

  aggregates_daily: defineTable({
    businessId: v.id("businesses"),
    date: v.string(),
    count: v.number(),
    avgRating: v.number(),
    createdAt: v.number(),
  }).index("by_businessId_date", ["businessId", "date"], { unique: true }),
});
