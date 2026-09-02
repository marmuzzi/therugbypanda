import fs from "node:fs/promises";
import path from "node:path";

const batchPath = process.env.CURRENT_ACQUISITION_BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json";
const reportPath = process.env.CURRENT_EVIDENCE_SUFFICIENCY_REPORT || "data/editorial-acquisition/current-evidence-sufficiency.json";
const raw = JSON.parse(await fs.readFile(path.resolve(batchPath), "utf8"));

if (raw?.schemaVersion !== "1.0" || !Array.isArray(raw.candidates)) {
  throw new Error("Concrete evidence gate fail-closed: invalid current acquisition batch.");
}

const TEAM_OR_COMPETITION = new Set([
  "All Blacks", "New Zealand", "Springboks", "South Africa", "Wallabies", "Australia", "Ireland", "Ireland Women",
  "Leinster", "Munster", "Ulster", "Connacht", "England", "Scotland", "Wales", "France", "Italy", "Argentina",
  "Pumas", "Fiji", "Japan", "Samoa", "Tonga", "United Rugby Championship", "Six Nations", "Champions Cup",
  "Challenge Cup", "World Cup", "Rugby Championship",
]);
const MONTH = /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
const MATCHISH = /\b(?:match|test|round|fixture|final|semi-final|quarter-final|beat|defeat|win|won|loss|lost|draw|score|kick-?off|squad|team named|selection|selected|starts?|bench|line-up|lineup|change|injury|return|available|unavailable|contract|signed|appointed|coach|captain)\b/i;
const CONCRETE_RUGBY = /\b(?:prop|hooker|lock|flanker|number ?8|scrum-?half|fly-?half|out-?half|centre|wing(?:er)?|full-?back|tighthead|loosehead|front row|back row|captain|coach|head coach|assistant coach|academy|debut|caps?|appearances?|tries?|points?|minutes?|weeks?|months?|years?)\b/i;
const VENUE_WORDS = /\b(?:stadium|park|ground|arena|sportsground|aviva|thomond|kingspan|dexcom|rds|croke park|eden park|cape town|auckland|dublin|limerick|belfast|galway|cork)\b/i;
const SCORE_OR_NUMBER = /(?:\b\d{1,3}\s*[-–]\s*\d{1,3}\b|\b\d{1,3}\b|\b(?:one|two|three|four|five|six|seven|eight|nine|ten)\b)/i;
const QUOTED = /[“”"'‘’][^“”"'‘’]{5,}[“”"'‘’]/;

function clean(value = "") {
  return String(value ?? "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function personNames(value = "") {
  const matches = clean(value).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}(?:\s+(?:van|de|der|von|di|da))?\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\b/g) ?? [];
  return [...new Set(matches.map(clean).filter((name) => !TEAM_OR_COMPETITION.has(name)))];
}

function assess(candidate) {
  const sources = Array.isArray(candidate.sourceRecords) ? candidate.sourceRecords : [];
  const facts = Array.isArray(candidate.facts) ? candidate.facts.map(clean).filter(Boolean) : [];
  const sourceText = sources.flatMap((source) => [source.title, source.excerpt, source.bodyText]).map(clean).filter(Boolean);
  const evidence = [candidate.title, candidate.summary, candidate.editorialPosition?.subject, candidate.editorialPosition?.development, ...facts, ...sourceText].map(clean).filter(Boolean).join(" ");
  const names = personNames(evidence);
  const distinctPublishers = new Set(sources.map((source) => clean(source.publisher || source.name).toLowerCase()).filter(Boolean));
  const hasConcreteMarker = SCORE_OR_NUMBER.test(evidence) || MONTH.test(evidence) || CONCRETE_RUGBY.test(evidence) || VENUE_WORDS.test(evidence) || QUOTED.test(evidence);
  const matchLike = MATCHISH.test(evidence);
  const hasMatchContext = !matchLike || SCORE_OR_NUMBER.test(evidence) || MONTH.test(evidence) || VENUE_WORDS.test(evidence) || /\b(?:first|second|third|fourth) test\b/i.test(evidence);
  const reasons = [];
  if (sources.length < 2 || distinctPublishers.size < 2) reasons.push("fewer-than-two-independent-sources");
  if (facts.length < 2) reasons.push("fewer-than-two-substantive-facts");
  if (names.length < 1) reasons.push("no-named-person-in-evidence");
  if (!hasConcreteMarker) reasons.push("no-concrete-rugby-marker");
  if (!hasMatchContext) reasons.push("match-like-story-lacks-date-score-venue-or-test-context");
  return {
    passed: reasons.length === 0,
    reasons,
    namedPeople: names.slice(0, 8),
    sourceCount: sources.length,
    distinctPublisherCount: distinctPublishers.size,
    factCount: facts.length,
    hasConcreteMarker,
    matchLike,
    hasMatchContext,
  };
}

const assessed = raw.candidates.map((candidate) => ({ candidate, assessment: assess(candidate) }));
const accepted = assessed.filter(({ assessment }) => assessment.passed).map(({ candidate }) => candidate);
const rejected = assessed.filter(({ assessment }) => !assessment.passed).map(({ candidate, assessment }) => ({ id: candidate.id, title: candidate.title, ...assessment }));

const report = {
  generatedAt: new Date().toISOString(),
  packageDate: raw.packageDate ?? null,
  inputCandidates: raw.candidates.length,
  acceptedCandidates: accepted.length,
  rejectedCandidates: rejected.length,
  rejected,
  contract: "P0 concrete evidence before OpenAI generation",
  failClosed: true,
};

await fs.mkdir(path.dirname(path.resolve(reportPath)), { recursive: true });
await fs.writeFile(path.resolve(reportPath), `${JSON.stringify(report, null, 2)}\n`);

if (accepted.length < 5) {
  console.error(JSON.stringify(report, null, 2));
  throw new Error(`Concrete evidence gate fail-closed before model spend: only ${accepted.length}/5 candidates have named and concrete rugby evidence.`);
}

raw.candidates = accepted;
raw.provenance = {
  ...(raw.provenance ?? {}),
  concreteEvidenceGate: {
    inputCandidates: assessed.length,
    acceptedCandidates: accepted.length,
    rejectedCandidates: rejected.length,
    reportPath,
  },
};
await fs.writeFile(path.resolve(batchPath), `${JSON.stringify(raw, null, 2)}\n`);
console.log(JSON.stringify({ concreteEvidenceGate: "passed", inputCandidates: assessed.length, acceptedCandidates: accepted.length, rejectedCandidates: rejected.length, batchPath, reportPath }, null, 2));
