export type SocialHashtagArticle = {
  title?: string;
  standfirst?: string;
  hashtags?: string[];
};

const TOPIC_RULES: Array<{ pattern: RegExp; tag: string }> = [
  { pattern: /\bleinster\b/i, tag: "LeinsterRugby" },
  { pattern: /\bmunster\b/i, tag: "MunsterRugby" },
  { pattern: /\bulster\b/i, tag: "UlsterRugby" },
  { pattern: /\bconnacht\b/i, tag: "ConnachtRugby" },
  { pattern: /\bireland\b|\birish rugby\b/i, tag: "IrishRugby" },
  { pattern: /\ball blacks\b|\bnew zealand\b/i, tag: "AllBlacks" },
  { pattern: /\bspringboks?\b|\bsouth africa\b/i, tag: "Springboks" },
  { pattern: /\bwallabies\b|\baustralia\b/i, tag: "Wallabies" },
  { pattern: /\bengland\b/i, tag: "EnglandRugby" },
  { pattern: /\bfrance\b/i, tag: "FranceRugby" },
  { pattern: /\bscotland\b/i, tag: "ScotlandRugby" },
  { pattern: /\bwales\b/i, tag: "WelshRugby" },
  { pattern: /\bitaly\b/i, tag: "ItalyRugby" },
  { pattern: /\bsix nations\b/i, tag: "SixNations" },
  { pattern: /\bchampions cup\b/i, tag: "ChampionsCup" },
  { pattern: /\bchallenge cup\b/i, tag: "ChallengeCup" },
  { pattern: /\burc\b|\bunited rugby championship\b/i, tag: "URC" },
  { pattern: /\brugby world cup\b|\bworld cup\b/i, tag: "RugbyWorldCup" },
  { pattern: /\bwomen(?:'s)?\b|\bwomens\b/i, tag: "WomensRugby" },
];

function clean(values: string[] | undefined) {
  return (values ?? [])
    .map((value) => value.trim().replace(/^#+/, "").replace(/[^\p{L}\p{N}_]/gu, ""))
    .filter(Boolean);
}

export function relevantSocialHashtags(article: SocialHashtagArticle, limit = 8) {
  const text = `${article.title ?? ""} ${article.standfirst ?? ""}`;
  const manual = clean(article.hashtags);
  const derived = TOPIC_RULES.filter((rule) => rule.pattern.test(text)).map((rule) => rule.tag);
  const ordered = ["TheRugbyPanda", ...manual, ...derived, "Rugby", "RugbyNews"];
  return [...new Set(ordered)].slice(0, Math.max(1, limit)).map((value) => `#${value}`);
}
