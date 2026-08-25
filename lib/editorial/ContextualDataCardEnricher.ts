import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import type { EditorialDraftPackage } from "./ArticleDraftTypes";
import { buildContextualDataCard } from "./ContextualDataCardBuilder";

function createWriteClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset) throw new Error("Sanity project configuration is missing.");
  if (!token) throw new Error("SANITY_API_TOKEN or SANITY_AUTH_TOKEN is not configured.");
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

function normaliseDocumentId(value: string) {
  return value.startsWith("drafts.") ? value : `drafts.${value}`;
}

function escapeGroqPattern(value: string) {
  return value.toLowerCase().replace(/["\\]/g, "").trim();
}

export async function enrichSanityDraftWithContextualCard(articleId: string, pkg: EditorialDraftPackage) {
  const card = buildContextualDataCard(pkg.article, pkg.editorial);
  if (!card) return { status: "not-applicable" as const, articleId, card: null };

  const writeClient = createWriteClient();
  const draftId = normaliseDocumentId(articleId);
  let persistedCard = card;

  if (card.kind === "player") {
    const pattern = `*${escapeGroqPattern(card.title)}*`;
    const portrait = await writeClient.fetch<{ title?: string; altText?: string; url?: string } | null>(
      `*[_type == "editorialImage" && !(_id in path("drafts.**")) && usageApproved == true && lifecycleStatus in ["approved", "published"] && defined(image.asset._ref) && (lower(title) match $pattern || lower(altText) match $pattern || lower(caption) match $pattern)] | order(_updatedAt desc)[0]{title,altText,"url":image.asset->url}`,
      { pattern },
    );
    if (portrait?.url) {
      persistedCard = {
        ...card,
        imageUrl: portrait.url,
        imageAlt: portrait.altText ?? portrait.title ?? card.title,
      };
    }
  }

  await writeClient.patch(draftId).set({ contextualDataCard: persistedCard }).commit();
  const verified = await writeClient.fetch<{ contextualDataCard?: typeof persistedCard } | null>(
    `*[_id == $draftId][0]{contextualDataCard}`,
    { draftId },
  );
  const stored = verified?.contextualDataCard;
  if (!stored || stored.title !== persistedCard.title || (stored.rows?.length ?? 0) < 2) {
    throw new Error(`Contextual card did not persist correctly for ${draftId}.`);
  }

  return {
    status: "persisted-and-verified" as const,
    articleId: draftId,
    card: stored,
  };
}
