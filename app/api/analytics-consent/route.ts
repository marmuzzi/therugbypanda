import { NextResponse } from "next/server";

import { ANALYTICS_CONSENT_KEY } from "@/lib/analytics";

const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type StoredConsent = "accepted" | "rejected";

export async function POST(request: Request) {
  let body: { consent?: unknown };

  try {
    body = (await request.json()) as { consent?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const consent = body.consent;
  if (consent !== "accepted" && consent !== "rejected") {
    return NextResponse.json({ error: "Invalid consent value." }, { status: 400 });
  }

  const response = NextResponse.json({ consent: consent satisfies StoredConsent });
  response.cookies.set({
    name: ANALYTICS_CONSENT_KEY,
    value: consent,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: CONSENT_MAX_AGE_SECONDS,
  });

  return response;
}
