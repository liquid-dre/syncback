import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ColorSchemeScript } from "@mantine/core";

import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://syncback.app";
const siteName = "SyncBack";
const siteDescription =
  "SyncBack helps customer-facing teams capture QR-powered feedback the moment it is shared, centralize insights, and respond before issues escalate.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Real-time QR Feedback Platform`,
    template: `%s | ${siteName}`,
  },
  applicationName: siteName,
  description: siteDescription,
  keywords: [
    "QR feedback platform",
    "customer experience software",
    "real-time feedback",
    "review management",
    "SyncBack",
  ],
  category: "business",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} | Real-time QR Feedback Platform`,
    description: siteDescription,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SyncBack dashboard visual showcasing instant customer feedback",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Real-time QR Feedback Platform`,
    description: siteDescription,
    images: ["/og-image.svg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: "en-US",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.svg`,
      },
    },
    {
      "@type": "Product",
      "@id": `${siteUrl}/#product`,
      name: siteName,
      description: siteDescription,
      brand: {
        "@id": `${siteUrl}/#organization`,
      },
      offers: {
        "@type": "Offer",
        url: siteUrl,
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        price: "0",
      },
    },
  ],
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="light" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        <Providers>{children}
        <Analytics /></Providers>
      </body>
    </html>
  );
}
