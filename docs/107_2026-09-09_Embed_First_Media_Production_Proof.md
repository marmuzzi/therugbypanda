# 9 September 2026 — Embed-first media production proof

## Decision

The Rugby Panda no longer forces a local image when the available library asset is not clearly relevant. A verified official story-specific social/video embed is the mandatory visual boundary. Local imagery is optional and must improve the article rather than merely fill space.

## Production implementation

PR #458 merged the embed-first delivery contract, exact curated embed registry, exact-embed Sanity mutation/readback, generic official-video fallback and the simplified bounded morning workflow.

PR #459 merged local-media cleanup for exact curated embeds. After the exact embed is verified, existing featured and inline local images can be removed and the resulting embed-only draft is read back before delivery.

## Production verification

Main deployment for PR #458 reached Vercel READY and the live progressive endpoint reported:

- delivery mode: progressive one-by-one;
- required media: verified official story-specific social/video embed;
- local image policy: optional only when independently relevant.

GitHub Actions run `34327661508` completed successfully on main SHA `67b56df7362dc43b65465ba675a42c4f4bf6954f`.

Measured article results:

1. `Madigan backs Wood for Munster’s physical challenge` — exact official Munster Rugby Tom Wood video applied and Sanity readback verified; individual review delivery sent.
2. `Fintan Gunne faces Leinster’s pivotal No 9 succession test` — exact official Leinster Rugby TV Fintan Gunne video applied and Sanity readback verified; individual review delivery sent.
3. `Doyle’s first Waratahs lead raises the stakes in Bungendore` — no story-specific official video verified by the automatic registry; article correctly remained blocked and was not delivered by this run.

The run reported three current articles, two media-ready articles and two accepted progressive deliveries. This proves that one blocked article no longer suppresses other ready articles.

## Budget state

The 9 September OpenAI reservation ledger reached `$0.385/$0.40` before the legacy paid-retry path was removed. No further `$0.055` production generation is allowed on the current Dublin day. Media-only recovery is free of OpenAI generation spend.

## Going-forward contract

- qualify exact official media before generation wherever possible;
- prefer exact person/event official embeds over generic team imagery;
- never use a wrong or decorative local image simply to fill a media slot;
- if an exact embed exists and the local image is doubtful, remove the local image;
- if no sufficiently relevant official embed can be verified, block that candidate and choose another before paid generation where possible;
- progressive delivery remains one article at a time;
- daily completion remains five distinct delivered articles;
- publication remains human-controlled in Sanity.
