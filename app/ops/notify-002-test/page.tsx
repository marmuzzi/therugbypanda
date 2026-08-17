import { notFound } from "next/navigation";

import Notify002TestClient from "./Notify002TestClient";

export const dynamic = "force-dynamic";

export default function Notify002TestPage() {
  if (process.env.VERCEL_ENV !== "preview") {
    notFound();
  }

  return <Notify002TestClient />;
}
