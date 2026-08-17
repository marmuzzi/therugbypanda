"use client";

import { useState } from "react";

type Result = {
  status?: string;
  eventId?: string;
  articleCount?: number;
  requiredArticleCount?: number;
  destination?: string;
  technicalAlertStatus?: string;
  error?: string;
  responseStatus?: number;
};

export default function Auto001TestClient() {
  const [result, setResult] = useState<Result | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  async function runTest() {
    setRunning(true);
    setResult(null);
    setHttpStatus(null);

    try {
      const response = await fetch("/api/ops/auto001-test", {
        method: "POST",
        cache: "no-store",
      });
      const body = (await response.json()) as Result;
      setHttpStatus(response.status);
      setResult(body);
    } catch {
      setResult({ error: "The browser could not complete the controlled AUTO-001 verification request." });
    } finally {
      setRunning(false);
    }
  }

  const delivered = httpStatus === 200 && result?.status === "sent" && result?.articleCount === 5;
  const incomplete = httpStatus === 409 && result?.status === "incomplete";

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/15 bg-zinc-900 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9BE564]">Temporary Preview Operations Test</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">AUTO-001 production-path verification</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          This Vercel Preview page invokes the real production Morning Editorial Package endpoint from the server. The automation secret never enters the browser.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          A successful five-draft package returns HTTP 200 with <code>status: sent</code>. If fewer than five eligible drafts exist, production returns HTTP 409 and the technical-alert path is exercised instead.
        </p>

        <button
          type="button"
          onClick={runTest}
          disabled={running}
          className="mt-7 rounded-full bg-[#9BE564] px-5 py-3 text-sm font-black text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "Running controlled test…" : "Run controlled AUTO-001 test"}
        </button>

        {(httpStatus !== null || result) && (
          <section className="mt-7 rounded-2xl border border-white/10 bg-black/40 p-5">
            <p className="text-sm font-black">Result</p>
            {httpStatus !== null && <p className="mt-2 text-sm">HTTP status: {httpStatus}</p>}
            {delivered && (
              <p className="mt-2 font-bold text-[#9BE564]">
                Production generated and delivered a five-article morning editorial package successfully.
              </p>
            )}
            {incomplete && (
              <p className="mt-2 font-bold text-amber-300">
                Production does not currently have five eligible drafts; AUTO-001 delivery was not attempted.
              </p>
            )}
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs leading-5 text-zinc-300">
              {JSON.stringify(result, null, 2)}
            </pre>
          </section>
        )}

        <p className="mt-7 text-xs leading-5 text-zinc-500">
          This verifier is available only in Vercel Preview and will not be merged into production.
        </p>
      </div>
    </main>
  );
}
