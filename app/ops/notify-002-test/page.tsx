"use client";

import { FormEvent, useState } from "react";

type Result = {
  status?: string;
  eventId?: string;
  articleCount?: number;
  requiredArticleCount?: number;
  technicalAlertStatus?: string;
  error?: string;
  responseStatus?: number;
};

export default function Notify002TestPage() {
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  async function runTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRunning(true);
    setResult(null);
    setHttpStatus(null);

    try {
      const response = await fetch("/api/editorial/daily-package", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
        },
        cache: "no-store",
      });

      const body = (await response.json()) as Result;
      setHttpStatus(response.status);
      setResult(body);
      setSecret("");
    } catch {
      setResult({ error: "The browser could not complete the controlled verification request." });
    } finally {
      setRunning(false);
    }
  }

  const success = httpStatus === 409 && result?.technicalAlertStatus === "sent";

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/15 bg-zinc-900 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9BE564]">Temporary Operations Test</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">NOTIFY-002 browser verification</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          This temporary page calls the existing protected Morning Editorial Package endpoint from your browser. The automation secret is sent only in the same-origin Authorization header and is cleared from this form after the request.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          For the controlled failure-path test, the expected result is HTTP 409 with <code>technicalAlertStatus: sent</code> when fewer than five eligible drafts are available.
        </p>

        <form onSubmit={runTest} className="mt-7 space-y-4">
          <label className="block text-sm font-bold" htmlFor="automation-secret">
            EDITORIAL_AUTOMATION_SECRET
          </label>
          <input
            id="automation-secret"
            type="password"
            autoComplete="off"
            required
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            className="w-full rounded-xl border border-white/20 bg-black px-4 py-3 text-white outline-none focus:border-[#9BE564]"
          />
          <button
            type="submit"
            disabled={running}
            className="rounded-full bg-[#9BE564] px-5 py-3 text-sm font-black text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? "Running controlled test…" : "Run controlled NOTIFY-002 test"}
          </button>
        </form>

        {(httpStatus !== null || result) && (
          <section className="mt-7 rounded-2xl border border-white/10 bg-black/40 p-5">
            <p className="text-sm font-black">Result</p>
            {httpStatus !== null && <p className="mt-2 text-sm">HTTP status: {httpStatus}</p>}
            {success && (
              <p className="mt-2 font-bold text-[#9BE564]">
                Application failure path reached the configured technical-alert webhook successfully.
              </p>
            )}
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs leading-5 text-zinc-300">
              {JSON.stringify(result, null, 2)}
            </pre>
          </section>
        )}

        <p className="mt-7 text-xs leading-5 text-zinc-500">
          This page is temporary and must be removed immediately after NOTIFY-002 production verification.
        </p>
      </div>
    </main>
  );
}
