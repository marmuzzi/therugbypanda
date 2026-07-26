import { NextRequest, NextResponse } from "next/server";

import { authenticateEditorialRequest } from "@/lib/editorial/EditorialApiAuth";
import { notifyReviewQueue } from "@/lib/editorial/EditorialNotifications";
import { applyEditorialAction, type EditorialAction } from "@/lib/editorial/EditorialWorkflow";

export const runtime = "nodejs";

const ALLOWED_STUDIO_ORIGIN = "https://therugbypanda.sanity.studio";
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_STUDIO_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  Vary: "Origin",
};

type WorkflowRequest = {
  articleId: string;
  action: EditorialAction;
  actor?: string;
  note?: string;
};

const actions = new Set<EditorialAction>(["submit", "approve", "reject", "publish", "discard"]);

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
    const body = (await request.json()) as WorkflowRequest;
    if (!body.articleId || !actions.has(body.action)) {
      return jsonResponse({ error: "articleId and a valid action are required" }, { status: 400 });
    }

    const actor =
      identity.method === "sanity-session"
        ? identity.actor
        : body.actor?.trim() || identity.actor;
    const result = await applyEditorialAction({ ...body, actor });
    const notification =
      body.action === "submit"
        ? await notifyReviewQueue({
            articleId: result.articleId,
            articleTitle: result.articleTitle,
            actor,
            occurredAt: new Date().toISOString(),
            submissionNote: body.note?.trim() || undefined,
          })
        : undefined;

    return jsonResponse({ status: "ok", workflow: result, notification });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Editorial workflow failed";
    const status = message.startsWith("Cannot ") || message.includes("required") ? 409 : 500;
    return jsonResponse({ error: message }, { status });
  }
}
