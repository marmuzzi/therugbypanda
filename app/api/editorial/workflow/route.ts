import { NextRequest, NextResponse } from "next/server";

import { applyEditorialAction, type EditorialAction } from "@/lib/editorial/EditorialWorkflow";

export const runtime = "nodejs";

type WorkflowRequest = {
  articleId: string;
  action: EditorialAction;
  actor: string;
  note?: string;
};

const actions = new Set<EditorialAction>(["submit", "approve", "reject", "publish", "discard"]);

function isAuthorized(request: NextRequest) {
  const secret = process.env.EDITORIAL_AUTOMATION_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as WorkflowRequest;
    if (!body.articleId || !body.actor || !actions.has(body.action)) {
      return NextResponse.json({ error: "articleId, actor and a valid action are required" }, { status: 400 });
    }

    const result = await applyEditorialAction(body);
    return NextResponse.json({ status: "ok", workflow: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Editorial workflow failed";
    const status = message.startsWith("Cannot ") || message.includes("required") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
