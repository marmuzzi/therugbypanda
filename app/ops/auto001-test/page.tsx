import { notFound } from "next/navigation";

import Auto001TestClient from "./Auto001TestClient";

export const dynamic = "force-dynamic";

export default function Auto001TestPage() {
  if (process.env.VERCEL_ENV !== "preview") {
    notFound();
  }

  return <Auto001TestClient />;
}
