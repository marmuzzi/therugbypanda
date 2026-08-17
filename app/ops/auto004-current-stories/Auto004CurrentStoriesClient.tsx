"use client";

import { useState } from "react";

const stories = [
  { key: "munster", label: "1. Munster — La Rochelle pre-season" },
  { key: "connacht", label: "2. Connacht — pre-season build-up" },
  { key: "ulster", label: "3. Ulster — opening URC fixtures" },
  { key: "leinster", label: "4. Leinster — South Africa URC start" },
  { key: "ireland-women", label: "5. Ireland Women — WXV autumn" },
] as const;

type Result = Record<string, unknown>;

export default function Auto004CurrentStoriesClient() {
  const [results, setResults] = useState<Record<string, { status: number; body: Result }>>({});
  const [running, setRunning] = useState<string | null>(null);

  async function run(action: "generate" | "package", storyKey?: string) {
    const resultKey = storyKey ?? "package";
    setRunning(resultKey);
    try {
      const response = await fetch("/api/ops/auto004-current-stories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, storyKey }),
        cache: "no-store",
      });
      const body = (await response.json()) as Result;
      setResults((current) => ({ ...current, [resultKey]: { status: response.status, body } }));
    } catch {
      setResults((current) => ({
        ...current,
        [resultKey]: { status: 0, body: { error: "The browser could not complete this controlled production verification request." } },
      }));
    } finally {
      setRunning(null);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-zinc-900 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9BE564]">Temporary Preview Operations Test</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">AUTO-004 — five current production stories</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300">
          Generate each verified story one at a time through the real production editorial pipeline. Each successful run must create a normal production-eligible Sanity draft. Nothing is published automatically. After all five succeed, run the Morning Editorial Package.
        </p>

        <div className="mt-8 space-y-4">
          {stories.map((story) => {
            const result = results[story.key];
            return (
              <section key={story.key} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-black">{story.label}</h2>
                  <button
                    type="button"
                    disabled={running !== null}
                    onClick={() => run("generate", story.key)}
                    className="rounded-full bg-[#9BE564] px-5 py-2.5 text-sm font-black text-zinc-950 disabled:opacity-50"
                  >
                    {running === story.key ? "Generating…" : "Generate production draft"}
                  </button>
                </div>
                {result && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-zinc-950 p-4">
                    <p className="text-sm font-bold">HTTP {result.status}</p>
                    <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-5 text-zinc-300">
                      {JSON.stringify(result.body, null, 2)}
                    </pre>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <section className="mt-8 rounded-2xl border border-[#9BE564]/30 bg-black/40 p-5">
          <h2 className="text-xl font-black">Morning package verification</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Use this only after all five draft generations above returned <strong>draft-created</strong> with production eligibility.
          </p>
          <button
            type="button"
            disabled={running !== null}
            onClick={() => run("package")}
            className="mt-4 rounded-full bg-[#9BE564] px-5 py-3 text-sm font-black text-zinc-950 disabled:opacity-50"
          >
            {running === "package" ? "Building package…" : "Run production Morning Editorial Package"}
          </button>
          {results.package && (
            <div className="mt-4 rounded-xl border border-white/10 bg-zinc-950 p-4">
              <p className="text-sm font-bold">HTTP {results.package.status}</p>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs leading-5 text-zinc-300">
                {JSON.stringify(results.package.body, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
