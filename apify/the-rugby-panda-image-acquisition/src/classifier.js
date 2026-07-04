const categoryRules = [
  { category: "Equipment", types: ["rugby ball"], terms: ["ball", "boot", "boots", "equipment", "cone", "cones"] },
  { category: "Training", types: ["training"], terms: ["training", "practice", "drill", "cones"] },
  { category: "Officials", types: ["referee"], terms: ["referee", "official", "whistle"] },
  { category: "Rugby Culture", types: ["crowd", "supporter culture"], terms: ["supporter", "supporters", "crowd", "fans", "pub"] },
  { category: "Evergreen", types: ["stadium", "goalposts"], terms: ["stadium", "pitch", "posts", "goalposts", "field"] },
  { category: "Women's Rugby", types: ["action"], terms: ["women", "women's", "female"] },
  { category: "Grassroots", types: ["action"], terms: ["grassroots", "amateur", "club"] },
  { category: "International", types: ["stadium", "crowd"], terms: ["international", "ireland", "six nations", "aviva"] },
];

function textFor(candidate) {
  return [candidate.title, candidate.description, candidate.acquisitionQuery, ...(candidate.tags ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function classifyCandidate(candidate) {
  const text = textFor(candidate);
  const match = categoryRules.find((rule) => rule.terms.some((term) => text.includes(term)));
  const editorialCategory = match?.category ?? "Evergreen";
  const photoType = match?.types ?? ["action"];
  const orientation = candidate.width && candidate.height
    ? candidate.width > candidate.height ? "landscape" : candidate.width < candidate.height ? "portrait" : "square"
    : undefined;

  let editorialRating = 3;
  if (["stadium", "pitch", "supporter", "crowd", "ball"].some((term) => text.includes(term))) editorialRating = 4;
  if (["thumbnail", "icon", "logo"].some((term) => text.includes(term))) editorialRating = 2;

  return {
    ...candidate,
    editorialCategory,
    photoType,
    orientation,
    editorialRating,
    editorialValue: editorialCategory === "International" ? "Seasonal" : "Evergreen",
    suggestedUse: editorialRating >= 4 ? ["article header", "homepage card", "evergreen fallback"] : ["gallery", "archive only"],
    searchKeywords: Array.from(new Set([candidate.acquisitionQuery, editorialCategory, ...photoType, ...(candidate.tags ?? [])].filter(Boolean))),
  };
}
