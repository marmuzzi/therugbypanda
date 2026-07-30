import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import { unstable_noStore as noStore } from "next/cache";

import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  perspective: "published",
  // Editorial publish and unpublish actions must be reflected immediately.
  // Bypass Sanity's edge CDN so deleted or newly published documents are authoritative.
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
    // Mark the calling route as dynamic as well as bypassing the data cache.
    // The Sanity SDK does not use the platform fetch path that Next.js can infer automatically.
    noStore();
    return await client.fetch<QueryResponse>(query, params, { cache: "no-store" });
  } catch (error) {
    console.warn("Sanity fetch failed; falling back to local sample content.", error);
    return null;
  }
}
