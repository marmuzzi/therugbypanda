# Next recovery branch

After this UI fix is merged, next coherent runtime branch should address AUTO-006 current-day freshness and final media assignment together only if their generation/package paths overlap; otherwise keep media repair separate. Avoid coupling social orchestrator work to those changes unless required for the same deployment.
