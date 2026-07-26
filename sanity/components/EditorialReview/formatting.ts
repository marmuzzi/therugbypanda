// sanity/components/EditorialReview/formatting.ts

export function normaliseId(id: string) {
  return id.replace(/^drafts\./, "");
}

export function displayStatus(status?: string) {
  return (status ?? "draft").replaceAll("-", " ");
}

export function displayConfidence(value?: number) {
  if (value == null) return "Not recorded";
  return `${Math.round(value <= 1 ? value * 100 : value)}%`;
}

export function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}
