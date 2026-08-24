const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const cutoff = process.env.AUTO004_DRAFT_CUTOFF || "2026-08-24T20:24:00Z";

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required");
if (!token) throw new Error("SANITY_API_TOKEN is required");

const query = `*[
  _type == "article" &&
  _id in path("drafts.**") &&
  defined(editorialInputId) &&
  workflowStatus == "draft" &&
  coalesce(automationContentClass, "production") == "production" &&
  coalesce(editorialGeneratedAt, _createdAt) < $cutoff
] | order(_createdAt asc) {
  _id,
  title,
  editorialInputId,
  editorialGeneratedAt,
  _createdAt,
  workflowStatus,
  automationContentClass
}`;

const queryUrl = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
queryUrl.searchParams.set("query", query);
queryUrl.searchParams.set("$cutoff", JSON.stringify(cutoff));

const queryResponse = await fetch(queryUrl, {
  headers: { Authorization: `Bearer ${token}` },
});

if (!queryResponse.ok) {
  throw new Error(`Sanity query failed: ${queryResponse.status} ${await queryResponse.text()}`);
}

const queryPayload = await queryResponse.json();
const drafts = Array.isArray(queryPayload.result) ? queryPayload.result : [];

console.log(`Superseded AUTO-004 draft cutoff: ${cutoff}`);
console.log(`Eligible old automation drafts: ${drafts.length}`);
for (const draft of drafts) {
  console.log(`- ${draft._id} :: ${draft.title ?? "(untitled)"} :: ${draft.editorialGeneratedAt ?? draft._createdAt}`);
}

if (drafts.length === 0) {
  console.log("Nothing to delete.");
  process.exit(0);
}

if (drafts.length > 20) {
  throw new Error(`Safety stop: refusing to delete ${drafts.length} drafts in one cleanup run.`);
}

const mutations = drafts.map((draft) => ({ delete: { id: draft._id } }));
const mutateUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`;
const mutationResponse = await fetch(mutateUrl, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ mutations }),
});

if (!mutationResponse.ok) {
  throw new Error(`Sanity mutation failed: ${mutationResponse.status} ${await mutationResponse.text()}`);
}

const mutationPayload = await mutationResponse.json();
console.log(`Deleted ${drafts.length} superseded automation drafts.`);
console.log(JSON.stringify(mutationPayload, null, 2));
