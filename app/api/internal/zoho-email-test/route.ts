import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { sendZohoMail } from "@/lib/email/ZohoSmtp";

export const runtime = "nodejs";

const TEST_LOCK_ID = "editorial-zoho-smtp-test-2026-08-24-01";

function createWriteClient() {
  const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  if (!projectId || !dataset) throw new Error("Sanity project configuration is missing.");
  if (!token) throw new Error("SANITY_API_TOKEN or SANITY_AUTH_TOKEN is not configured.");
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

async function runTest() {
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ ok: false, error: "Production-only SMTP verification route." }, { status: 403 });
  }

  try {
    const writeClient = createWriteClient();
    try {
      await writeClient.create({
        _id: TEST_LOCK_ID,
        _type: "editorialAutomationEvidence",
        kind: "zoho-smtp-test",
        status: "started",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/already exists|document.*exists|conflict/i.test(message)) {
        return NextResponse.json({ ok: false, error: "SMTP verification already triggered." }, { status: 409 });
      }
      throw error;
    }

    const result = await sendZohoMail({
      subject: "The Rugby Panda — direct Zoho SMTP production test",
      text: [
        "This is a direct production SMTP test from The Rugby Panda.",
        "",
        "If you received this message at editor@therugbypanda.ie, the Make.com-independent email path is working.",
        "",
        `Sent: ${new Date().toISOString()}`,
      ].join("\n"),
    });

    await writeClient.patch(TEST_LOCK_ID).set({
      status: "accepted",
      accepted: result.accepted,
      smtpResponse: result.response,
      completedAt: new Date().toISOString(),
    }).commit();

    return NextResponse.json({ ok: true, accepted: result.accepted, smtpResponse: result.response });
  } catch (error) {
    console.error("Zoho SMTP production test failed", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown Zoho SMTP error." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return runTest();
}
