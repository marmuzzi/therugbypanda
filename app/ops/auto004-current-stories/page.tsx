import { notFound } from "next/navigation";

import Auto004CurrentStoriesClient from "./Auto004CurrentStoriesClient";

export const dynamic = "force-dynamic";

export default function Auto004CurrentStoriesPage() {
  if (process.env.VERCEL_ENV !== "preview") {
    notFound();
  }

  return <Auto004CurrentStoriesClient />;
}
