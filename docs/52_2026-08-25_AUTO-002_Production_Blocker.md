# 25 August 2026 — AUTO-002 Production Blocker Evidence

## Purpose

Establish the real production boundary for immediate rejection -> genuinely different replacement without disturbing the five review drafts already delivered to the editor and without spending model credit against an unavailable orchestrator.

## Existing application-side behavior

- #202 merged the immediate rejection trigger.
- `app/api/editorial/workflow/route.ts` applies the rejection and then invokes `requestEditorialReplacement`.
- `lib/editorial/EditorialReplacementTrigger.ts` requires `EDITORIAL_REPLACEMENT_WEBHOOK_URL`; when absent it returns `not-configured`.
- `app/api/editorial/replacement/route.ts` requires a rejected article with `replacementRequired=true`, rejects an identical source set and rejects the same normalized editorial angle before generating/writing a replacement.

The application therefore contains the correct rejection/replacement contracts, but the end-to-end path also depends on a persistent downstream acquisition/orchestration webhook.

## Safe production verification

PR #270 added a protected configuration-only health endpoint and one-shot production check. The check:

- required the existing `EDITORIAL_AUTOMATION_SECRET`;
- exposed only boolean configuration state, never the webhook URL or secret;
- made no article mutation;
- made no webhook call;
- made no model call.

Production deployment for #270 reached READY at commit `624c6f26aa17e5da2c6b89e2f44b23454404ca6b`.

Workflow run `32878119048`, job `97900908035`, returned at `2026-08-25T17:29:24.808Z`:

```json
{
  "status": "ready",
  "replacementWebhookConfigured": false,
  "replacementEndpointConfigured": true
}
```

The workflow explicitly reported:

```text
Replacement webhook is NOT configured in production.
```

## Conclusion

AUTO-002 is **Blocked**, not production-verified.

The root cause is now specific: `EDITORIAL_REPLACEMENT_WEBHOOK_URL` is absent in production, so a real rejection cannot launch the downstream replacement acquisition/orchestration flow. Rejecting one of the five live review drafts would therefore only damage the current editorial queue and reproduce a known configuration failure.

No OpenAI/API generation credit was spent on this verification.

## Required next step

Configure a persistent production replacement orchestrator/webhook that consumes `editorial.article.rejected.replacement-requested`, acquires a genuinely different candidate, invokes `/api/editorial/replacement` with the existing authorization contract, and handles retries/idempotency/failure alerting. Then run one isolated production-class rejection proof and verify:

1. rejection state is persisted;
2. replacement event is accepted;
3. candidate source set differs from the rejected article;
4. normalized editorial angle differs;
5. replacement passes normal Draft Ready/originality/Publication Review/image gates;
6. a new Sanity review draft is created and linked to the rejected article;
7. no duplicate replacement is created on replay.

The one-shot workflow/trigger used for this check was removed after verification. The protected boolean health endpoint remains available for diagnostics.
