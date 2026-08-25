import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorised(request: NextRequest) {
  const expected = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
  return Boolean(expected) && request.headers.get("authorization") === `Bearer ${expected}`;
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    status: "ready",
    replacementWebhookConfigured: Boolean(process.env.EDITORIAL_REPLACEMENT_WEBHOOK_URL?.trim()),
    replacementEndpointConfigured: true,
    checkedAt: new Date().toISOString(),
  });
}
