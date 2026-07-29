import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { authenticateEditorialRequest } from "@/lib/editorial/EditorialApiAuth";
import { notifyArticlePublished } from "@/lib/editorial/EditorialSocialDistribution";
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

const actions = new Set<EditorialAction>([
  "submit",
  "approve",
  "reject",
  "publish",
  "unpublish",
  "reopen",
  "archive",
  "restore",
  "discard",
]);

function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...corsHeaders, ...(init?.headers ?? {}) },
  });
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
      return jsonResponse(
        { error: "articleId and a valid action are required" },
        { status: 400 },
      );
    }

    const actor =
      identity.method === "sanity-session"
        ? identity.actor
        : body.actor?.trim() || identity.actor;
    const result = await applyEditorialAction({ ...body, actor });

    // Publishing, unpublishing, rejecting or removing an article must be reflected
    // on the public website on the next request rather than waiting for the normal cache window.
    revalidatePath("/", "layout");

    const socialDistribution =
      body.action === "publish"
        ? await notifyArticlePublished(result.articleId)
        : undefined;

    return jsonResponse({ status: "ok", workflow: result, socialDistribution });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Editorial workflow failed";
    const status =
      message.startsWith("Cannot ") || message.includes("required") ? 409 : 500;
    return jsonResponse({ error: message }, { status });
  }
}
