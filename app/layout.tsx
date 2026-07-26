import type { Metadata, Viewport } from "next";
import AnalyticsConsent from "@/components/AnalyticsConsent";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
