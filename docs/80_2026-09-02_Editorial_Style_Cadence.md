# 2 September 2026 — Editorial style cadence hardening

## Scope

This note records PR #360, a launch-quality follow-up to owner review of the 1 September exact-five package. The copy was considered acceptable, but repeated subheading/visual-break cadence made different articles feel more templated than intended.

## Change

The existing one-each five-profile allocation remains unchanged. PR #360 makes the structural intent materially more distinct at generation time:

- `news-desk`: defaults to no subheading and permits at most one only when scanning genuinely requires it;
- `analysis-led`: normally uses exactly two story-specific analytical movements, with a third only for a genuinely separate supported argument;
- `feature-led`: prefers continuous narrative with no subheading and uses a heading only for a real narrative turn;
- `notebook`: deliberately becomes the most sectional profile, normally using three short characterful headings with varied syntax;
- `explainer`: uses two or three useful sections, permits at most one direct-question heading and avoids an FAQ-like repeated pattern.

All five profiles continue to forbid Markdown/bold markers. Generic-heading safeguards, evidence requirements, originality, Draft Ready, Publication Review, exact-five package identity and human Sanity publication are unchanged.

## Cost and safety

The accepted 1 September package is not regenerated or resent to exercise this change. No model call is required for implementation verification. Behavioural verification belongs to the next normal five-story generation so the owner can judge the profiles side by side on genuinely new material.

## Verification boundary

PR #360 is implementation/build verifiable immediately. It is not editorially production-verified until a subsequent normal package demonstrates visibly differentiated heading cadence while still passing all existing editorial gates.
