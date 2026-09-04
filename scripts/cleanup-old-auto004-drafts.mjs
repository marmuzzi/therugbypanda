const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
const cutoff = process.env.AUTO004_DRAFT_CUTOFF || "2026-08-24T20:24:00Z";

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required");
if (!token) throw new Error("SANITY_API_TOKEN is required");

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const queryUrl = (query, params = {}) => {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  return url;
};

async function querySanity(query, params = {}) {
  const response = await fetch(queryUrl(query, params), { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Sanity query failed: ${response.status} ${await response.text()}`);
  const payload = await response.json();
  return Array.isArray(payload.result) ? payload.result : [];
}

async function mutate(mutations) {
  if (mutations.length === 0) return null;
  const mutateUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`;
  const response = await fetch(mutateUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  if (!response.ok) throw new Error(`Sanity mutation failed: ${response.status} ${await response.text()}`);
  return response.json();
}

const oldDrafts = await querySanity(`*[
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
}`, { cutoff });

console.log(`Superseded AUTO-004 draft cutoff: ${cutoff}`);
console.log(`Eligible old automation drafts: ${oldDrafts.length}`);
for (const draft of oldDrafts) console.log(`- ${draft._id} :: ${draft.title ?? "(untitled)"} :: ${draft.editorialGeneratedAt ?? draft._createdAt}`);

if (oldDrafts.length > 20) throw new Error(`Safety stop: refusing to delete ${oldDrafts.length} drafts in one cleanup run.`);
if (oldDrafts.length > 0) {
  const payload = await mutate(oldDrafts.map((draft) => ({ delete: { id: draft._id } })));
  console.log(`Deleted ${oldDrafts.length} superseded automation drafts.`);
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log("No superseded automation drafts to delete.");
}

// Same-day drafts are deliberately preserved between recovery attempts, but they must not be
// grandfathered into the exact-five package when later evidence exposes a non-rugby cluster or
// visibly incomplete metadata. Production on 4 Sep showed a GAA-manager story and a clipped
// standfirst surviving the retained-draft shortcut even though neither is owner-review-ready.
const packageDate = operationalDate();
const prefix = `current-${packageDate}-*`;
const currentDrafts = await querySanity(`*[
  _type == "article" &&
  _id in path("drafts.**") &&
  morningPackageEligible == true &&
  coalesce(automationContentClass, "production") == "production" &&
  editorialInputId match $prefix
] | order(coalesce(editorialGeneratedAt, _createdAt) asc) {
  _id,
  title,
  standfirst,
  editorialInputId,
  sourceNotes[]{publisher,usage,url}
}`, { prefix });

const explicitNonRugby = /\b(?:gaa|gaelic football|gaelic games|hurling|galway football|padraic joyce|football manager sim(?:ulator)?)\b/i;
const incompleteTail = /\b(?:from|to|with|for|and|or|of|in|on|at|by|the|a|an)[.!?]?$/i;

function sameDayIntegrityFailure(draft) {
  const title = String(draft?.title ?? "").trim();
  const standfirst = String(draft?.standfirst ?? "").trim();
  const sourceUsage = (Array.isArray(draft?.sourceNotes) ? draft.sourceNotes : [])
    .map((note) => String(note?.usage ?? ""))
    .join(" ");
  const combined = `${title} ${standfirst} ${sourceUsage}`;
  if (explicitNonRugby.test(combined)) return "same-day-retained-draft-explicit-non-rugby-contamination";
  if (!title || !standfirst) return "same-day-retained-draft-missing-required-metadata";
  if (incompleteTail.test(standfirst)) return "same-day-retained-draft-incomplete-standfirst";
  return null;
}

const contaminated = currentDrafts
  .map((draft) => ({ draft, reason: sameDayIntegrityFailure(draft) }))
  .filter((entry) => Boolean(entry.reason));

console.log(`Same-day eligible drafts inspected: ${currentDrafts.length}`);
console.log(`Same-day drafts failed closed: ${contaminated.length}`);
for (const { draft, reason } of contaminated) console.log(`- ${draft._id} :: ${draft.title ?? "(untitled)"} :: ${reason}`);

if (contaminated.length > 0) {
  const now = new Date().toISOString();
  const payload = await mutate(contaminated.map(({ draft, reason }) => ({
    patch: {
      id: draft._id,
      set: {
        morningPackageEligible: false,
        replacementRequired: true,
        rejectionReason: reason,
        workflowUpdatedAt: now,
      },
    },
  })));
  console.log(`Failed closed ${contaminated.length} contaminated same-day morning drafts.`);
  console.log(JSON.stringify(payload, null, 2));
}
