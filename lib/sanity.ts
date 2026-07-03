import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  perspective: "published",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source).auto("format").fit("max");
}

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, string | number | boolean>;
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
