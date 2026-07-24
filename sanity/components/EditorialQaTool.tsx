import React, { useEffect, useState } from "react";

const TEST_SOURCE_URL = "https://www.world.rugby/the-game/laws/law/8";
const EDITORIAL_API_BASE_URL = "https://therugbypanda.ie";

export function EditorialQaTool() {
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("rugby-panda-editorial-secret");
    if (saved) setSecret(saved);
  }, []);

  async function createControlledDraft() {
    if (!secret.trim()) {
      setMessage("Enter the editorial automation secret first.");
      return;
    }

    setIsRunning(true);
    setMessage(null);
    window.sessionStorage.setItem("rugby-panda-editorial-secret", secret.trim());

    const now = new Date().toISOString();
    const inputId = `controlled-qa-${Date.now()}`;
    const sourceId = "world-rugby-law-8";

    try {
      const response = await fetch(`${EDITORIAL_API_BASE_URL}/api/editorial/draft`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${secret.trim()}`,
        },
        body: JSON.stringify({
          createSanityDraft: true,
          story: {
            id: inputId,
            title: "How scoring works in rugby union",
            summary: "A controlled evergreen editorial QA article explaining the points awarded for a try, conversion, penalty goal and dropped goal.",
            bodyText: "World Rugby Law 8 defines the standard scoring values used in rugby union.",
            discoveredAt: now,
            suggestedCategory: "Opinion",
            sourceRecords: [
              {
                id: sourceId,
                url: TEST_SOURCE_URL,
                publisher: "World Rugby",
                title: "Law 8: Scoring",
                retrievedAt: now,
                isPrimarySource: true,
              },
            ],
          },
          factLedger: {
            facts: [
              { id: "try-points", claim: "A try is worth five points.", status: "confirmed", confidence: 1, sourceIds: [sourceId], usableInDraft: true },
              { id: "conversion-points", claim: "A successful conversion is worth two points.", status: "confirmed", confidence: 1, sourceIds: [sourceId], usableInDraft: true },
              { id: "penalty-points", claim: "A successful penalty goal is worth three points.", status: "confirmed", confidence: 1, sourceIds: [sourceId], usableInDraft: true },
              { id: "drop-goal-points", claim: "A successful dropped goal is worth three points.", status: "confirmed", confidence: 1, sourceIds: [sourceId], usableInDraft: true },
            ],
            unsupportedClaims: [],
            conflicts: [],
          },
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        const body = await response.text();
        throw new Error(`Editorial API returned ${response.status} ${response.statusText} instead of JSON: ${body.slice(0, 120)}`);
      }

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? `Controlled draft failed with ${response.status}.`);
      if (payload.status !== "draft-created") throw new Error(payload.message ?? `Editorial Brain returned ${payload.status}.`);

      setMessage(`Controlled draft created: ${payload.sanityDraft?.id ?? inputId}. Open Editorial Review and refresh the queue.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Controlled draft creation failed.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main style={{ padding: "1.5rem", display: "grid", gap: "1rem", maxWidth: 760 }}>
      <header>
        <h1 style={{ margin: 0 }}>Editorial QA</h1>
        <p>This creates one clearly labelled, non-news test draft through the real protected Editorial Brain, OpenAI and Sanity pipeline.</p>
      </header>
      <label>
        Editorial automation secret
        <input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} style={{ display: "block", width: "100%", padding: ".6rem", marginTop: ".35rem" }} />
      </label>
      <button type="button" onClick={createControlledDraft} disabled={isRunning} style={{ width: "fit-content", padding: ".65rem 1rem" }}>
        {isRunning ? "Generating controlled draft…" : "Create controlled test draft"}
      </button>
      <p style={{ margin: 0 }}><strong>Important:</strong> This consumes one OpenAI generation and creates a Sanity draft. It will not publish automatically.</p>
      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </main>
  );
}
