const RUGBY_SIGNALS = /\b(rugby|union|irfu|urc|united rugby championship|six nations|champions cup|challenge cup|epcr|leinster|munster|ulster|connacht|test match|test series|wxv|scrum|lineout|try|conversion|prop|hooker|lock|flanker|back[- ]?row|centre|winger|full[- ]?back|squad|captain|coach)\b/i;
const EXPLICIT_NON_RUGBY_TITLE = /\b(soccer|football association|fai cup|league of ireland|shelbourne|bohemians|shamrock rovers|premier league|champions league|gaa|gaelic football|hurling|camogie|boxing|golf|cycling|athletics|formula one|f1|motorbike|superbike|snooker)\b/i;

/**
 * Deterministic qualification for targeted Irish discovery.
 *
 * Story identity is taken from the title. Explicit non-rugby identity in the
 * title is fatal. Rugby relevance may be established by the title or summary;
 * the summary is deliberately NOT used for sport exclusion because legitimate
 * rugby features often mention other Irish sports for context.
 */
export function isIrishRugbyDiscoveryLead(item = {}) {
  const title = String(item.title || "").trim();
  const description = String(item.description || "").trim();
  if (!title) return false;
  if (EXPLICIT_NON_RUGBY_TITLE.test(title)) return false;
  return RUGBY_SIGNALS.test(`${title} ${description}`);
}

export const irishDiscoveryQualificationPatterns = Object.freeze({
  rugbySignals: RUGBY_SIGNALS,
  explicitNonRugbyTitle: EXPLICIT_NON_RUGBY_TITLE,
});
