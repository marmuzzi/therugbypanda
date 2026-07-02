import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Rugby Panda",
  description:
    "Digital rugby newsroom delivering independent coverage, insight and analysis of Irish and European rugby.",
  icons: {
    icon: "/favicon.ico",
  },
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
