import React, { useEffect, useState } from "react";

const TEST_SOURCE_URL = "https://www.world.rugby/the-game/laws/law/8";
const EDITORIAL_API_BASE_URL = "https://therugbypanda.ie";

function buildPayload(dryRun: boolean) {
  const now = new Date().toISOString();
  const inputId = `controlled-qa-${Date.now()}`;
  const sourceId = "world-rugby-law-8";

  return {
    inputId,
    payload: {
      dryRun,
      qaMode: true,
      createSanityDraft: !dryRun,
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
          { id: "try-points", claim: "A try is worth five points.", status: "confirmed", confidence: 100, sourceIds: [sourceId], usableInDraft: true },
          { id: "conversion-points", claim: "A successful conversion is worth two points.", status: "confirmed", confidence: 100, sourceIds: [sourceId], usableInDraft: true },
          { id: "penalty-points", claim: "A successful penalty goal is worth three points.", status: "confirmed", confidence: 100, sourceIds: [sourceId], usableInDraft: true },
          { id: "drop-goal-points", claim: "A successful dropped goal is worth three points.", status: "confirmed", confidence: 100, sourceIds: [sourceId], usableInDraft: true },
        ],
        unsupportedClaims: [],
        conflicts: [],
      },
    },
  };
}

export function EditorialQaTool() {
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [dryRunPassed, setDryRunPassed] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("rugby-panda-editorial-secret");
    if (saved) setSecret(saved);
  }, []);

  async function runControlledTest(dryRun: boolean) {
    if (!secret.trim()) {
      setMessage("Enter the editorial automation secret first.");
      return;
    }

    setIsRunning(true);
    setMessage(null);
    if (dryRun) setDryRunPassed(false);
    window.sessionStorage.setItem("rugby-panda-editorial-secret", secret.trim());

    const { inputId, payload: requestPayload } = buildPayload(dryRun);

    try {
      const response = await fetch(`${EDITORIAL_API_BASE_URL}/api/editorial/draft`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${secret.trim()}`,
        },
        body: JSON.stringify(requestPayload),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        const body = await response.text();
        throw new Error(`Editorial API returned ${response.status} ${response.statusText} instead of JSON: ${body.slice(0, 120)}`);
      }

      const responsePayload = await response.json();
      if (!response.ok) throw new Error(responsePayload.error ?? `Controlled test failed with ${response.status}.`);

      if (dryRun) {
        if (responsePayload.status !== "dry-run-passed") {
          throw new Error(responsePayload.message ?? `Dry run returned ${responsePayload.status}.`);
        }
        setDryRunPassed(true);
        setMessage(`Dry run passed. No OpenAI generation was used. Request ID: ${responsePayload.requestId ?? "not returned"}.`);
        return;
      }

      if (responsePayload.status !== "draft-created") {
        throw new Error(responsePayload.message ?? `Editorial pipeline returned ${responsePayload.status}.`);
      }

      setDryRunPassed(false);
      setMessage(`Controlled draft created: ${responsePayload.sanityDraft?.id ?? inputId}. Open Editorial Review and refresh the queue.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Controlled editorial QA failed.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main style={{ padding: "1.5rem", display: "grid", gap: "1rem", maxWidth: 760 }}>
      <header>
        <h1 style={{ margin: 0 }}>Editorial QA</h1>
        <p>Validate the protected Editorial Brain and Sanity pipeline for free before allowing one paid OpenAI generation.</p>
      </header>
      <label>
        Editorial automation secret
        <input
          type="password"
          value={secret}
          onChange={(event) => {
            setSecret(event.target.value);
            setDryRunPassed(false);
          }}
          style={{ display: "block", width: "100%", padding: ".6rem", marginTop: ".35rem" }}
        />
      </label>
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
        <button type="button" onClick={() => runControlledTest(true)} disabled={isRunning} style={{ width: "fit-content", padding: ".65rem 1rem" }}>
          {isRunning ? "Running validation…" : "Run free dry validation"}
        </button>
        <button type="button" onClick={() => runControlledTest(false)} disabled={isRunning || !dryRunPassed} style={{ width: "fit-content", padding: ".65rem 1rem" }}>
          Create short controlled draft
        </button>
      </div>
      <p style={{ margin: 0 }}>
        <strong>Safety:</strong> The paid generation button remains disabled until the current session passes the free dry validation. The controlled article is limited to 250–400 words and has a 42-second OpenAI safety timeout.
      </p>
      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </main>
  );
}
