import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

const DEFAULT_DAILY_LIMIT_USD = 0.40;
const MAX_RESERVATION_RETRIES = 12;
const BASE_RETRY_DELAY_MS = 35;

type BudgetDocument = {
  _id: string;
  _rev: string;
  _type: "editorialAiBudget";
  operationalDate: string;
  limitUsd: number;
  reservedUsd?: number;
  events?: Array<{
    _key: string;
    purpose: string;
    amountUsd: number;
    createdAt: string;
    requestId: string;
  }>;
};

export class AiDailyBudgetExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiDailyBudgetExceededError";
  }
}

function operationalDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function configuredLimit(): number {
  const raw = Number(process.env.EDITORIAL_AI_DAILY_BUDGET_USD ?? DEFAULT_DAILY_LIMIT_USD);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_DAILY_LIMIT_USD;
  return Math.min(raw, DEFAULT_DAILY_LIMIT_USD);
}

function writeClient() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) throw new Error("SANITY_API_TOKEN is required for the editorial AI budget guard.");
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

function isRevisionConflict(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /unexpected revision id|revision.*(?:mismatch|conflict)|conflict/i.test(message);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function reserveEditorialAiBudget(input: {
  requestId: string;
  purpose: string;
  amountUsd: number;
}) {
  const amountUsd = Number(input.amountUsd.toFixed(6));
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) throw new Error("AI budget reservation must be a positive USD amount.");

  const date = operationalDate();
  const limitUsd = configuredLimit();
  const id = `editorial-ai-budget-${date}`;
  const client = writeClient();

  await client.createIfNotExists({
    _id: id,
    _type: "editorialAiBudget",
    operationalDate: date,
    limitUsd,
    reservedUsd: 0,
    events: [],
  });

  for (let attempt = 1; attempt <= MAX_RESERVATION_RETRIES; attempt += 1) {
    const current = await client.fetch<BudgetDocument | null>(`*[_id == $id][0]`, { id });
    if (!current) throw new Error("Editorial AI budget document could not be read after creation.");

    const alreadyReserved = Number(current.reservedUsd ?? 0);
    const projected = alreadyReserved + amountUsd;
    if (projected > limitUsd + 1e-9) {
      throw new AiDailyBudgetExceededError(
        `Daily OpenAI budget blocked this call: $${alreadyReserved.toFixed(3)} already reserved + $${amountUsd.toFixed(3)} requested exceeds the $${limitUsd.toFixed(2)} Europe/Dublin daily ceiling.`,
      );
    }

    try {
      const eventKey = `${Date.now().toString(36)}-${input.requestId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32)}`;
      await client
        .patch(id)
        .ifRevisionId(current._rev)
        .inc({ reservedUsd: amountUsd })
        .append("events", [{
          _key: eventKey,
          purpose: input.purpose,
          amountUsd,
          createdAt: new Date().toISOString(),
          requestId: input.requestId,
        }])
        .commit();

      return {
        operationalDate: date,
        limitUsd,
        reservedBeforeUsd: alreadyReserved,
        reservedAfterUsd: projected,
        amountUsd,
      };
    } catch (error) {
      if (!isRevisionConflict(error) || attempt === MAX_RESERVATION_RETRIES) throw error;
      // Two draft requests can reserve at the same time. Re-read the latest revision after
      // a short jittered backoff instead of burning a generation slot on a Sanity conflict.
      const jitter = Math.floor(Math.random() * BASE_RETRY_DELAY_MS);
      await delay(Math.min(500, BASE_RETRY_DELAY_MS * attempt + jitter));
    }
  }

  throw new Error("Editorial AI budget reservation failed after bounded revision-conflict retries.");
}
