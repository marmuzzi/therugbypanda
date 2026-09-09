import fs from "node:fs/promises";
import path from "node:path";

const batchPath = process.env.BATCH_PATH || "data/editorial-acquisition/current-editorial-acquisition-batch.json";
const reportPath = process.env.PREAI_MATCH_DETAIL_REPORT || "data/editorial-acquisition/preai-match-detail-parity.json";
const batch = JSON.parse(await fs.readFile(path.resolve(batchPath), "utf8"));
if (!Array.isArray(batch?.candidates)) throw new Error("Pre-AI match-detail parity requires a valid acquisition batch.");

const MATCH_LIKE = /\b(?:match|test|round|fixture|final|semi-final|quarter-final|trial|friendly|beat|defeat|win|won|loss|lost|draw|score|kick-?off|victory|overpower(?:ed)?)\b/i;
const DATE_DETAIL = /\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|today|tonight|yesterday|tomorrow)\b|\b\d{1,2}[\s/-](?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{1,2})\b/i;
const SCORE_DETAIL = /\b\d{1,3}\s*[-–:]\s*\d{1,3}\b/;
const VENUE_DETAIL = /\b(?:stadium|park|ground|arena|sportsground|aviva|thomond|kingspan|dexcom|rds|croke park|eden park|cape town|auckland|dublin|limerick|belfast|galway|cork|soweto|bungendore)\b/i;
const NON_PERSON = /^(?:Irish Independent|The Irish Times|Irish Examiner|Planet Rugby|RugbyPass Ireland|United Rugby|World Rugby|New Zealand|South Africa|The Rugby Panda)$/i;

function clean(value = "") { return String(value ?? "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
function people(value = "") {
  const matches = clean(value).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\b/g) ?? [];
  return [...new Set(matches.filter((name) => !NON_PERSON.test(name)))];
}
function candidateEvidence(candidate) {
  const facts = Array.isArray(candidate?.facts) ? candidate.facts : [];
  const sources = Array.isArray(candidate?.sourceRecords) ? candidate.sourceRecords : [];
  return [candidate?.title, candidate?.summary, candidate?.editorialPosition?.subject, candidate?.editorialPosition?.development, ...facts, ...sources.flatMap((source) => [source?.title, source?.excerpt, source?.bodyText])].filter(Boolean).join(" ");
}
function candidateIdentity(candidate) {
  return [candidate?.title, candidate?.summary, candidate?.editorialPosition?.subject, candidate?.editorialPosition?.development].filter(Boolean).join(" ");
}

const accepted = [];
const rejected = [];
for (const candidate of batch.candidates) {
  const identity = candidateIdentity(candidate);
  const evidence = candidateEvidence(candidate);
  if (!MATCH_LIKE.test(identity)) {
    accepted.push(candidate);
    continue;
  }
  const classes = {
    date: DATE_DETAIL.test(evidence),
    score: SCORE_DETAIL.test(evidence),
    venue: VENUE_DETAIL.test(evidence),
    namedPeople: people(evidence).length > 0,
  };
  const detailClassCount = Object.values(classes).filter(Boolean).length;
  if (detailClassCount < 2) {
    rejected.push({ id: candidate.id, title: candidate.title, reason: "match-like-story-fewer-than-two-api-detail-classes", detailClassCount, classes });
  } else {
    accepted.push(candidate);
  }
}

batch.candidates = accepted;
batch.provenance = {
  ...(batch.provenance ?? {}),
  preAiMatchDetailParity: {
    accepted: accepted.length,
    rejected: rejected.length,
    rejectedIds: rejected.map((item) => item.id),
    contract: "same four detail classes as app/api/editorial/draft pre-generation gate",
  },
};
await fs.writeFile(path.resolve(batchPath), `${JSON.stringify(batch, null, 2)}\n`);
await fs.mkdir(path.dirname(path.resolve(reportPath)), { recursive: true });
await fs.writeFile(path.resolve(reportPath), `${JSON.stringify({ generatedAt: new Date().toISOString(), accepted: accepted.length, rejected }, null, 2)}\n`);
console.log(JSON.stringify({ preAiMatchDetailParity: "passed", accepted: accepted.length, rejected }, null, 2));
if (accepted.length === 0) throw new Error("Pre-AI match-detail parity removed every candidate; refusing paid generation.");
