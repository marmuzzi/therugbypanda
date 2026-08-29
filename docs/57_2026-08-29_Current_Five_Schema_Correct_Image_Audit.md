# 29 August 2026 — Current Five Schema-Correct Image Audit

## Purpose

Record a production-Sanity readback of the five current recovery drafts using the deployed article schema rather than obsolete/incorrect field assumptions, and remediate any clearly irrelevant assignment without weakening image gates.

## Schema-correct readback contract

The deployed `article` schema stores the hero at `featuredImage` and inline images as Portable Text image blocks in `body` (`body[_type == "image"]`). The deployed `editorialImage` schema stores the local Sanity asset at `image.asset` and carries lifecycle, approval, subject/team/event/date and rights/source metadata.

Therefore production audits must not use `mainImage` or a top-level `inlineImages` field. Any earlier recovery evidence inferred from those fields is superseded by this measured readback.

## Measured current-five state before remediation

Production Sanity raw/draft readback found:

| Draft | Hero state | Inline image blocks |
| --- | --- | ---: |
| Connacht — Mack Hansen return | Exact-subject local hero: Mack Hansen in Connacht action vs Benetton | 0 |
| Leinster — coaching search | **Incorrect:** Thomond Park / Munster venue hero | 0 |
| Munster — Jack Crowley injury/depth | No hero | 0 |
| Munster — La Rochelle pre-season | Contextual Thomond Park / Munster venue hero | 0 |
| Women’s Interpro final — Munster v Leinster | No hero | 0 |

The Mack Hansen asset is a local approved open-licence Sanity asset sourced from Wikimedia Commons, photographed by Stefano Delfrate, event dated 1 April 2023, CC BY-SA 2.0. Its metadata identifies Mack Hansen and the Benetton–Connacht EPCR Challenge Cup fixture.

The Leinster coaching hero was local and rights-approved but its metadata identified Thomond Park in Limerick/Munster, with William Murphy attribution and CC BY-SA 2.0. It had no defensible relevance to a Leinster coaching-succession story and therefore failed the launch rule that fewer/no images is preferable to weak substitution.

## Production remediation

The incorrect `featuredImage` was removed from `drafts.article-auto004-live-leinster-coach-search-20260827` in production Sanity. No article was published and no human publication boundary was crossed.

A post-change production readback confirmed:

- Connacht/Hansen: exact-subject hero retained;
- Leinster coaching: no hero;
- Munster/Crowley: no hero;
- Munster/La Rochelle: contextual Thomond Park hero retained pending a stronger La Rochelle/current-squad asset;
- Women’s final: no hero;
- all five: zero Portable Text inline image blocks.

The corrected measured summary is therefore **1 exact hero + 1 contextual Munster venue hero + 3 deliberately unfilled heroes; 0 inline images across the five**. Do not describe this as “2/5 strong exact/relevant heroes.”

## P0 implication

MEDIA-009 remains In Progress. MEDIA-011 remains Open. The library baseline remains 241 strict publication-ready local assets, but current-story coverage depth is insufficient for Crowley, Leinster coaching, the Women’s Interpro final and meaningful inline alternatives. The correct next media work is exact/recent targeted acquisition and rights classification, not reuse of generic province/venue filler.

The automatic selector’s fail-closed relevance safeguards remain required; this remediation changes only the affected draft assignment and does not weaken originality, Draft Ready, Publication Review, image-rights or human Sanity publication gates.
