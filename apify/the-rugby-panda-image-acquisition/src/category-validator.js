const rules = [
  {
    id: "rugby boots",
    matchQueries: ["rugby boots"],
    requiredAny: ["rugby", "boot", "boots", "cleats", "studs", "gilbert", "canterbury", "mizuno", "adidas", "kakari", "predator"],
    rejectAny: ["shimano", "cycling", "cycle", "bicycle", "mtb", "spd", "road shoe", "clipless"],
  },
  {
    id: "rugby supporters",
    matchQueries: ["rugby supporters"],
    requiredAny: ["rugby", "supporter", "supporters", "fans", "crowd", "six nations", "world cup"],
    rejectAny: ["fc osaka", "ardija", "gainare", "j.league", "soccer", "football club"],
  },
  {
    id: "rugby referee",
    matchQueries: ["rugby referee"],
    requiredAny: ["rugby", "referee", "official", "six nations", "world rugby", "urc", "united rugby championship"],
    rejectAny: ["j.league", "soccer", "football referee", "assistant referee at hanazono rugby stadium j.league"],
  },
  {
    id: "rugby pitch and stadium",
    matchQueries: ["rugby pitch", "empty rugby stadium", "rugby goal posts"],
    requiredAny: ["rugby", "goal posts", "goalposts", "posts", "pitch", "stadium", "scrum", "lineout"],
    rejectAny: ["railway", "railroad", "train", "locomotive", "football only", "soccer only"],
  },
  {
    id: "rugby training equipment",
    matchQueries: ["rugby training equipment"],
    requiredAny: ["rugby", "scrum", "training", "tackle", "hit shield", "scrum machine", "cones", "equipment"],
    rejectAny: ["sniper", "rifle", "gun", "firearm", "military", "army", "swimming", "pool", "water sports"],
  },
  {
    id: "rugby ball grass",
    matchQueries: ["rugby ball grass"],
    requiredAny: ["rugby", "rugby ball", "gilbert", "ball", "grass"],
    rejectAny: ["soccer ball", "football ball", "baseball", "cricket"],
  },
];

function textFor(candidate) {
  return [
    candidate.title,
    candidate.description,
    candidate.acquisitionQuery,
    ...(candidate.tags ?? []),
    ...(candidate.searchKeywords ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function ruleFor(candidate) {
  const query = (candidate.acquisitionQuery ?? "").toLowerCase();
  return rules.find((rule) => rule.matchQueries.some((match) => query.includes(match)));
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

export function validateCategoryIntent(candidate) {
  const rule = ruleFor(candidate);

  if (!rule) {
    return {
      categoryIntentPassed: true,
      categoryIntentRule: "default",
      categoryIntentNotes: "No category-specific rule matched; global rugby relevance applies.",
    };
  }

  const text = textFor(candidate);
  const rejected = containsAny(text, rule.rejectAny);
  const required = containsAny(text, rule.requiredAny);

  if (rejected) {
    return {
      categoryIntentPassed: false,
      categoryIntentRule: rule.id,
      categoryIntentNotes: `Rejected by ${rule.id} category rule: negative term matched.`,
    };
  }

  if (!required) {
    return {
      categoryIntentPassed: false,
      categoryIntentRule: rule.id,
      categoryIntentNotes: `Rejected by ${rule.id} category rule: no required rugby-specific term matched.`,
    };
  }

  return {
    categoryIntentPassed: true,
    categoryIntentRule: rule.id,
    categoryIntentNotes: `Passed ${rule.id} category rule.`,
  };
}

export function filterByCategoryIntent(candidates) {
  const accepted = [];
  const rejected = [];

  for (const candidate of candidates) {
    const result = validateCategoryIntent(candidate);
    const enriched = {
      ...candidate,
      ...result,
      validationNotes: [candidate.validationNotes, result.categoryIntentNotes].filter(Boolean).join(" "),
    };

    if (result.categoryIntentPassed) {
      accepted.push(enriched);
    } else {
      rejected.push({
        ...enriched,
        rejectionReason: result.categoryIntentNotes,
      });
    }
  }

  return { accepted, rejected };
}
