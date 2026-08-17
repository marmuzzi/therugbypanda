import { notFound } from "next/navigation";

import Auto004TestClient from "./Auto004TestClient";

export const dynamic = "force-dynamic";

export default function Auto004TestPage() {
  if (process.env.VERCEL_ENV !== "preview") {
    notFound();
  }
  return <Auto004TestClient />;
}
