import fs from "node:fs/promises";
import path from "node:path";
import { selectFreshPositions } from "../lib/editorial/StoryFreshness.ts";

const [inputPath] = process.argv.slice(2);
if (!inputPath) {
  console.error("Usage: node scripts/import-editorial-acquisition-batch.mjs <batch.json>");
  process.exit(1);
}

const PACKAGE_STYLE_PROFILES = ["news-desk", "analysis-led", "feature-led", "notebook", "explainer"];
const baseUrl = (process.env.EDITORIAL_API_BASE_URL || "https://therugbypanda.ie").replace(/\/$/, "");
const secret = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const requireAllSelectedCreated = process.env.REQUIRE_ALL_SELECTED_CREATED === "1" || process.env.REQUIRE_ALL_SELECTED_CREATED === "true";
const reuseExistingIds = new Set((process.env.REUSE_EXISTING_IDS || "").split(",").map((value) => value.trim()).filter(Boolean));

if (!secret && !dryRun) throw new Error("EDITORIAL_AUTOMATION_SECRET is required unless DRY_RUN=1.");

const raw = await fs.readFile(path.resolve(inputPath), "utf8");
const batch = JSON.parse(raw);
if (batch?.schemaVersion !== "1.0" || !Array.isArray(batch?.candidates) || batch.candidates.length === 0) {
  throw new Error("Invalid editorial acquisition batch.");
}

function positionForCandidate(candidate) {
  const position = candidate.editorialPosition || {};
  return {
    id: candidate.id,
    subject: position.subject || candidate.subject || candidate.title || "",
    development: position.development || candidate.development || candidate.summary || "",
    angle: position.angle || candidate.editorialAngle || candidate.summary || "",
    occurredAt: position.occurredAt || candidate.occurredAt,
  };
}

async function loadRecentPositions() {
  const configured = process.env.RECENT_EDITORIAL_POSITIONS_PATH?.trim();
  const candidates = [configured, "data/editorial-acquisition/recent-editorial-positions.json"].filter(Boolean);
  for (const candidatePath of candidates) {
    try {
      const parsed = JSON.parse(await fs.readFile(path.resolve(candidatePath), "utf8"));
      const positions = Array.isArray(parsed) ? parsed : parsed.positions;
      if (Array.isArray(positions)) return positions;
    } catch (error) {
      if (configured && candidatePath === configured) throw error;
    }
  }
  throw new Error("Freshness fail-closed: no recent editorial-position history is available before generation.");
}

const recentPositions = await loadRecentPositions();
const candidatePositions = batch.candidates.map(positionForCandidate);
const freshness = selectFreshPositions(candidatePositions, recentPositions, 5);
const selectedIds = new Set(freshness.selected.map((position) => position.id));
if (freshness.selected.length !== 5) {
  console.error(JSON.stringify({
    freshnessGate: "failed",
    required: 5,
    selected: freshness.selected,
    rejected: freshness.rejected,
  }, null, 2));
  throw new Error(`Freshness fail-closed: selected ${freshness.selected.length}/5 genuinely distinct positions.`);
}
const selectedCandidates = batch.candidates.filter((candidate) => selectedIds.has(candidate.id));
console.log(JSON.stringify({ freshnessGate: "passed", selectedIds: [...selectedIds], rejected: freshness.rejected }, null, 2));

function styleForCandidate(candidate, index) {
  const styleProfileId = candidate.styleProfileId || PACKAGE_STYLE_PROFILES[index % PACKAGE_STYLE_PROFILES.length];
  if (!PACKAGE_STYLE_PROFILES.includes(styleProfileId)) throw new Error(`Invalid styleProfileId ${styleProfileId} for candidate ${candidate.id}.`);
  return styleProfileId;
}

function buildRequest(candidate, index) {
  const retrievedAt = batch.acquiredAt || new Date().toISOString();
  const sourceRecords = candidate.sourceRecords.map((source) => ({ ...source, retrievedAt }));
  const sourceIds = sourceRecords.map((source) => source.id);
  return {
    story: { id: candidate.id, title: candidate.title, summary: candidate.summary, sourceRecords, discoveredAt: retrievedAt, suggestedCategory: candidate.suggestedCategory },
    factLedger: { facts: candidate.facts.map((claim, factIndex) => ({ id: `${candidate.id}-fact-${factIndex + 1}`, claim, status: "confirmed", confidence: 98, sourceIds, usableInDraft: true })), unsupportedClaims: [], conflicts: [] },
    createSanityDraft: true,
    qaMode: false,
    notificationMode: "package",
    styleProfileId: styleForCandidate(candidate, index),
  };
}

const results = [];
for (const [index, candidate] of selectedCandidates.entries()) {
  const styleProfileId = styleForCandidate(candidate, index);
  const shouldReuse = candidate.reuseExistingDraft === true || reuseExistingIds.has(candidate.id);
  if (shouldReuse) {
    if (requireAllSelectedCreated && !dryRun) {
      results.push({ id: candidate.id, styleProfileId, status: "reuse-disallowed", ok: false, body: { error: "Normal scheduled packages require every selected position to create a new eligible Sanity draft in this run." } });
      continue;
    }
    results.push({ id: candidate.id, styleProfileId, status: "reused-existing", ok: true, body: { message: "Generation deliberately skipped; final package validation must confirm the existing production draft." } });
    continue;
  }
  const payload = buildRequest(candidate, index);
  if (dryRun) {
    results.push({ id: candidate.id, status: "dry-run", styleProfileId: payload.styleProfileId, ok: true, payload });
    continue;
  }
  try {
    const response = await fetch(`${baseUrl}/api/editorial/draft`, { method: "POST", headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" }, body: JSON.stringify(payload) });
    const body = await response.json().catch(() => ({ error: "Non-JSON response" }));
    const draftCreated = response.ok && body?.status === "draft-created" && Boolean(body?.sanityDraft?.id) && body?.sanityDraft?.morningPackageEligible === true;
    results.push({
      id: candidate.id,
      styleProfileId: payload.styleProfileId,
      status: body?.status || response.status,
      httpStatus: response.status,
      ok: draftCreated,
      body,
    });
  } catch (error) {
    results.push({ id: candidate.id, styleProfileId: payload.styleProfileId, status: "request-error", ok: false, body: { error: error instanceof Error ? error.message : "Request failed" } });
  }
}

const failed = results.filter((result) => result.ok !== true);
const generatedResults = results.filter((result) => result.status !== "reused-existing" && result.status !== "dry-run" && result.status !== "reuse-disallowed");
const createdDrafts = generatedResults.filter((result) => result.ok === true && result.status === "draft-created");
const expectedGenerated = requireAllSelectedCreated
  ? selectedCandidates.length
  : selectedCandidates.filter((candidate) => !(candidate.reuseExistingDraft === true || reuseExistingIds.has(candidate.id))).length;

if (!dryRun && createdDrafts.length !== expectedGenerated) {
  console.error(JSON.stringify({
    packageCreationGate: "failed",
    requireAllSelectedCreated,
    expectedGenerated,
    createdDrafts: createdDrafts.length,
    failed,
  }, null, 2));
  throw new Error(`Package creation fail-closed: only ${createdDrafts.length}/${expectedGenerated} selected positions created eligible Sanity drafts.`);
}

console.log(JSON.stringify({
  batchId: batch.batchId,
  freshnessGate: { selectedIds: [...selectedIds], rejected: freshness.rejected },
  packageCreationGate: dryRun ? "dry-run" : "passed",
  requireAllSelectedCreated,
  expectedGenerated,
  createdDrafts: createdDrafts.length,
  results,
  failedCount: failed.length,
}, null, 2));
if (failed.length > 0) process.exitCode = 2;
