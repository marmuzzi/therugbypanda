import { NextRequest, NextResponse } from "next/server";

import { runAiEditorialReview, type AiEditorialReviewInput } from "@/lib/editorial/OpenAIEditorialReview";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_STUDIO_ORIGIN = "https://therugbypanda.sanity.studio";
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_STUDIO_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  Vary: "Origin",
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { ...corsHeaders, ...(init?.headers ?? {}) } });
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.EDITORIAL_AUTOMATION_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

  try {
    const input = (await request.json()) as AiEditorialReviewInput;
    if (!input || typeof input.title !== "string" || typeof input.bodyText !== "string") {
      return jsonResponse({ error: "A structured editorial review input is required." }, { status: 400 });
    }
    return jsonResponse(await runAiEditorialReview(input));
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "AI editorial review failed." },
      { status: 500 },
    );
  }
}
