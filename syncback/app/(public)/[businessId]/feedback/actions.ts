"use server";

import { createHash } from "node:crypto";

import { headers } from "next/headers";

import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

export type SubmitFeedbackState = {
  status: "idle" | "success" | "error";
  message?: string;
  redirectTo?: string;
};

function sanitizeMessage(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

function isValidStep(rating: number) {
  return Number.isFinite(rating) && rating >= 0.5 && rating <= 5 && Math.abs(rating * 2 - Math.round(rating * 2)) < 1e-8;
}

export async function submitFeedback(
  _prevState: SubmitFeedbackState,
  formData: FormData,
): Promise<SubmitFeedbackState> {
  const slug = (formData.get("slug") ?? "").toString().trim();
  const ratingValue = Number(formData.get("rating"));
  const messageInput = (formData.get("message") ?? "").toString();
  const message = sanitizeMessage(messageInput);

  if (!slug) {
    return { status: "error", message: "We couldn’t identify the business linked to this form." };
  }

  if (!isValidStep(ratingValue)) {
    return {
      status: "error",
      message: "Select a star rating between 0.5 and 5 before submitting.",
    };
  }

  if (message.length < 8) {
    return {
      status: "error",
      message: "Please share a few more words so the team knows what went well or needs attention.",
    };
  }

  const headerList = await headers();
  const ipAddress = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const ipHash = ipAddress
    ? createHash("sha256")
        .update(ipAddress)
        .digest("hex")
    : undefined;

  const convex = getConvexClient();

  try {
    await convex.mutation(api.feedbacks.submit, {
      slug,
      rating: ratingValue,
      message,
      source: "qr",
      ipHash,
    });
  } catch (error) {
    console.error("Failed to submit feedback", error);
    return {
      status: "error",
      message: "Something went wrong while saving your feedback. Please try again in a moment.",
    };
  }

  return {
    status: "success",
    redirectTo: `/${slug}/feedback/success`,
  };
}
