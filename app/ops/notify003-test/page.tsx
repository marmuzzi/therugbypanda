import { notFound } from "next/navigation";

import Notify003TestClient from "./Notify003TestClient";

export const dynamic = "force-dynamic";

export default function Notify003TestPage() {
  if (process.env.VERCEL_ENV !== "preview") {
    notFound();
  }
  return <Notify003TestClient />;
}
