import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";

import AnalyticsConsent from "@/components/AnalyticsConsent";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { ANALYTICS_CONSENT_KEY } from "@/lib/analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://therugbypanda.ie"),
  title: {
    default: "The Rugby Panda",
    template: "%s | The Rugby Panda",
  },
  description:
    "Independent digital rugby newsroom covering the game from Ireland to the international stage.",
  applicationName: "The Rugby Panda",
  authors: [{ name: "The Rugby Panda" }],
  creator: "The Rugby Panda",
  publisher: "The Rugby Panda",
  openGraph: {
    type: "website",
    siteName: "The Rugby Panda",
    title: "The Rugby Panda",
    description: "The game. The people. The stories.",
    url: "https://therugbypanda.ie",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=8", sizes: "any" },
      { url: "/favicon.svg?v=8", type: "image/svg+xml", sizes: "any" },
      { url: "/rugby-panda-logo.png?v=8", type: "image/png", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=8",
    apple: [{ url: "/rugby-panda-logo.png?v=8", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#003D2B",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const storedConsent = cookieStore.get(ANALYTICS_CONSENT_KEY)?.value;
  const initialConsent =
    storedConsent === "accepted" || storedConsent === "rejected" ? storedConsent : null;

  return (
    <html lang="en">
      <body>
        {children}
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <AnalyticsConsent initialConsent={initialConsent} />
      </body>
    </html>
  );
}
