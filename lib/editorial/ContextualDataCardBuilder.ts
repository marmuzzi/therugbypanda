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
  "Ireland", "Leinster", "Munster", "Ulster", "Connacht", "Rugby", "URC", "United Rugby",
  "Champions Cup", "Challenge Cup", "Six Nations", "World Cup", "Global Series", "Academy",
]);

function articleText(article: GeneratedArticleDraft) {
  return [
    article.title,
    article.standfirst,
    ...article.body.flatMap((section) => [section.heading ?? "", ...section.paragraphs]),
  ].filter(Boolean).join(" ");
}

function properNameCandidates(text: string) {
  const matches = text.match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,2}\b/g) ?? [];
  return [...new Set(matches.map((value) => value.trim()))]
    .filter((value) => !NON_PERSON_TERMS.has(value))
    .filter((value) => value.split(/\s+/).every((part) => !NON_PERSON_TERMS.has(part)));
}

function normalized(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9à-öø-ÿ]+/g, " ").trim();
}

function choosePrimarySubject(article: GeneratedArticleDraft, facts: FactLike[]) {
  const text = articleText(article);
  const titleText = `${article.title} ${article.standfirst}`.toLowerCase();
  const factText = facts.map((fact) => fact.claim).join(" ");
  const candidates = properNameCandidates(`${article.title} ${article.standfirst} ${factText}`);

  const ranked = candidates.map((candidate) => {
    const terms = normalized(candidate).split(" ").filter(Boolean);
    const surname = terms.at(-1) ?? "";
    const titleMatch = titleText.includes(candidate.toLowerCase()) || (surname.length >= 5 && titleText.includes(surname));
    const articleMentions = normalized(text).split(normalized(candidate)).length - 1;
    const factMentions = facts.filter((fact) => normalized(fact.claim).includes(normalized(candidate)) || (surname.length >= 5 && normalized(fact.claim).includes(surname))).length;
    return { candidate, score: (titleMatch ? 30 : 0) + articleMentions * 3 + factMentions * 8, factMentions };
  }).filter((item) => item.factMentions > 0).sort((a, b) => b.score - a.score);

  return ranked[0]?.candidate;
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
  return "Key fact";
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

export function buildContextualDataCard(article: GeneratedArticleDraft, editorial: EditorialLike): ContextualDataCard | null {
  const facts = (editorial.factLedger?.facts ?? []).filter((fact) =>
    fact.usableInDraft !== false
    && ["confirmed", "strongly-reported"].includes(fact.status ?? "confirmed")
    && (fact.confidence ?? 100) >= 70
    && fact.claim?.trim().length >= 18
    && (fact.sourceIds?.length ?? 0) > 0,
  );
  if (facts.length < 2) return null;

  const subject = choosePrimarySubject(article, facts);
  const subjectNorm = subject ? normalized(subject) : "";
  const surname = subjectNorm.split(" ").at(-1) ?? "";
  const relevantFacts = facts
    .map((fact) => {
      const claimNorm = normalized(fact.claim);
      const subjectMatch = subject
        ? claimNorm.includes(subjectNorm) || (surname.length >= 5 && claimNorm.includes(surname))
        : true;
      const specificity = /\d|injur|surgery|academy|squad|captain|signed|contract|fixture|scored|appearances?|caps?|position|return|selected|training/i.test(fact.claim) ? 10 : 0;
      return { fact, score: (subjectMatch ? 30 : 0) + specificity + Math.min(10, Math.floor((fact.confidence ?? 100) / 10)) };
    })
    .filter((item) => !subject || item.score >= 30)
    .sort((a, b) => b.score - a.score);

  const rows: ContextualDataCard["rows"] = [];
  const seenClaims = new Set<string>();
  const usedLabels = new Map<string, number>();
  for (const { fact } of relevantFacts) {
    const key = normalized(fact.claim);
    if (!key || seenClaims.has(key)) continue;
    seenClaims.add(key);
    const baseLabel = rowLabel(fact.claim);
    const count = usedLabels.get(baseLabel) ?? 0;
    usedLabels.set(baseLabel, count + 1);
    rows.push({
      label: count === 0 ? baseLabel : `${baseLabel} ${count + 1}`,
      value: conciseClaim(fact.claim, subject),
      sourceIds: [...new Set(fact.sourceIds ?? [])],
    });
    if (rows.length >= 4) break;
  }

  if (rows.length < 2) return null;
  return {
    kind: subject ? "player" : "team",
    title: subject ?? editorial.category,
    subtitle: subject ? editorial.category : undefined,
    rows,
  };
}
