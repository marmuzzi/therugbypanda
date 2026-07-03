import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Rugby Panda",
  description:
    "Digital rugby newsroom delivering independent coverage, insight and analysis of Irish and European rugby.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/rugby-panda-logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/rugby-panda-logo.png",
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
      <body>{children}</body>
    </html>
  );
}
