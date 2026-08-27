# 27 August 2026 Go-Live Recovery

Owner production evidence on 27 August overrides the earlier launch-night assumptions.

## Confirmed production defects

- The 07:08 consolidated email described five new articles but presented the same five stories as the previous day. Fresh daily package acceptance is therefore not production-proven and must fail closed on stale package reuse.
- Authenticated phone review showed the Stored formatted preview remained low contrast. Root cause in `DraftEditor.tsx`: the preview forced a white background but inherited Sanity dark-theme foreground text for normal paragraphs/headings/lists, while only `strong` explicitly forced dark text. The first #278 fix addressed the outer layout/theme but not this nested preview surface.
- Owner review of the Henderson story still showed an unrelated image and only one visible image. MEDIA-009 remains open at the final editor-facing assignment/presentation boundary regardless of library counts or prior Sanity backfill evidence.
- SOCIAL-001 remains blocked by missing production downstream social webhook/orchestrator configuration; no Meta provider delivery has been proven.

## Recovery acceptance

Do not call go-live green until the owner-visible production outcome proves: a genuinely fresh five-story package; Publication Review/Draft Ready/originality/style gates on those exact five; relevant image assignments read back and visible; readable authenticated mobile Editorial Review; and controlled Facebook/Instagram delivery or an explicitly accepted launch exception.

## Current change

This recovery branch fixes the nested Stored formatted preview by making its light surface explicitly use high-contrast dark foregrounds for paragraphs, headings, lists, blockquotes and links, while replacing other hard-coded light-theme helper surfaces with theme-aware Sanity colors. Deployment and authenticated phone verification remain required before WEB-013 can close.
