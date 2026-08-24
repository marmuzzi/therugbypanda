import { NextResponse } from "next/server";

import { sendZohoMail } from "@/lib/email/ZohoSmtp";

export const runtime = "nodejs";

async function runTest() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Test route is disabled in production." }, { status: 403 });
  }

  try {
    const result = await sendZohoMail({
      subject: "The Rugby Panda — direct Zoho SMTP test",
      text: [
        "This is a direct SMTP test from The Rugby Panda preview deployment.",
        "",
        "If you received this message at editor@therugbypanda.ie, the Make.com-independent email path is working.",
        "",
        `Sent: ${new Date().toISOString()}`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true, accepted: result.accepted, smtpResponse: result.response });
  } catch (error) {
    console.error("Zoho SMTP test failed", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown Zoho SMTP error." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return runTest();
}

export async function POST() {
  return runTest();
}
