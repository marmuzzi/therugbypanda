# Source Registry and Owner Article Requests — 28 August 2026

## Owner direction

The owner approved three permanent newsroom capabilities:

1. every newly generated article should trigger targeted acquisition so at least three strong rights-clean image candidates are available where possible, without forcing weak images into the article;
2. the owner needs a Sanity-native place to request an additional article in natural language, with the system researching the internet and sending the result through the normal editorial gates;
3. source selection must become transparent and configurable, with an editable source registry rather than an opaque or static source list.

## SOURCE-001 — source registry foundation

Implemented in this change:

- `data/editorial-sources/source-registry.json` establishes the first versioned source catalogue and policy baseline;
- `lib/editorial/EditorialSourceRegistry.ts` provides domain lookup and relevance/authority/owner-priority ranking helpers;
- `editorialSource` Sanity schema provides editable source policy fields: active state, authority tier, owner priority, evidence role, discovery/evidence permissions, rumour policy, specialisms, teams, competitions, regions and notes;
- Sanity configuration registers `editorialSource`, making it available in the Studio document lists.

Initial primary/authoritative sources include Ireland Rugby/IRFU, Leinster Rugby, Munster Rugby, Ulster Rugby, Connacht Rugby, RFU/England Rugby, URC, EPCR and Six Nations Rugby.

Initial Irish/trusted editorial layer includes The42 Rugby, The Irish Times, Irish Independent, Irish Examiner, Business Post Sport, RTÉ Sport, BBC Sport Northern Ireland, TG4 Spórt, Virgin Media Sport, RugbyPass Ireland, Planet Rugby and Off The Ball/OTB Sports. Reuters, BBC Sport and Rugbyrama are retained as useful international/corroboration/context sources.

Editorial policy separates discovery from evidence. Official facts should preferentially resolve to primary/authoritative sources. Supplementary/rumour-led discovery must not be promoted to fact without corroboration.

### Verification boundary

This change creates the registry model and ranking foundation. The normal autonomous morning acquisition path still needs to query the registry dynamically and production-prove that source priority/specialism affects real candidate discovery. Do not mark SOURCE-001 closed until that production evidence exists.

## EDIT-006 — owner article request foundation

Implemented in this change:

- `articleRequest` Sanity schema;
- natural-language request field;
- optional category hint, priority and needed-by fields;
- default behaviour is **additional article**, not replacement of one of the daily five;
- optional `eligible-morning-slot` mode;
- explicit workflow states: requested → researching → evidence-ready → generating → review-ready / failed;
- generated article reference and failure evidence fields.

Sanity configuration registers `articleRequest`, so the owner has a dedicated document type to enter requests.

### Verification boundary

The request document/UI foundation is implemented, but the research/generation worker that claims a queued request, searches current sources, creates a multi-source evidence pack, runs normal Draft Ready/originality/Publication Review gates, triggers relevant image acquisition and returns a review-ready draft is still to be wired. Human publication approval remains mandatory.

## MEDIA-011 — article-triggered image acquisition design

Approved contract:

- when an editorial position becomes a real article draft, query the approved local Sanity library first;
- target at least **three strong candidate images** relevant to the article, not three forced placements;
- if fewer than three candidates pass, trigger precision acquisition for exact people/teams/events/venues discussed by the article;
- certify rights, dimensions, metadata, relevance and dedupe before local Sanity import;
- rerun assignment after import;
- article rendering may still use fewer images when editorial relevance does not justify more;
- never weaken named-person/team/event conflict safeguards or use filler to meet the candidate target.

The existing workflow already supports up to three inline images and fail-closed no-image behaviour. A post-draft acquisition trigger still needs to be implemented and production-proven.

## Completion status

- SOURCE-001: **Implemented / committed on feature branch; not yet merged/deployed/production-verified**.
- EDIT-006: **Schema/UI foundation implemented / committed; generation worker not yet complete**.
- MEDIA-011: **Approved design; trigger implementation pending**.

This document must be updated after PR merge/deployment and after the first real source-registry-driven acquisition, owner-requested article, and article-triggered image acquisition are production verified.
