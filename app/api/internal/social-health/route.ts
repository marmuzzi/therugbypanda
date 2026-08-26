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
    socialWebhookConfigured: Boolean(process.env.SOCIAL_PUBLISHING_WEBHOOK_URL?.trim()),
    socialWebhookSecretConfigured: Boolean(process.env.SOCIAL_PUBLISHING_WEBHOOK_SECRET?.trim()),
    siteUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
    checkedAt: new Date().toISOString(),
  });
}
