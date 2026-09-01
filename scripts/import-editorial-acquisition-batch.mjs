import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { selectFreshPositions } from "../lib/editorial/StoryFreshness.ts";

const [inputPath] = process.argv.slice(2);
if (!inputPath) {
  console.error("Usage: node scripts/import-editorial-acquisition-batch.mjs <batch.json>");
  process.exit(1);
}

const PACKAGE_SIZE = 5;
const PACKAGE_STYLE_PROFILES = ["news-desk", "analysis-led", "feature-led", "notebook", "explainer"];
const ALLOWED_CATEGORIES = new Set(["Ireland", "Leinster", "Munster", "Ulster", "Connacht", "URC", "Europe", "Opinion"]);
const NON_RUGBY_EVIDENCE = /\b(football daily|premier league|soccer|boxing|golf|cycling|athletics|\b5k\b|gaelic football|hurling|sailing|ilca|world championship in d[uú]n laoghaire|protest)\b/i;
const GENERIC_SOURCE_TITLE = /^\s*(?:-|the 42|rugby football union|united rugby championship|untitled design)?\s*$/i;
const baseUrl = (process.env.EDITORIAL_API_BASE_URL || "https://therugbypanda.ie").replace(/\/$/, "");
const secret = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const requireAllSelectedCreated = process.env.REQUIRE_ALL_SELECTED_CREATED === "1" || process.env.REQUIRE_ALL_SELECTED_CREATED === "true";
const maxReplacementCandidates = Math.max(0, Number.parseInt(process.env.MAX_REPLACEMENT_CANDIDATES || "2", 10) || 2);
const concurrency = Math.min(2, Math.max(1, Number.parseInt(process.env.EDITORIAL_GENERATION_CONCURRENCY || "2", 10) || 2));

if (!secret && !dryRun) throw new Error("EDITORIAL_AUTOMATION_SECRET is required unless DRY_RUN=1.");

const raw = await fs.readFile(path.resolve(inputPath), "utf8");
const batch = JSON.parse(raw);
if (batch?.schemaVersion !== "1.0" || !Array.isArray(batch?.candidates) || batch.candidates.length === 0) {
  throw new Error("Invalid editorial acquisition batch.");
}

function operationalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
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

function substantiveSource(source) {
  const title = String(source?.title || "").replace(/&nbsp;/g, " ").trim();
  const detail = [title, source?.excerpt, source?.bodyText].filter(Boolean).join(" ").replace(/&nbsp;/g, " ").trim();
  return title.length >= 20 && detail.length >= 40 && !GENERIC_SOURCE_TITLE.test(title) && !NON_RUGBY_EVIDENCE.test(detail);
}

function evidenceAssessment(candidate) {
  const sourceRecords = Array.isArray(candidate.sourceRecords) ? candidate.sourceRecords : [];
  const substantive = sourceRecords.filter(substantiveSource);
  const publishers = new Set(substantive.map((source) => String(source.publisher || source.name || "").trim().toLowerCase()).filter(Boolean));
  const facts = (Array.isArray(candidate.facts) ? candidate.facts : [])
    .map((fact) => String(fact || "").replace(/&nbsp;/g, " ").trim())
    .filter((fact) => fact.length >= 25 && !GENERIC_SOURCE_TITLE.test(fact) && !NON_RUGBY_EVIDENCE.test(fact));
  const passed = substantive.length >= 2 && publishers.size >= 2 && facts.length >= 2;
  return { passed, substantiveSourceCount: substantive.length, distinctPublisherCount: publishers.size, substantiveFactCount: facts.length };
}

function retainedDraftIntegrity(draft) {
  const sourceText = (Array.isArray(draft?.sourceNotes) ? draft.sourceNotes : [])
    .map((note) => [note?.publisher, note?.usage].filter(Boolean).join(" "))
    .join(" ");
  const cardText = [
    draft?.contextualDataCard?.title,
    draft?.contextualDataCard?.subtitle,
    ...(Array.isArray(draft?.contextualDataCard?.rows) ? draft.contextualDataCard.rows.flatMap((row) => [row?.label, row?.value]) : []),
  ].filter(Boolean).join(" ");
  const combined = [draft?.title, sourceText, cardText].filter(Boolean).join(" ").replace(/&nbsp;/g, " ");
  const contaminated = NON_RUGBY_EVIDENCE.test(combined);
  return {
    passed: !contaminated,
    reason: contaminated ? "retained draft contains non-rugby source/card provenance" : null,
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

async function loadRetainedDrafts() {
  if (dryRun) return { retained: [], evicted: [] };
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId || !token) throw new Error("Same-day recovery requires Sanity project ID and token.");
  const packageDate = operationalDate();
  const prefix = `current-${packageDate}-*`;
  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
  const drafts = await client.fetch(`*[
    _type == "article" &&
    _id in path("drafts.**") &&
    morningPackageEligible == true &&
    coalesce(automationContentClass, "production") == "production" &&
    editorialInputId match $prefix &&
    (!defined(workflowStatus) || workflowStatus in ["draft", "submitted", "in-review", "review", "under-review", "approved"])
  ] | order(coalesce(editorialGeneratedAt, _createdAt) asc) {
    _id,title,editorialInputId,editorialGeneratedAt,_createdAt,workflowStatus,sourceNotes,contextualDataCard
  }`, { prefix });
  const retained = [];
  const evicted = [];
  for (const draft of (Array.isArray(drafts) ? drafts : [])) {
    const integrity = retainedDraftIntegrity(draft);
    if (integrity.passed && retained.length < PACKAGE_SIZE) {
      retained.push(draft);
      continue;
    }
    if (!integrity.passed) {
      await client.patch(draft._id).set({
        morningPackageEligible: false,
        automationContentClass: "production",
      }).commit();
      evicted.push({ _id: draft._id, editorialInputId: draft.editorialInputId, title: draft.title, reason: integrity.reason });
    }
  }
  return { retained, evicted };
}

function styleForSlot(slotIndex) {
  return PACKAGE_STYLE_PROFILES[slotIndex % PACKAGE_STYLE_PROFILES.length];
}

function buildRequest(candidate, slotIndex) {
  const retrievedAt = batch.acquiredAt || new Date().toISOString();
  if (!Array.isArray(candidate.sourceRecords) || candidate.sourceRecords.length < 2) {
    throw new Error(`Candidate ${candidate.id} does not contain at least two source records.`);
  }
  const sourceRecords = candidate.sourceRecords.map((source, sourceIndex) => {
    const publisher = String(source.publisher || source.name || "").trim();
    const title = String(source.title || "").trim();
    const url = String(source.url || "").trim();
    if (!publisher || !title || !url) {
      throw new Error(`Candidate ${candidate.id} source ${sourceIndex + 1} is missing publisher, title or url.`);
    }
    return {
      id: String(source.id || `${candidate.id}-source-${sourceIndex + 1}`),
      url,
      publisher,
      title,
      publishedAt: source.publishedAt,
      retrievedAt,
      excerpt: source.excerpt,
      bodyText: source.bodyText,
      author: source.author,
      isPrimarySource: source.isPrimarySource === true,
    };
  });
  const sourceIds = sourceRecords.map((source) => source.id);
  const suggestedCategory = ALLOWED_CATEGORIES.has(candidate.suggestedCategory) ? candidate.suggestedCategory : undefined;
  return {
    story: {
      id: candidate.id,
      title: candidate.title,
      summary: candidate.summary,
      sourceRecords,
      discoveredAt: retrievedAt,
      suggestedCategory,
    },
    factLedger: {
      facts: candidate.facts.map((claim, factIndex) => ({
        id: `${candidate.id}-fact-${factIndex + 1}`,
        claim,
        status: "confirmed",
        confidence: 98,
        sourceIds,
        usableInDraft: true,
      })),
      unsupportedClaims: [],
      conflicts: [],
    },
    createSanityDraft: true,
    qaMode: false,
    notificationMode: "package",
    styleProfileId: styleForSlot(slotIndex),
  };
}

async function generateCandidate(candidate, slotIndex) {
  const styleProfileId = styleForSlot(slotIndex);
  let payload;
  try {
    payload = buildRequest(candidate, slotIndex);
  } catch (error) {
    return { id: candidate.id, styleProfileId, status: "request-shape-error", ok: false, body: { error: error instanceof Error ? error.message : "Invalid request shape" } };
  }
  if (dryRun) return { id: candidate.id, styleProfileId, status: "dry-run", ok: true, payload };

  const call = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/editorial/draft`, {
        method: "POST",
        headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({ error: "Non-JSON response" }));
      const draftCreated = response.ok && body?.status === "draft-created" && Boolean(body?.sanityDraft?.id) && body?.sanityDraft?.morningPackageEligible === true;
      return { id: candidate.id, styleProfileId, status: body?.status || response.status, httpStatus: response.status, ok: draftCreated, body };
    } catch (error) {
      return { id: candidate.id, styleProfileId, status: "request-error", ok: false, body: { error: error instanceof Error ? error.message : "Request failed" } };
    }
  };

  const first = await call();
  const message = String(first?.body?.error || "");
  if (first.ok || !/(timeout|timed out|aborted|request failed)/i.test(message)) return first;
  const second = await call();
  return { ...second, retryOf: first.status };
}

const recentPositions = await loadRecentPositions();
const retainedState = await loadRetainedDrafts();
const retainedDrafts = retainedState.retained;
const evictedDrafts = retainedState.evicted;
const retainedCount = retainedDrafts.length;
const retainedInputIds = new Set(retainedDrafts.map((draft) => draft.editorialInputId).filter(Boolean));
const missingSlots = Math.max(0, PACKAGE_SIZE - retainedCount);
console.log(JSON.stringify({ sameDayRecovery: "loaded", packageDate: operationalDate(), retainedCount, retainedDrafts, evictedDrafts, missingSlots }, null, 2));

if (retainedCount >= PACKAGE_SIZE) {
  console.log(JSON.stringify({ packageCreationGate: "passed", retainedCount, createdDrafts: 0, totalEligible: retainedCount, evictedDrafts, reason: "same-day-package-already-complete" }, null, 2));
  process.exit(0);
}

const retainedIdConflicts = batch.candidates
  .filter((candidate) => retainedInputIds.has(candidate.id))
  .map((candidate) => ({ id: candidate.id, title: candidate.title }));
if (retainedIdConflicts.length > 0) {
  console.warn(JSON.stringify({ retainedIdCollisionGuard: "blocked", conflicts: retainedIdConflicts }, null, 2));
}

const unreservedCandidates = batch.candidates.filter((candidate) => !retainedInputIds.has(candidate.id));
const assessed = unreservedCandidates.map((candidate) => ({ candidate, assessment: evidenceAssessment(candidate) }));
const evidenceRejected = assessed.filter(({ assessment }) => !assessment.passed).map(({ candidate, assessment }) => ({ id: candidate.id, title: candidate.title, ...assessment }));
const eligibleCandidates = assessed.filter(({ assessment }) => assessment.passed).map(({ candidate }) => candidate);
console.log(JSON.stringify({ evidenceSufficiencyGate: "completed", eligible: eligibleCandidates.length, rejected: evidenceRejected, retainedIdConflicts }, null, 2));

const candidatePositions = eligibleCandidates.map(positionForCandidate);
const freshness = selectFreshPositions(candidatePositions, recentPositions, Math.min(candidatePositions.length, missingSlots + maxReplacementCandidates));
const freshIds = new Set(freshness.selected.map((position) => position.id));
const freshQueue = eligibleCandidates.filter((candidate) => freshIds.has(candidate.id));
if (freshQueue.length < missingSlots) {
  console.error(JSON.stringify({ freshnessGate: "failed", requiredMissing: missingSlots, freshCandidates: freshQueue.length, rejected: freshness.rejected, evidenceRejected, retainedIdConflicts, evictedDrafts }, null, 2));
  throw new Error(`Recovery fail-closed before model spend: only ${freshQueue.length}/${missingSlots} fresh evidence-sufficient candidates are available.`);
}
console.log(JSON.stringify({ freshnessGate: "passed", retainedCount, requiredMissing: missingSlots, freshCandidateIds: freshQueue.map((candidate) => candidate.id), rejected: freshness.rejected }, null, 2));

const results = [];
let createdDrafts = 0;
let queueIndex = 0;
while (createdDrafts < missingSlots && queueIndex < freshQueue.length) {
  const remainingSlots = missingSlots - createdDrafts;
  const roundSize = Math.min(concurrency, remainingSlots, freshQueue.length - queueIndex);
  const round = freshQueue.slice(queueIndex, queueIndex + roundSize);
  queueIndex += roundSize;
  const roundResults = await Promise.all(round.map((candidate, offset) => generateCandidate(candidate, retainedCount + createdDrafts + offset)));
  results.push(...roundResults);
  createdDrafts += roundResults.filter((result) => result.ok === true && result.status === "draft-created").length;
}

const failed = results.filter((result) => result.ok !== true);
const totalEligible = retainedCount + createdDrafts;
if (!dryRun && requireAllSelectedCreated && totalEligible !== PACKAGE_SIZE) {
  console.error(JSON.stringify({ packageCreationGate: "failed", retainedCount, createdDrafts, totalEligible, required: PACKAGE_SIZE, failed, attemptedCandidates: results.length, evictedDrafts }, null, 2));
  throw new Error(`Package creation fail-closed: ${totalEligible}/${PACKAGE_SIZE} same-day eligible drafts available after bounded recovery.`);
}

console.log(JSON.stringify({
  batchId: batch.batchId,
  sameDayRecovery: { retainedCount, missingSlots, retainedDraftIds: retainedDrafts.map((draft) => draft._id), evictedDrafts },
  retainedIdCollisionGuard: { conflicts: retainedIdConflicts },
  evidenceSufficiencyGate: { eligible: eligibleCandidates.length, rejected: evidenceRejected },
  freshnessGate: { selectedIds: freshQueue.map((candidate) => candidate.id), rejected: freshness.rejected },
  packageCreationGate: dryRun ? "dry-run" : "passed",
  createdDrafts,
  totalEligible,
  attemptedCandidates: results.length,
  results,
  failedCount: failed.length,
}, null, 2));
if (failed.length > 0 && totalEligible < PACKAGE_SIZE) process.exitCode = 2;
