const strongPositiveTerms = [
  "rugby",
  "rugby union",
  "rugby sevens",
  "rugby ball",
  "rugby pitch",
  "rugby posts",
  "goal posts",
  "goalposts",
  "scrum",
  "ruck",
  "maul",
  "lineout",
  "try",
  "conversion",
  "referee",
  "touch judge",
  "gilbert rugby",
  "world rugby",
  "six nations",
  "united rugby championship",
  "aviva stadium",
  "millennium stadium",
];

const moderatePositiveTerms = [
  "ball",
  "posts",
  "pitch",
  "stadium",
  "supporters",
  "fans",
  "match",
  "training",
  "tackle",
  "boots",
  "kicking tee",
  "tackle bag",
  "hit shield",
  "scrum machine",
  "mouthguard",
];

const negativeTerms = [
  { term: "shimano", penalty: 80 },
  { term: "cycling", penalty: 70 },
  { term: "cycle", penalty: 60 },
  { term: "bicycle", penalty: 70 },
  { term: "mtb", penalty: 70 },
  { term: "sniper", penalty: 100 },
  { term: "rifle", penalty: 100 },
  { term: "firearm", penalty: 100 },
  { term: "gun", penalty: 90 },
  { term: "military", penalty: 90 },
  { term: "army", penalty: 80 },
  { term: "soldier", penalty: 80 },
  { term: "swimming", penalty: 80 },
  { term: "swimmer", penalty: 80 },
  { term: "pool", penalty: 60 },
  { term: "railway", penalty: 70 },
  { term: "railroad", penalty: 70 },
  { term: "train", penalty: 65 },
  { term: "locomotive", penalty: 75 },
  { term: "soccer", penalty: 45 },
  { term: "footballpitch", penalty: 35 },
  { term: "baseball", penalty: 80 },
  { term: "cricket", penalty: 60 },
  { term: "nfl", penalty: 70 },
  { term: "american football", penalty: 70 },
];

function textFor(candidate) {
  return [
    candidate.title,
    candidate.description,
    candidate.acquisitionQuery,
    candidate.provider,
    ...(candidate.tags ?? []),
    ...(candidate.searchKeywords ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function titleFor(candidate) {
  return (candidate.title ?? "").toLowerCase();
}

function countMatches(text, terms) {
  return terms.filter((term) => text.includes(term)).length;
}

export function scoreRugbyRelevance(candidate) {
  const text = textFor(candidate);
  const title = titleFor(candidate);
  let score = 0;
  const reasons = [];

  if (title.includes("rugby")) {
    score += 35;
    reasons.push("title contains rugby");
  }

  if ((candidate.description ?? "").toLowerCase().includes("rugby")) {
    score += 25;
    reasons.push("description contains rugby");
  }

  const tagText = (candidate.tags ?? []).join(" ").toLowerCase();
  if (tagText.includes("rugby")) {
    score += 20;
    reasons.push("tags contain rugby");
  }

  const strongMatches = countMatches(text, strongPositiveTerms);
  const moderateMatches = countMatches(text, moderatePositiveTerms);
  score += strongMatches * 15;
  score += moderateMatches * 6;

  if (strongMatches) reasons.push(`${strongMatches} strong rugby signal(s)`);
  if (moderateMatches) reasons.push(`${moderateMatches} supporting rugby signal(s)`);

  for (const { term, penalty } of negativeTerms) {
    if (text.includes(term)) {
      score -= penalty;
      reasons.push(`negative signal: ${term}`);
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    rugbyRelevanceScore: score,
    rugbyRelevanceBand: score >= 70 ? "Candidate" : score >= 40 ? "Manual Review" : "Rejected",
    rugbyRelevanceNotes: reasons.join("; ") || "No strong rugby relevance signals detected",
  };
}

export function filterByRugbyRelevance(candidates, minimumScore = 70) {
  const accepted = [];
  const rejected = [];

  for (const candidate of candidates) {
    const relevance = scoreRugbyRelevance(candidate);
    const enriched = {
      ...candidate,
      ...relevance,
      validationNotes: [candidate.validationNotes, relevance.rugbyRelevanceNotes].filter(Boolean).join(" "),
    };

    if (relevance.rugbyRelevanceScore >= minimumScore) {
      accepted.push(enriched);
    } else {
      rejected.push({
        ...enriched,
        rejectionReason: `Rejected rugby relevance score: ${relevance.rugbyRelevanceScore}`,
      });
    }
  }

  return { accepted, rejected };
}
