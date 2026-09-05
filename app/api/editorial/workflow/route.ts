import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { authenticateEditorialRequest } from "@/lib/editorial/EditorialApiAuth";
import { requestEditorialReplacement } from "@/lib/editorial/EditorialReplacementTrigger";
import { notifyArticlePublishedToSocial } from "@/lib/editorial/SocialDistributionCoordinator";
import { removeArticleFromSocial } from "@/lib/editorial/SocialPublicationLifecycle";
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

    revalidatePath("/", "layout");

    const socialDistribution =
      body.action === "publish"
        ? await notifyArticlePublishedToSocial(result.articleId)
        : undefined;

    // Unpublishing the canonical website article also removes the exact provider posts
    // created by Rugby Panda. Provider cleanup failure never rolls the website state back;
    // it is returned and persisted so it can be retried safely.
    const socialCleanup =
      body.action === "unpublish"
        ? await removeArticleFromSocial(result.articleId)
        : undefined;

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

    return jsonResponse({
      status: "ok",
      workflow: result,
      socialDistribution,
      socialCleanup,
      replacementTrigger,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Editorial workflow failed";
    const status =
      message.startsWith("Cannot ") || message.includes("required") ? 409 : 500;
    return jsonResponse({ error: message }, { status });
  }
}
