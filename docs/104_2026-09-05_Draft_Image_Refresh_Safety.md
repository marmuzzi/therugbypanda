# Draft image refresh safety boundaries

- Only unpublished production drafts are considered.
- Publication is never automated.
- Only local Editorial Images with `usageApproved=true` and lifecycle `approved`/`published` are eligible.
- Explicit conflicting teams, named people absent from the article, women/men context conflicts, and known unrelated visual terms fail closed.
- Existing hero remains unless the replacement is materially stronger or the current image fails the same safety gate.
- Up to two inline images are selected from the same safe candidate set.
- Dry-run is supported and evidence is uploaded before mutation is requested.
- No OpenAI calls are made by this workflow.
