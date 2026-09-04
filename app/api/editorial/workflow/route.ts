import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { authenticateEditorialRequest } from "@/lib/editorial/EditorialApiAuth";
import { requestEditorialReplacement } from "@/lib/editorial/EditorialReplacementTrigger";
import { notifyArticlePublishedToSocial } from "@/lib/editorial/SocialDistributionCoordinator";
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

    // Social distribution is downstream of the controlled human publish action only.
    // Each provider has its own production safety switch and duplicate lock.
    const socialDistribution =
      body.action === "publish"
        ? await notifyArticlePublishedToSocial(result.articleId)
        : undefined;

    // A rejection must immediately request fresh acquisition. The orchestrator is responsible
    // for selecting a genuinely different angle/source set and then calling the protected
    // /api/editorial/replacement endpoint. Do not recycle the rejected story here.
    const replacementTrigger =
      body.action === "reject"
        ? await requestEditorialReplacement({
            articleId: result.articleId,
            actor,
            note: body.note,
            requestedAt: new Date().toISOString(),
          })
        : undefined;

    if (body.action === "reject" && replacementTrigger?.status !== "requested") {
      return jsonResponse(
        {
          error: "Article was rejected, but immediate replacement acquisition is not configured.",
          workflow: result,
          replacementTrigger,
        },
        { status: 503 },
      );
    }

    return jsonResponse({ status: "ok", workflow: result, socialDistribution, replacementTrigger });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Editorial workflow failed";
    const status =
      message.startsWith("Cannot ") || message.includes("required") ? 409 : 500;
    return jsonResponse({ error: message }, { status });
  }
}
