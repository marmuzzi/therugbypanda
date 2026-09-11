const PERSON_NAME_PATTERN = /\b(?:(?:Sir|Dame)\s+)?[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}(?:\s+(?:van|de|der|von|di|da))?\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}\b/g;

const NON_PERSON_NAMES = new Set([
  "irish independent", "planet rugby", "united rugby", "rugby football", "world rugby", "the rugby",
  "new zealand", "south africa", "red roses", "the irish times", "irish times", "business post",
  "irish rugby", "rugby pass", "rugbypass ireland", "football union", "united rugby championship",
  "connacht rugby", "munster rugby", "leinster rugby", "ulster rugby", "england rugby", "wxv global",
  "wxv global series", "global series", "wallaroos global", "western force", "force force",
  "roster confirmed", "wxv match", "wxv series", "two-time olympic",
]);

const GENERIC_PERSON_PARTS = new Set([
  "rugby", "fixture", "fixtures", "news", "world", "nations", "championship", "live", "union",
  "super", "first", "captain", "team", "teams", "table", "tables", "results", "result", "sport",
  "sports", "returning", "former", "current", "latest", "irish", "ireland", "times", "independent",
  "examiner", "mirror", "bbc", "rte", "connacht", "munster", "leinster", "ulster", "england",
  "scotland", "wales", "france", "australia", "brumbies", "waratahs", "chiefs", "global", "series",
  "wxv", "wallaroos", "western", "force", "roster", "confirmed", "match", "matches", "olympic",
  "canada", "fiji", "for",
]);

function normalise(value: string) {
  return String(value ?? "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function extractPersonNames(value: string) {
  const matches = String(value ?? "").match(PERSON_NAME_PATTERN) ?? [];
  return [...new Set(matches.map((name) => name.replace(/[’']/g, "'").replace(/\s+/g, " ").trim()).filter((name) => {
    const normalised = normalise(name);
    if (NON_PERSON_NAMES.has(normalised)) return false;
    const parts = normalised.split(/\s+/).filter(Boolean);
    if (parts.length < 2) return false;
    if (["sir", "dame"].includes(parts[0])) parts.shift();
    return parts.length >= 2 && !parts.some((part) => GENERIC_PERSON_PARTS.has(part));
  }))];
}

export function namedPeopleSet(value: string) {
  return new Set(extractPersonNames(value).map((name) => name.toLowerCase()));
}
