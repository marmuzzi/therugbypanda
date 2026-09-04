import { NextRequest, NextResponse } from "next/server";

import { authenticateEditorialRequest } from "@/lib/editorial/EditorialApiAuth";
import { reserveEditorialAiBudget } from "@/lib/editorial/AiDailyBudget";
import { runAiEditorialReview, type AiEditorialReviewInput } from "@/lib/editorial/OpenAIEditorialReview";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_STUDIO_ORIGIN = "https://therugbypanda.sanity.studio";
const DEFAULT_REVIEW_MODEL = "gpt-5.6-luna";
const MANUAL_REVIEW_BUDGET_RESERVATION_USD = 0.005;
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

  const requestId = crypto.randomUUID();
  try {
    const input = (await request.json()) as AiEditorialReviewInput;
    if (!input || typeof input.title !== "string" || typeof input.bodyText !== "string") {
      return jsonResponse({ error: "A structured editorial review input is required." }, { status: 400 });
    }

    process.env.OPENAI_EDITORIAL_REVIEW_MODEL ??= DEFAULT_REVIEW_MODEL;
    const budget = await reserveEditorialAiBudget({
      requestId,
      purpose: `manual-publication-review:${input.title.slice(0, 80)}`,
      amountUsd: MANUAL_REVIEW_BUDGET_RESERVATION_USD,
    });

    return jsonResponse({ ...(await runAiEditorialReview(input)), budget });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI editorial review failed.";
    const timedOut = /timeout|timed out|exceeded/i.test(message);
    const budgetBlocked = /Daily OpenAI budget blocked/i.test(message);

    console.error("Publication review failed", {
      requestId,
      message,
      timedOut,
      budgetBlocked,
    });

    return jsonResponse(
      {
        error: budgetBlocked
          ? message
          : timedOut
            ? "The publication review took too long. Please run it again."
            : message,
      },
      { status: budgetBlocked ? 429 : timedOut ? 504 : 500 },
    );
  }
}
