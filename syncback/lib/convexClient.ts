import { ConvexHttpClient } from "convex/browser";

let client: ConvexHttpClient | null = null;

function resolveConvexUrl() {
  const url =
    process.env.CONVEX_URL ??
    process.env.NEXT_PUBLIC_CONVEX_URL ??
    null;

  if (!url) {
    throw new Error(
      "Convex URL is not configured. Set CONVEX_URL or NEXT_PUBLIC_CONVEX_URL in the environment.",
    );
  }

  return url;
}

export function getConvexClient() {
  if (client) {
    return client;
  }

  const url = resolveConvexUrl();
  client = new ConvexHttpClient(url);
  return client;
}
