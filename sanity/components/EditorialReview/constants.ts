// sanity/components/EditorialReview/constants.ts

import type { EditorialAction } from "./types";

export const EDITORIAL_API_BASE_URL = "https://therugbypanda.ie";

export const QUEUE_QUERY = `*[
  _type == "article" &&
  _id match "drafts.*" &&
  workflowStatus in [
    "draft",
    "under-review",
    "approved",
    "rejected",
    "amendment-required"
  ]
] | order(workflowUpdatedAt desc, _updatedAt desc) {
  _id,
  title,
  standfirst,
  body,
  seoTitle,
  seoDescription,
  workflowStatus,
  workflowUpdatedAt,
  rejectionReason,
  rejectionCount,
  replacementRequired,
  editorialConfidence,
  needsHumanFactCheck,
  editorialAngle,
  audiencePromise,
  sourceRecords,
  factLedger,
  workflowHistory,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  "featuredImageCaption": featuredImage.caption,
  "featuredImageCredit": featuredImage.photographer,
  "slug": slug.current
}`;

export const actionMap: Record<string, EditorialAction[]> = {
  draft: ["submit", "discard"],
  "amendment-required": ["submit", "discard"],
  "under-review": ["approve", "reject", "discard"],
  approved: ["publish", "reject", "discard"],
  rejected: ["discard"],
};

export const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: ".65rem",
  marginTop: ".25rem",
  border: "1px solid #bbb",
  borderRadius: 6,
  boxSizing: "border-box",
  font: "inherit",
};

export const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: "1rem",
  background: "#fff",
};
