"use client";

import { useState } from "react";

type Result = {
  status?: string;
  eventId?: string;
  articleCount?: number;
  eligibleCandidateCount?: number;
  requiredArticleCount?: number;
  reason?: string;
  technicalAlertStatus?: string;
  error?: string;
};

export default function Auto004TestClient() {
  const [result, setResult] = useState<Result | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  async function runTest() {
    setRunning(true);
    setResult(null);
    setHttpStatus(null);
    try {
      const response = await fetch("/api/ops/auto004-test", { method: "POST", cache: "no-store" });
      const body = (await response.json()) as Result;
      setHttpStatus(response.status);
      setResult(body);
    } catch {
      setResult({ error: "The browser could not complete the controlled AUTO-004 verification request." });
    } finally {
      setRunning(false);
    }
  }

  const blocked = httpStatus === 409 && result?.reason === "insufficient-production-eligible-diverse-content";

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/15 bg-zinc-900 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9BE564]">Temporary Preview Operations Test</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">AUTO-004 production guard verification</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          This preview invokes the real production Morning Editorial Package endpoint. The expected result today is HTTP 409 because historical QA drafts do not carry the new production eligibility marker.
        </p>
        <button type="button" onClick={runTest} disabled={running} className="mt-7 rounded-full bg-[#9BE564] px-5 py-3 text-sm font-black text-zinc-950 disabled:opacity-60">
          {running ? "Running controlled test…" : "Verify QA drafts are excluded"}
        </button>
        {(httpStatus !== null || result) && (
          <section className="mt-7 rounded-2xl border border-white/10 bg-black/40 p-5">
            <p className="text-sm font-black">Result</p>
            {httpStatus !== null && <p className="mt-2 text-sm">HTTP status: {httpStatus}</p>}
            {blocked && <p className="mt-2 font-bold text-[#9BE564]">Production correctly refused to build a morning package from QA/test content.</p>}
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs leading-5 text-zinc-300">{JSON.stringify(result, null, 2)}</pre>
          </section>
        )}
      </div>
    </main>
  );
}
