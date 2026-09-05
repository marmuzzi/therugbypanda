# Draft Image Refresh Safety Threshold — 5 September 2026

Production dry-run `33962165409` proved the expanded scope but exposed low-confidence replacement proposals. Automatic refresh must not replace an existing hero or add inline images from a candidate scoring below the deterministic team-context floor.

Policy:

- minimum automatic candidate score: 35;
- candidates below 35 are treated as weak and skipped;
- `Welcome to The Rugby Panda` is excluded from automatic refresh because it deliberately uses owned Rugby Panda photography;
- inline candidates must meet the same minimum score;
- existing articles are never published by this workflow;
- no OpenAI calls are used.
