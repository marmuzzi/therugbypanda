// sanity/components/EditorialReview/constants.ts

import type { EditorialAction } from "./types";

export const EDITORIAL_API_BASE_URL = "https://therugbypanda.ie";

export const QUEUE_QUERY = `*[
  _type == "article" &&
  coalesce(workflowStatus, select(_id in path("drafts.**") => "draft", "published")) in [
    "draft",
    "under-review",
    "approved",
    "published",
    "rejected",
    "amendment-required",
    "archived"
  ]
] | order(workflowUpdatedAt desc, _updatedAt desc) {
  _id,
  title,
  standfirst,
  body,
  seoTitle,
  seoDescription,
  "workflowStatus": coalesce(workflowStatus, select(_id in path("drafts.**") => "draft", "published")),
  workflowUpdatedAt,
  rejectionReason,
  rejectionCount,
  replacementRequired,
  editorialConfidence,
  needsHumanFactCheck,
  editorialAngle,
  audiencePromise,
  editorialStoryType,
  sourceRecords,
  factLedger,
  workflowHistory,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  "featuredImageCaption": featuredImage.caption,
  "featuredImageCredit": featuredImage.photographer,
  "slug": slug.current,
  readingTime,
  isLead,
  useBrandImage,
  "category": category->{_id, title},
  "author": author->{_id, name},
  "province": province->{_id, title},
  "competition": competition->{_id, title},
  "tags": tags[]->{_id, title}
}`;

export const actionMap: Record<string, EditorialAction[]> = {
  draft: ["publish", "reject", "discard"],
  "amendment-required": ["publish", "reject", "discard"],
  "under-review": ["publish", "reject", "discard"],
  approved: ["publish", "reject", "discard"],
  published: ["unpublish", "discard"],
  rejected: ["reopen", "publish", "discard"],
  archived: ["restore", "discard"],
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
