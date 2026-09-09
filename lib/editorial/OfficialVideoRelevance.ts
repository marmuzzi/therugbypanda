const GENERIC = new Set([
  "rugby", "team", "teams", "news", "latest", "official", "video", "videos", "match", "game",
  "season", "preview", "review", "highlights", "highlights", "training", "club", "player", "players",
  "coach", "coaches", "today", "tomorrow", "yesterday", "against", "with", "from", "into", "after",
  "before", "their", "this", "that", "what", "when", "where", "will", "have", "has", "more",
]);

const TEAM_ALIASES: Record<string, string[]> = {
  ireland: ["ireland", "irish", "irfu"],
  leinster: ["leinster"],
  munster: ["munster"],
  ulster: ["ulster"],
  connacht: ["connacht"],
  "south africa": ["south africa", "springboks", "boks"],
  "new zealand": ["new zealand", "all blacks"],
  england: ["england"],
  scotland: ["scotland"],
  wales: ["wales"],
  france: ["france"],
  italy: ["italy"],
  australia: ["australia", "wallabies"],
  argentina: ["argentina", "pumas"],
};

function clean(value = "") {
  return String(value ?? "").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
}

function normalise(value = "") {
  return clean(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9' -]+/g, " ").replace(/\s+/g, " ").trim();
}

export function namedPeople(value = "") {
  const matches = clean(value).match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]{2,}(?:\s+(?:van|de|der|von|di|da))?\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]{2,}\b/g) ?? [];
  return [...new Set(matches.filter((name) => {
    const lower = normalise(name);
    if (/^(?:united rugby|six nations|world rugby|irish rugby|leinster rugby|munster rugby|ulster rugby|connacht rugby|south africa|new zealand|all blacks)$/i.test(name)) return false;
    return lower.split(" ").length >= 2;
  }))];
}

export function specificTokens(value = "") {
  return [...new Set(normalise(value).split(/\s+/).filter((token) => token.length >= 4 && !GENERIC.has(token) && !/^\d+$/.test(token)))];
}

export function recognisedTeams(value = "") {
  const lower = normalise(value);
  return Object.entries(TEAM_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => lower.includes(alias)))
    .map(([team]) => team);
}

export type OfficialVideoCandidate = {
  title: string;
  publishedAt?: string;
  sourceLabel?: string;
};

export type StoryMediaContext = {
  title?: string;
  standfirst?: string;
  editorialAngle?: string;
  sourceStoryTitle?: string;
};

export function scoreOfficialVideo(story: StoryMediaContext, candidate: OfficialVideoCandidate) {
  const storyText = [story.title, story.standfirst, story.editorialAngle, story.sourceStoryTitle].filter(Boolean).join(" ");
  const videoText = candidate.title ?? "";
  const storyLower = normalise(storyText);
  const videoLower = normalise(videoText);
  const people = namedPeople(storyText);
  const exactPeople = people.filter((person) => videoLower.includes(normalise(person)));
  const surnameHits = people.filter((person) => {
    const surname = normalise(person).split(" ").at(-1) ?? "";
    return surname.length >= 4 && videoLower.includes(surname);
  });
  const storyTeams = recognisedTeams(storyText);
  const videoTeams = recognisedTeams(videoText);
  const teamOverlap = storyTeams.filter((team) => videoTeams.includes(team));
  const teamConflict = videoTeams.some((team) => storyTeams.length > 0 && !storyTeams.includes(team));
  const sharedSpecific = specificTokens(storyText).filter((token) => videoLower.includes(token));

  // A generic same-team clip is never enough. Named-person stories require the person/surname,
  // otherwise we require at least two specific event/opponent/development tokens.
  if (people.length > 0 && exactPeople.length === 0 && surnameHits.length === 0) {
    return { passed: false, score: 0, reason: "named-person-not-present", exactPeople, surnameHits, sharedSpecific, teamOverlap };
  }
  if (teamConflict && exactPeople.length === 0 && surnameHits.length === 0) {
    return { passed: false, score: 0, reason: "team-conflict", exactPeople, surnameHits, sharedSpecific, teamOverlap };
  }
  const specificEnough = exactPeople.length > 0 || surnameHits.length > 0 || sharedSpecific.length >= 2;
  if (!specificEnough) {
    return { passed: false, score: 0, reason: "generic-same-team-media", exactPeople, surnameHits, sharedSpecific, teamOverlap };
  }
  const score = exactPeople.length * 100 + surnameHits.length * 60 + sharedSpecific.length * 12 + teamOverlap.length * 8;
  return { passed: score >= 24, score, reason: score >= 24 ? "relevant" : "below-threshold", exactPeople, surnameHits, sharedSpecific, teamOverlap };
}
