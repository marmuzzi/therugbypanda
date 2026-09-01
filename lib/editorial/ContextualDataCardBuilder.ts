import type { ContextualDataCard, GeneratedArticleDraft } from "./ArticleDraftTypes";

type FactLike = {
  claim: string;
  status?: string;
  confidence?: number;
  sourceIds?: string[];
  usableInDraft?: boolean;
};

type EditorialLike = {
  category: string;
  storyType: string;
  factLedger?: { facts?: FactLike[] };
};

const NON_PERSON_TERMS = new Set([
  "Ireland", "Ireland Women", "Leinster", "Munster", "Ulster", "Connacht", "Rugby", "URC", "United Rugby",
  "Champions Cup", "Challenge Cup", "Six Nations", "World Cup", "Global Series", "Academy",
  "All Blacks", "New Zealand", "Springboks", "South Africa", "Wallabies", "Australia", "England", "Scotland",
  "Wales", "France", "Italy", "Argentina", "Pumas", "Fiji", "Japan", "Samoa", "Tonga",
]);
const LEADING_CONTEXT_WORDS = /^(?:With|After|Before|While|As|For|From|By|Against|At|On|The)\s+/i;
const SURNAME_PARTICLE_ONLY = /^(?:van|de|der|von|di|da)\b/i;

function articleText(article: GeneratedArticleDraft) {
  return [article.title, article.standfirst, ...article.body.flatMap((section) => [section.heading ?? "", ...section.paragraphs])]
    .filter(Boolean).join(" ");
}

function properNameCandidates(text: string) {
  const matches = text.match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]+(?:\s+(?:(?:van|de|der|von|di|da)\s+)?[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]+){1,2}\b/g) ?? [];
  return [...new Set(matches.map((value) => value.trim().replace(LEADING_CONTEXT_WORDS, "")))]
    .filter((value) => value.split(/\s+/).length >= 2)
    .filter((value) => !NON_PERSON_TERMS.has(value))
    .filter((value) => value.split(/\s+/).filter((part) => !/^(?:van|de|der|von|di|da)$/i.test(part)).every((part) => !NON_PERSON_TERMS.has(part)));
}

function normalized(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9à-öø-ÿ]+/g, " ").trim();
}

function canonicalCandidate(candidate: string, corpus: string) {
  const clean = candidate.trim().replace(LEADING_CONTEXT_WORDS, "");
  const surname = clean.split(/\s+/).at(-1) ?? "";
  if (surname.length < 5) return clean;
  const fuller = properNameCandidates(corpus)
    .filter((value) => (normalized(value).split(" ").at(-1) ?? "") === normalized(surname))
    .sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length || b.length - a.length)[0];
  return fuller ?? clean;
}

function choosePrimarySubject(article: GeneratedArticleDraft, facts: FactLike[]) {
  const text = articleText(article);
  const titleText = `${article.title} ${article.standfirst}`.toLowerCase();
  const factText = facts.map((fact) => fact.claim).join(" ");
  const corpus = `${article.title} ${article.standfirst} ${factText}`;
  const candidates = [...new Set(properNameCandidates(corpus).map((candidate) => canonicalCandidate(candidate, corpus)))];
  const ranked = candidates.map((candidate) => {
    const terms = normalized(candidate).split(" ").filter(Boolean);
    const surname = terms.at(-1) ?? "";
    const titleMatch = titleText.includes(candidate.toLowerCase()) || (surname.length >= 5 && titleText.includes(surname));
    const articleMentions = normalized(text).split(normalized(candidate)).length - 1;
    const factMentions = facts.filter((fact) => normalized(fact.claim).includes(normalized(candidate)) || (surname.length >= 5 && normalized(fact.claim).includes(surname))).length;
    return { candidate, score: 30 + articleMentions * 3 + factMentions * 8 + terms.length * 3, factMentions, titleMatch };
  }).filter((item) => item.titleMatch && item.factMentions > 0).sort((a, b) => b.score - a.score);
  const subject = ranked[0]?.candidate;
  if (!subject || SURNAME_PARTICLE_ONLY.test(subject)) return undefined;
  return subject;
}

function rowLabel(claim: string) {
  const lower = claim.toLowerCase();
  if (/injur|surgery|rehab|return|available|sidelined|fitness/.test(lower)) return "Status";
  if (/appearances?|caps?|starts?|points?|tries?|record|wins?|five-in-five|scored/.test(lower)) return "Record";
  if (/position|fly-half|out-half|prop|lock|back row|hooker|scrum-half|centre|wing|full-back/.test(lower)) return "Role";
  if (/academy|u20|under-20|graduate|year 1/.test(lower)) return "Pathway";
  if (/fixture|friendly|play|face|against|date|september|august|round/.test(lower)) return "Next up";
  if (/signed|contract|joined|arrives?|leaves?|returned|transfer/.test(lower)) return "Club move";
  if (/captain|leader|lineout|organiser|leadership/.test(lower)) return "Leadership";
  if (/squad|selected|selection|training|called up|named/.test(lower)) return "Selection";
  return "In focus";
}

function conciseClaim(claim: string, subject?: string) {
  let value = claim.trim().replace(/\s+/g, " ");
  if (subject) {
    const escaped = subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    value = value.replace(new RegExp(`^${escaped}(?:'s|’s)?\\s+(?:is|has|was|were|will|can|could|may|joined|returned|made|scored|starts?|plays?|remains?)?\\s*`, "i"), "");
  }
  value = value.replace(/^[-–—,:;\s]+/, "");
  if (value.length > 180) {
    const clipped = value.slice(0, 177);
    const boundary = Math.max(clipped.lastIndexOf(". "), clipped.lastIndexOf("; "), clipped.lastIndexOf(", "));
    value = `${clipped.slice(0, boundary > 95 ? boundary : 177).replace(/[,:;\s]+$/, "")}…`;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function rankedFacts(facts: FactLike[], subject?: string) {
  const subjectNorm = subject ? normalized(subject) : "";
  const surname = subjectNorm.split(" ").at(-1) ?? "";
  return facts.map((fact) => {
    const claimNorm = normalized(fact.claim);
    const subjectMatch = subject ? claimNorm.includes(subjectNorm) || (surname.length >= 5 && claimNorm.includes(surname)) : true;
    const specificity = /\d|injur|surgery|academy|squad|captain|signed|contract|fixture|scored|appearances?|caps?|position|return|selected|training/i.test(fact.claim) ? 10 : 0;
    return { fact, subjectMatch, score: (subjectMatch ? 30 : 0) + specificity + Math.min(10, Math.floor((fact.confidence ?? 100) / 10)) };
  }).filter((item) => !subject || item.subjectMatch).sort((a, b) => b.score - a.score);
}

function buildRows(facts: Array<{ fact: FactLike }>, subject?: string): ContextualDataCard["rows"] {
  const rows: ContextualDataCard["rows"] = [];
  const seenClaims = new Set<string>();
  const usedLabels = new Set<string>();
  for (const { fact } of facts) {
    const key = normalized(fact.claim);
    if (!key || seenClaims.has(key)) continue;
    const label = rowLabel(fact.claim);
    // A card should scan like an editor-built fact box. Never emit synthetic labels
    // such as "Key fact 2" or "Next up 2" merely to fill four rows.
    if (usedLabels.has(label)) continue;
    const value = conciseClaim(fact.claim, subject);
    if (!value || rows.some((row) => normalized(row.value) === normalized(value))) continue;
    seenClaims.add(key);
    usedLabels.add(label);
    rows.push({ label, value, sourceIds: [...new Set(fact.sourceIds ?? [])] });
    if (rows.length >= 4) break;
  }
  return rows;
}

export function buildContextualDataCard(article: GeneratedArticleDraft, editorial: EditorialLike): ContextualDataCard | null {
  const facts = (editorial.factLedger?.facts ?? []).filter((fact) => fact.usableInDraft !== false
    && ["confirmed", "strongly-reported"].includes(fact.status ?? "confirmed")
    && (fact.confidence ?? 100) >= 70 && fact.claim?.trim().length >= 18 && (fact.sourceIds?.length ?? 0) > 0);
  if (facts.length < 2) return null;

  const subject = choosePrimarySubject(article, facts);
  if (subject) {
    const subjectRows = buildRows(rankedFacts(facts, subject), subject);
    if (subjectRows.length >= 2) return { kind: "player", title: subject, subtitle: editorial.category, rows: subjectRows };
  }
  const teamRows = buildRows(rankedFacts(facts));
  if (teamRows.length < 2) return null;
  return { kind: "team", title: editorial.category, rows: teamRows };
}
