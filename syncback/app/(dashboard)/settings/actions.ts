"use server";

import { randomUUID } from "node:crypto";

import { headers } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import QRCode from "qrcode-generator";

import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

export type SettingsFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  businessId?: string;
  slug?: string;
  qrSvg?: string;
  feedbackUrl?: string;
  name?: string;
  email?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function baseSlug(input: string) {
  const normalized = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  if (normalized.length === 0) {
    return "business";
  }

  return normalized;
}

export async function resolveAppUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  const headerList = await headers();
  const host = headerList.get("host");
  if (host) {
    const protocol = headerList.get("x-forwarded-proto") ?? "https";
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

export async function saveBusiness(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const user = await currentUser();

  if (!user) {
    return {
      status: "error",
      message: "You need to be signed in to update your business settings.",
    };
  }

  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const existingSlug = (formData.get("slug") ?? "").toString().trim();

  if (!name) {
    return { status: "error", message: "Add your business name to continue." };
  }

  if (!email || !emailRegex.test(email)) {
    return {
      status: "error",
      message: "Enter a valid email so we know where to send new feedback.",
    };
  }

  const slug = existingSlug || `${baseSlug(name)}-${randomUUID().slice(0, 6)}`;
  const appUrl = await resolveAppUrl();

  const convex = getConvexClient();
  const ensuredUserId = await convex.mutation(api.users.ensure, {
    clerkUserId: user.id,
    email,
    organisationName: name,
    organisationID: slug,
  });

  const feedbackUrl = `${appUrl}/${slug}/feedback`;
  const qr = QRCode(0, "M");
  qr.addData(feedbackUrl);
  qr.make();
  const rawSvg = qr.createSvgTag({ scalable: true, margin: 2 });
  const qrSvg = rawSvg.replace(/fill="#000000"/g, 'fill="#0f172a"');

  const result = await convex.mutation(api.businesses.save, {
    ownerUserId: ensuredUserId,
    name,
    email,
    slug,
    appUrl,
    qrSvg,
  });

  return {
    status: "success",
    message: "Settings updated. Print or share your new QR code!",
    businessId: result.businessId,
    slug: result.slug,
    qrSvg: result.qrSvg,
    feedbackUrl: result.feedbackUrl ?? feedbackUrl,
    name,
    email,
  };
}
