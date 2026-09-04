# 2026-09-04 Pexels acquisition run

The non-Wikimedia acquisition phase now has a deterministic Pexels importer.

Safety boundary:
- no OpenAI calls;
- Pexels images are imported only as generic/contextual rugby imagery;
- Pexels metadata is not sufficient to claim an exact named player, coach, team, match or event;
- every imported record carries Pexels source, photographer, source URL, Pexels licence URL and an explicit warning against exact-person/team/event use without separate verification;
- blocked non-rugby sports terms are rejected;
- only landscape images at least 1200x600 are accepted;
- images are localized to Sanity before use;
- existing Pexels source IDs are deduplicated;
- OpenAI usage is explicitly zero.

The production workflow runs only when both PEXELS_API_KEY and SANITY_API_TOKEN are present.