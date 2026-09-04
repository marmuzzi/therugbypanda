import { NextRequest, NextResponse } from "next/server";

import { authenticateEditorialRequest } from "@/lib/editorial/EditorialApiAuth";
import { runAiEditorialReview, type AiEditorialReviewInput } from "@/lib/editorial/OpenAIEditorialReview";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_STUDIO_ORIGIN = "https://therugbypanda.sanity.studio";
const DEFAULT_REVIEW_MODEL = "gpt-5.6-luna";
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_STUDIO_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  Vary: "Origin",
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { ...corsHeaders, ...(init?.headers ?? {}) } });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const identity = await authenticateEditorialRequest(request);
  if (!identity) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

  try {
    const input = (await request.json()) as AiEditorialReviewInput;
    if (!input || typeof input.title !== "string" || typeof input.bodyText !== "string") {
      return jsonResponse({ error: "A structured editorial review input is required." }, { status: 400 });
    }

    // Publication Review is a structured classification task. Keep it on the
    // cost-sensitive GPT-5.6 Luna tier unless production explicitly overrides it.
    process.env.OPENAI_EDITORIAL_REVIEW_MODEL ??= DEFAULT_REVIEW_MODEL;

    return jsonResponse(await runAiEditorialReview(input));
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI editorial review failed.";
    const timedOut = /timeout|timed out|exceeded/i.test(message);

    console.error("Publication review failed", {
      message,
      timedOut,
    });

    return jsonResponse(
      {
        error: timedOut
          ? "The publication review took too long. Please run it again."
          : message,
      },
      { status: timedOut ? 504 : 500 },
    );
  }
}
