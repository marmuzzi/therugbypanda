# Sanity token rotation recovery — 18 August 2026

## Incident

A controlled AUTO-004 enriched-batch import failed on the first Munster/La Rochelle story with HTTP 500 and `Unauthorized - Session not found`.

Vercel runtime logs showed the request itself authenticated correctly, the Editorial Brain approved the story for drafting, and OpenAI completed article generation. The failure occurred only at `Editorial Sanity draft stage starting`.

## Root cause

`lib/editorial/SanityDraftWriter.ts` uses `SANITY_API_TOKEN` first and `SANITY_AUTH_TOKEN` only as a fallback for CMS writes. Earlier on 18 August the Sanity token was rotated while restoring GitHub Actions access for the Apify image import. GitHub Actions had the new token, but Vercel production still held the previous/revoked token.

## Recovery

The Vercel `SANITY_API_TOKEN` environment variable has now been replaced with the same active token used by GitHub Actions.

A fresh Vercel production deployment completed READY after the environment-variable update. However, that manual redeploy reused the older PR #177 production build (`8249b612435d348abc1a7b6de4beb12e1b8453ef`) rather than current `main`.

This documentation commit intentionally triggers a new Git deployment from current `main` so production can pick up both the active Sanity token and the later merged code, including PR #179 precision media acquisition.

## Verification required

1. Confirm the resulting production deployment is READY and built from current `main`.
2. Retry the controlled AUTO-004 enriched-batch import.
3. Confirm the first story reaches the Sanity draft-write stage successfully.
4. Confirm the five regenerated stories preserve package notification suppression and multi-source generation.
5. Do not restart AUTO-001 independently.
