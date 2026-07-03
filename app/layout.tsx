import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://therugbypanda.ie"),
  title: "The Rugby Panda",
  description:
    "Digital rugby newsroom delivering independent coverage, insight and analysis of Irish and European rugby.",
  icons: {
    icon: [{ url: "/rugby-panda-logo.png?v=5", type: "image/png", sizes: "any" }],
    shortcut: "/rugby-panda-logo.png?v=5",
    apple: [{ url: "/rugby-panda-logo.png?v=5", type: "image/png", sizes: "180x180" }],
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
