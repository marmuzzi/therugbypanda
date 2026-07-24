import { NextRequest, NextResponse } from "next/server";

import type { FactLedger, RawStoryInput } from "@/lib/editorial/EditorialTypes";
import { EditorialBrain } from "@/lib/editorial/EditorialBrain";
import { generateArticleDraft } from "@/lib/editorial/OpenAIArticleGenerator";
import { createSanityArticleDraft } from "@/lib/editorial/SanityDraftWriter";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_STUDIO_ORIGIN = "https://therugbypanda.sanity.studio";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_STUDIO_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  Vary: "Origin",
};

type DraftRequest = {
  story: RawStoryInput;
  factLedger: FactLedger;
  createSanityDraft?: boolean;
  editorialImageId?: string;
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init?.headers ?? {}),
    },
  });
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.EDITORIAL_AUTOMATION_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as DraftRequest;
    if (!body.story || !body.factLedger) {
      return jsonResponse({ error: "story and factLedger are required" }, { status: 400 });
    }

    const editorial = new EditorialBrain().evaluate(body.story, { factLedger: body.factLedger });
    if (editorial.decision !== "draft") {
      return jsonResponse({
        status: editorial.decision,
        editorial,
        message: "No article was generated because the Editorial Brain did not approve this story for drafting.",
      });
    }

    const article = await generateArticleDraft(body.story, editorial);
    const pkg = { editorial, article };

    if (body.createSanityDraft === false) {
      return jsonResponse({ status: "generated", ...pkg });
    }

    const sanityDraft = await createSanityArticleDraft(pkg, {
      editorialImageId: body.editorialImageId,
      story: body.story,
    });
    return jsonResponse({ status: "draft-created", editorial, article, sanityDraft });
  } catch (error) {
    console.error("Editorial draft pipeline failed", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Editorial draft pipeline failed" },
      { status: 500 },
    );
  }
}
