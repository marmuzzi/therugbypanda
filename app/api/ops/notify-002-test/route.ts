import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const secret = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "EDITORIAL_AUTOMATION_SECRET is unavailable in this Preview deployment." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch("https://therugbypanda.ie/api/editorial/daily-package", {
      method: "POST",
      headers: {
        authorization: `Bearer ${secret}`,
      },
      cache: "no-store",
    });

    const body = await response.json().catch(() => ({ error: "Production endpoint returned a non-JSON response." }));
    return NextResponse.json(body, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Controlled NOTIFY-002 verification failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
