import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  perspective: "published",
  // Editorial publish and unpublish actions must be reflected immediately.
  // Next.js still provides the controlled 60-second application cache below,
  // while bypassing Sanity's edge CDN avoids stale deleted/published documents.
  useCdn: false,
});

const builder = imageUrlBuilder(client);

type SanityParam = string | number | boolean | Array<string | number | boolean>;

export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source).auto("format").fit("max");
}

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, SanityParam>;
}) {
  if (!isSanityConfigured) {
    return null;
  }

  try {
    return await client.fetch<QueryResponse>(query, params, { next: { revalidate: 60 } });
  } catch (error) {
    console.warn("Sanity fetch failed; falling back to local sample content.", error);
    return null;
  }
}
