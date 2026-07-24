import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

import type { FactLedger, RawStoryInput, SourceRecord } from "@/lib/editorial/EditorialTypes";
import { EditorialBrain } from "@/lib/editorial/EditorialBrain";
import { generateArticleDraft } from "@/lib/editorial/OpenAIArticleGenerator";
import { createSanityArticleDraft } from "@/lib/editorial/SanityDraftWriter";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const runtime = "nodejs";
export const maxDuration = 60;

type ReplacementRequest = {
  rejectedArticleId: string;
  replacementStory: RawStoryInput;
  factLedger: FactLedger;
  editorialImageId?: string;
};

type RejectedArticle = {
  _id: string;
  workflowStatus?: string;
  replacementRequired?: boolean;
  editorialAngle?: string;
  sourceRecords?: SourceRecord[];
  rejectionReason?: string;
};

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.EDITORIAL_AUTOMATION_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function getClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset) throw new Error("Sanity project configuration is missing.");
  if (!token) throw new Error("SANITY_API_TOKEN or SANITY_AUTH_TOKEN is not configured.");
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

function normaliseId(value: string) {
  return value.replace(/^drafts\./, "");
}

function normaliseText(value?: string) {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function sourceSet(records: SourceRecord[] = []) {
  return records.map((source) => source.url.trim().toLowerCase()).filter(Boolean).sort().join("|");
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ReplacementRequest;
    if (!body.rejectedArticleId || !body.replacementStory || !body.factLedger) {
      return NextResponse.json(
        { error: "rejectedArticleId, replacementStory and factLedger are required" },
        { status: 400 },
      );
    }

    const writeClient = getClient();
    const publishedId = normaliseId(body.rejectedArticleId);
    const draftId = `drafts.${publishedId}`;
    const rejected = await writeClient.fetch<RejectedArticle | null>(
      `*[_type == "article" && _id in [$draftId, $publishedId]][0]{_id,workflowStatus,replacementRequired,editorialAngle,sourceRecords,rejectionReason}`,
      { draftId, publishedId },
    );

    if (!rejected) throw new Error(`Rejected article ${body.rejectedArticleId} was not found.`);
    if (rejected.workflowStatus !== "rejected" || rejected.replacementRequired !== true) {
      return NextResponse.json(
        { error: "The article is not in a rejected, replacement-required state." },
        { status: 409 },
      );
    }

    if (sourceSet(rejected.sourceRecords) === sourceSet(body.replacementStory.sourceRecords)) {
      return NextResponse.json(
        { error: "Replacement generation requires a different source set from the rejected draft." },
        { status: 409 },
      );
    }

    const editorial = new EditorialBrain().evaluate(body.replacementStory, { factLedger: body.factLedger });
    if (editorial.decision !== "draft") {
      return NextResponse.json({
        status: editorial.decision,
        editorial,
        message: "No replacement was generated because the Editorial Brain did not approve the replacement story for drafting.",
      });
    }

    if (normaliseText(editorial.brief.angle) === normaliseText(rejected.editorialAngle)) {
      return NextResponse.json(
        { error: "The replacement repeated the rejected editorial angle. Supply a materially different candidate or source package." },
        { status: 409 },
      );
    }

    editorial.brief.prohibitedApproaches = Array.from(new Set([
      ...editorial.brief.prohibitedApproaches,
      rejected.editorialAngle ? `Do not reuse the rejected angle: ${rejected.editorialAngle}` : "Do not reuse the rejected editorial angle.",
      rejected.rejectionReason ? `Address the editor's rejection reason: ${rejected.rejectionReason}` : "Address the editor's rejection reason.",
    ]));

    const article = await generateArticleDraft(body.replacementStory, editorial);
    const sanityDraft = await createSanityArticleDraft(
      { editorial, article },
      {
        editorialImageId: body.editorialImageId,
        story: body.replacementStory,
        replacementOf: rejected._id,
      },
    );

    const now = new Date().toISOString();
    await writeClient
      .patch(rejected._id)
      .set({
        replacementRequired: false,
        replacementGeneratedAt: now,
        replacedBy: { _type: "reference", _ref: normaliseId(sanityDraft.id), _weak: true },
      })
      .setIfMissing({ workflowHistory: [] })
      .append("workflowHistory", [{
        _key: crypto.randomUUID().replaceAll("-", "").slice(0, 12),
        _type: "object",
        action: "replacement-generated",
        fromStatus: "rejected",
        toStatus: "rejected",
        actor: "editorial-automation",
        note: `Replacement draft created: ${sanityDraft.id}`,
        occurredAt: now,
      }])
      .commit();

    return NextResponse.json({
      status: "replacement-created",
      rejectedArticleId: publishedId,
      replacement: sanityDraft,
      editorial,
      article,
    });
  } catch (error) {
    console.error("Editorial replacement pipeline failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Editorial replacement pipeline failed" },
      { status: 500 },
    );
  }
}
