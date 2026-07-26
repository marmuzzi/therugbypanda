import { createClient } from "next-sanity";
import type { NextRequest } from "next/server";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export type EditorialRequestIdentity = {
  actor: string;
  method: "automation-secret" | "sanity-session";
};

type SanityUser = {
  displayName?: string;
  name?: string;
  email?: string;
};

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

export async function authenticateEditorialRequest(
  request: NextRequest,
): Promise<EditorialRequestIdentity | null> {
  const token = bearerToken(request);
  if (!token) return null;

  const automationSecret = process.env.EDITORIAL_AUTOMATION_SECRET?.trim();
  if (automationSecret && token === automationSecret) {
    return { actor: "Editorial automation", method: "automation-secret" };
  }

  try {
    const sanityClient = createClient({
      apiVersion,
      dataset,
      projectId,
      token,
      useCdn: false,
    });
    const user = (await sanityClient.users.getById("me")) as SanityUser | null;
    if (!user) return null;

    return {
      actor:
        user.displayName?.trim() ||
        user.name?.trim() ||
        user.email?.trim() ||
        "Sanity editor",
      method: "sanity-session",
    };
  } catch {
    return null;
  }
}
