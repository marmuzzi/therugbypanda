import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import { selectFreshPositions } from "../lib/editorial/StoryFreshness.ts";

const PACKAGE_SIZE = 5;
const batchPath = process.env.BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json";
const recentPath = process.env.RECENT_EDITORIAL_POSITIONS_PATH || "data/editorial-acquisition/recent-editorial-positions.json";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("Slot-budget planning requires Sanity project ID and token.");

const operationalDate = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Dublin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const batch = JSON.parse(await fs.readFile(path.resolve(batchPath), "utf8"));
const recentRaw = JSON.parse(await fs.readFile(path.resolve(recentPath), "utf8"));
const recentPositions = Array.isArray(recentRaw) ? recentRaw : recentRaw.positions;
if (!Array.isArray(batch?.candidates) || !Array.isArray(recentPositions)) throw new Error("Slot-budget planning fail-closed: batch or recent positions are invalid.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const prefix = `current-${operationalDate()}-*`;
const retained = await client.fetch(`*[_type == "article" && _id in path("drafts.**") && morningPackageEligible == true && coalesce(automationContentClass, "production") == "production" && editorialInputId match $prefix] {editorialInputId}`, { prefix });
const retainedIds = new Set((Array.isArray(retained) ? retained : []).map((draft) => draft.editorialInputId).filter(Boolean));
const retainedCount = Math.min(PACKAGE_SIZE, retainedIds.size);
const missingSlots = Math.max(0, PACKAGE_SIZE - retainedCount);

const available = batch.candidates.filter((candidate) => !retainedIds.has(candidate.id));
const positions = available.map((candidate) => ({ id: candidate.id, subject: candidate.editorialPosition?.subject || candidate.title || "", development: candidate.editorialPosition?.development || candidate.summary || "", angle: candidate.editorialPosition?.angle || candidate.summary || "", occurredAt: candidate.editorialPosition?.occurredAt || candidate.primaryPublishedAt }));
const freshness = selectFreshPositions(positions, recentPositions, missingSlots);
const selectedIds = new Set(freshness.selected.map((position) => position.id));
const selected = available.filter((candidate) => selectedIds.has(candidate.id));
if (selected.length < missingSlots) throw new Error(`Slot-budget planning fail-closed before model spend: only ${selected.length}/${missingSlots} fresh candidates can be assigned one-to-one to missing slots.`);

batch.slotBudgetPlan = { operationalDate: operationalDate(), dailyCeilingUsd: 0.40, reservationPerSlotUsd: 0.055, retainedCount, missingSlots, paidAttemptLimit: missingSlots, replacementPaidAttempts: 0, selectedIds: selected.map((candidate) => candidate.id), plannedAt: new Date().toISOString() };
batch.candidates = selected;
await fs.writeFile(path.resolve(batchPath), `${JSON.stringify(batch, null, 2)}\n`);
console.log(JSON.stringify({ slotBudgetPlan: "passed", retainedCount, missingSlots, paidAttemptLimit: missingSlots, replacementPaidAttempts: 0, selectedIds: batch.slotBudgetPlan.selectedIds, rejectedByFreshness: freshness.rejected.length }, null, 2));
