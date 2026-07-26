# Editorial Review Raw Perspective Fix

Date: 2026-07-26

The Editorial Review queue explicitly selects `drafts.*` document IDs. The custom Studio client was using Sanity's default published perspective, which excludes draft documents entirely. The queue therefore remained empty for manually created unpublished articles even after missing workflow state was normalised to `draft`.

The Studio client is now configured with `perspective: "raw"` and `useCdn: false`. This allows the authenticated editorial tool to retrieve draft IDs as separate records while preserving the controlled submit, approve and publish workflow.

Verification requires redeploying the hosted Studio from `main`, confirming “I'll make it” appears in the queue, then submitting it while Make is listening.
