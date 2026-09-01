import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";

const packageSize = 5;
const maxPerMatchup = Math.max(1, Number.parseInt(process.env.MAX_PACKAGE_MATCHUP_STORIES ?? "2", 10) || 2);
const maxPerTeam = Math.max(1, Number.parseInt(process.env.MAX_PACKAGE_TEAM_STORIES ?? "2", 10) || 2);
const batchPath = path.resolve(process.env.BATCH_PATH ?? "data/editorial-acquisition/current-editorial-acquisition-batch.json");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
if (!token) throw new Error("SANITY_API_TOKEN is required.");

const TEAM_GROUPS = [
  { id: "leinster", terms: ["leinster"] },
  { id: "munster", terms: ["munster"] },
  { id: "ulster", terms: ["ulster"] },
  { id: "connacht", terms: ["connacht"] },
  { id: "ireland", terms: ["ireland", "irish rugby"] },
  { id: "south-africa", terms: ["south africa", "springboks", "boks"] },
  { id: "new-zealand", terms: ["new zealand", "all blacks"] },
  { id: "australia", terms: ["australia", "wallabies"] },
  { id: "argentina", terms: ["argentina", "pumas"] },
  { id: "england", terms: ["england"] },
  { id: "scotland", terms: ["scotland"] },
  { id: "wales", terms: ["wales"] },
  { id: "france", terms: ["france"] },
  { id: "italy", terms: ["italy"] },
  { id: "fiji", terms: ["fiji"] },
  { id: "japan", terms: ["japan"] },
  { id: "samoa", terms: ["samoa"] },
  { id: "tonga", terms: ["tonga"] },
];

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function normalize(value = "") {
  return String(value ?? "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function teamIds(value = "") {
  const lower = normalize(value);
  return TEAM_GROUPS
    .filter((group) => group.terms.some((term) => lower.includes(term)))
    .map((group) => group.id);
}

function matchupPairs(value = "") {
  const unique = [...new Set(teamIds(value))].sort();
  const pairs = [];
  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) pairs.push(`${unique[i]}::${unique[j]}`);
  }
  return pairs;
}

function draftText(draft) {
  return [
    draft?.title,
    draft?.standfirst,
    ...(Array.isArray(draft?.sourceNotes) ? draft.sourceNotes.flatMap((note) => [note?.publisher, note?.usage]) : []),
  ].filter(Boolean).join(" ");
}

function draftPrimaryText(draft) {
  return [draft?.title, draft?.standfirst].filter(Boolean).join(" ");
}

function candidateText(candidate) {
  return [
    candidate?.title,
    candidate?.summary,
    candidate?.subject,
    candidate?.development,
    candidate?.editorialAngle,
    candidate?.editorialPosition?.subject,
    candidate?.editorialPosition?.development,
    candidate?.editorialPosition?.angle,
    ...(Array.isArray(candidate?.sourceRecords) ? candidate.sourceRecords.flatMap((source) => [source?.title, source?.excerpt]) : []),
  ].filter(Boolean).join(" ");
}

function candidatePrimaryText(candidate) {
  return [
    candidate?.title,
    candidate?.summary,
    candidate?.subject,
    candidate?.development,
    candidate?.editorialAngle,
    candidate?.editorialPosition?.subject,
    candidate?.editorialPosition?.development,
    candidate?.editorialPosition?.angle,
  ].filter(Boolean).join(" ");
}

function canAdd(pairs, teams, matchupCounts, teamCounts) {
  const matchupAllowed = pairs.every((pair) => (matchupCounts.get(pair) ?? 0) < maxPerMatchup);
  const teamAllowed = teams.every((team) => (teamCounts.get(team) ?? 0) < maxPerTeam);
  return matchupAllowed && teamAllowed;
}

function addConcentration(pairs, teams, matchupCounts, teamCounts) {
  for (const pair of pairs) matchupCounts.set(pair, (matchupCounts.get(pair) ?? 0) + 1);
  for (const team of teams) teamCounts.set(team, (teamCounts.get(team) ?? 0) + 1);
}

function concentrationReason(pairs, teams, matchupCounts, teamCounts) {
  const blockedPairs = pairs.filter((pair) => (matchupCounts.get(pair) ?? 0) >= maxPerMatchup);
  const blockedTeams = teams.filter((team) => (teamCounts.get(team) ?? 0) >= maxPerTeam);
  if (blockedTeams.length > 0 && blockedPairs.length > 0) {
    return `same-package team concentration exceeds ${maxPerTeam} and matchup concentration exceeds ${maxPerMatchup}`;
  }
  if (blockedTeams.length > 0) return `same-package team concentration exceeds ${maxPerTeam}`;
  return `same-package matchup concentration exceeds ${maxPerMatchup}`;
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const packageDate = operationalDate();
const prefix = `current-${packageDate}-*`;
const drafts = await client.fetch(`*[
  _type == "article" &&
  _id in path("drafts.**") &&
  morningPackageEligible == true &&
  coalesce(automationContentClass, "production") == "production" &&
  editorialInputId match $prefix
] | order(coalesce(editorialGeneratedAt, _createdAt) asc) {
  _id,title,standfirst,editorialInputId,editorialGeneratedAt,_createdAt,sourceNotes
}`, { prefix });

const matchupCounts = new Map();
const teamCounts = new Map();
const retained = [];
const evicted = [];
for (const draft of (Array.isArray(drafts) ? drafts : [])) {
  const pairs = matchupPairs(draftText(draft));
  const teams = [...new Set(teamIds(draftPrimaryText(draft)))];
  if (!canAdd(pairs, teams, matchupCounts, teamCounts)) {
    await client.patch(draft._id).set({ morningPackageEligible: false, automationContentClass: "production" }).commit();
    evicted.push({
      articleId: draft._id,
      editorialInputId: draft.editorialInputId,
      title: draft.title,
      pairs,
      teams,
      reason: concentrationReason(pairs, teams, matchupCounts, teamCounts),
    });
    continue;
  }
  retained.push(draft);
  addConcentration(pairs, teams, matchupCounts, teamCounts);
}

const batch = JSON.parse(await fs.readFile(batchPath, "utf8"));
if (!Array.isArray(batch?.candidates)) throw new Error("Current acquisition batch does not contain candidates.");

const retainedInputIds = new Set(retained.map((draft) => draft.editorialInputId).filter(Boolean));
const candidateMatchupCounts = new Map(matchupCounts);
const candidateTeamCounts = new Map(teamCounts);
const keptCandidates = [];
const rejectedCandidates = [];
for (const candidate of batch.candidates) {
  if (retainedInputIds.has(candidate?.id)) {
    keptCandidates.push(candidate);
    continue;
  }
  const pairs = matchupPairs(candidateText(candidate));
  const teams = [...new Set(teamIds(candidatePrimaryText(candidate)))];
  if (!canAdd(pairs, teams, candidateMatchupCounts, candidateTeamCounts)) {
    rejectedCandidates.push({
      id: candidate?.id,
      title: candidate?.title,
      pairs,
      teams,
      reason: concentrationReason(pairs, teams, candidateMatchupCounts, candidateTeamCounts),
    });
    continue;
  }
  keptCandidates.push(candidate);
  addConcentration(pairs, teams, candidateMatchupCounts, candidateTeamCounts);
}

batch.candidates = keptCandidates;
batch.packageDiversity = {
  checkedAt: new Date().toISOString(),
  packageDate,
  maxPerMatchup,
  maxPerTeam,
  retainedCount: retained.length,
  evictedDrafts: evicted,
  rejectedCandidates,
};
await fs.writeFile(batchPath, `${JSON.stringify(batch, null, 2)}\n`, "utf8");

const missingSlots = Math.max(0, packageSize - retained.length);
const availableReplacementCandidates = keptCandidates.filter((candidate) => !retainedInputIds.has(candidate?.id)).length;
if (availableReplacementCandidates < missingSlots) {
  throw new Error(`Package diversity fail-closed before model spend: only ${availableReplacementCandidates}/${missingSlots} candidates remain after concentration filtering.`);
}

console.log(JSON.stringify({
  packageDiversityGate: "passed",
  packageDate,
  maxPerMatchup,
  maxPerTeam,
  retainedCount: retained.length,
  missingSlots,
  evictedDrafts: evicted,
  rejectedCandidateCount: rejectedCandidates.length,
  rejectedCandidates,
  remainingCandidateCount: keptCandidates.length,
  matchupCounts: Object.fromEntries(matchupCounts),
  teamCounts: Object.fromEntries(teamCounts),
}, null, 2));
