import fs from "node:fs/promises";
import path from "node:path";

const inputPath = process.env.WIKIMEDIA_CANDIDATE_FILE ?? "data/editorial-images/wikimedia-candidates.json";
const outputPath = process.env.WIKIMEDIA_REVIEW_FILE ?? "data/editorial-images/wikimedia-reviewed.json";
const reportPath = process.env.WIKIMEDIA_TRIAGE_REPORT ?? "data/editorial-images/wikimedia-triage-report.json";

const input = JSON.parse(await fs.readFile(path.resolve(process.cwd(), inputPath), "utf8"));
const candidates = Array.isArray(input) ? input : input.candidates;
if (!Array.isArray(candidates)) throw new Error("Candidate input must be an array or contain a candidates array.");

const blockedVisualPatterns = /\b(logo|crest|badge|emblem|wordmark|flag|shirt template|jersey template)\b/i;
const blockedSportPatterns = /\b(rugby league|NRL|super league|rugby sevens? league)\b/i;
const suspiciousRightsPatterns = /(?:©|copyright|mandatory credit|\bINPHO\b|Getty Images|Reuters|Associated Press|AP Photo|Press Association|Sportsfile)/i;

function searchable(item) {
  return [item.title, item.description, item.categories, item.credit, item.creator].filter(Boolean).join(" ");
}

function decisionFor(item) {
  if (item?.autoDecision === "owner-review") return { decision: "owner-review", reason: "discovery marked rights/relevance ambiguity" };
  if (item?.autoDecision !== "approve-candidate") return { decision: "reject", reason: `discovery decision ${item?.autoDecision ?? "missing"}` };
  if (item?.rightsClear !== true) return { decision: "reject", reason: "rights not clearly reusable" };
  if (!Array.isArray(item?.subjectEvidence) || item.subjectEvidence.length === 0) return { decision: "reject", reason: "no positive subject evidence" };
  if (!/^image\/(jpeg|png|webp)$/i.test(String(item?.mime ?? ""))) return { decision: "reject", reason: "unsupported image type" };
  if (Number(item?.width) < 900 || Number(item?.height) < 600) return { decision: "reject", reason: "insufficient publication resolution" };

  const text = searchable(item);
  if (blockedVisualPatterns.test(text)) return { decision: "reject", reason: "logo/crest belongs in Brand Assets, not Editorial Images" };
  if (blockedSportPatterns.test(text)) return { decision: "reject", reason: "rugby league/non-union false positive" };
  if (suspiciousRightsPatterns.test(text)) return { decision: "reject", reason: "source metadata contains conflicting third-party copyright/credit signal" };

  return { decision: "approve", reason: item.recent ? "clear relevant rights-safe recent candidate" : "clear relevant rights-safe contextual/historical candidate" };
}

const reviewed = candidates.map((item) => {
  const { decision, reason } = decisionFor(item);
  return { ...item, assistantDecision: decision, assistantDecisionReason: reason };
});

const counts = reviewed.reduce((acc, item) => {
  acc[item.assistantDecision] = (acc[item.assistantDecision] ?? 0) + 1;
  return acc;
}, {});
const approved = reviewed.filter((item) => item.assistantDecision === "approve");
const coverage = approved.reduce((acc, item) => {
  acc[item.scope ?? "Unknown"] = (acc[item.scope ?? "Unknown"] ?? 0) + 1;
  return acc;
}, {});
const recentRate = approved.length ? approved.filter((item) => item.recent).length / approved.length : 0;
const ownerReviewRate = reviewed.length ? (counts["owner-review"] ?? 0) / reviewed.length : 0;
const maxScopeShare = approved.length ? Math.max(...Object.values(coverage)) / approved.length : 0;

const report = {
  generatedAt: new Date().toISOString(),
  sourceGeneratedAt: input.generatedAt,
  totalCandidates: reviewed.length,
  counts,
  approvedCoverage: coverage,
  recentApprovalRate: recentRate,
  ownerReviewRate,
  maxScopeShare,
  policyChecks: {
    majorityRecent: recentRate >= 0.5,
    ownerReviewAtOrBelowFivePercent: ownerReviewRate <= 0.05,
    noScopeAboveTwentyFivePercent: maxScopeShare <= 0.25,
  },
};

if (!report.policyChecks.majorityRecent) throw new Error(`Recent approval rate ${(recentRate * 100).toFixed(1)}% is below majority requirement.`);
if (!report.policyChecks.ownerReviewAtOrBelowFivePercent) throw new Error(`Owner review rate ${(ownerReviewRate * 100).toFixed(1)}% exceeds 5%.`);
if (!report.policyChecks.noScopeAboveTwentyFivePercent) throw new Error(`Largest scope share ${(maxScopeShare * 100).toFixed(1)}% exceeds diversity ceiling.`);
if (approved.length < 20) throw new Error(`Only ${approved.length} candidates survived strict assistant triage; redesign acquisition before importing.`);

await fs.mkdir(path.dirname(path.resolve(process.cwd(), outputPath)), { recursive: true });
await fs.writeFile(path.resolve(process.cwd(), outputPath), `${JSON.stringify({ generatedAt: report.generatedAt, sourceGeneratedAt: input.generatedAt, candidates: reviewed }, null, 2)}\n`);
await fs.writeFile(path.resolve(process.cwd(), reportPath), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));