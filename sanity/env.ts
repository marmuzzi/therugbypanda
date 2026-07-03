export const apiVersion = "2026-07-03";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "hvg4b508";
export const studioUrl = "/studio";

export const isSanityConfigured = Boolean(projectId && dataset);
