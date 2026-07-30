import { NextResponse } from "next/server";

import { ANALYTICS_CONSENT_KEY } from "@/lib/analytics";

const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
type StoredConsent = "accepted" | "rejected";

function noStoreJson(body: object, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ANALYTICS_CONSENT_KEY}=`));
  const value = match?.slice(ANALYTICS_CONSENT_KEY.length + 1);
  const consent = value === "accepted" || value === "rejected" ? value : null;
  return noStoreJson({ consent });
}

export async function POST(request: Request) {
  let body: { consent?: unknown };

  try {
    body = (await request.json()) as { consent?: unknown };
  } catch {
    return noStoreJson({ error: "Invalid JSON body." }, { status: 400 });
  }

  const consent = body.consent;
  if (consent !== "accepted" && consent !== "rejected") {
    return noStoreJson({ error: "Invalid consent value." }, { status: 400 });
  }

  const response = noStoreJson({ consent: consent satisfies StoredConsent });
  response.cookies.set({
    name: ANALYTICS_CONSENT_KEY,
    value: consent,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".therugbypanda.ie" : undefined,
    maxAge: CONSENT_MAX_AGE_SECONDS,
  });

  return response;
}
