# Unpublished draft image refresh — 5 September 2026

Purpose: re-evaluate worthwhile unpublished production drafts against the enlarged rights-approved Editorial Image library without rewriting article copy or spending OpenAI budget.

The workflow `Refresh Unpublished Draft Images` scans recent unpublished production drafts, loads the complete approved/published local Editorial Image library, applies deterministic fail-closed team/person/gender/unrelated-visual checks, and replaces a hero only when the best safe candidate materially improves on the current image. It may also replace automatic inline imagery with up to two safe alternatives. Unknown or weak matches fail closed.

The workflow supports dry-run evidence (`apply_changes=false`) and an explicit mutation mode (`apply_changes=true`). Every run uploads `draft-image-refresh-summary.json` with the scanned draft IDs, current/best asset IDs, scores and intended/applied actions. It makes no OpenAI calls and never publishes an article.
