import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("Daily-package preflight requires Sanity project ID and token.");

const packageDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Dublin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const accepted = await client.fetch(
  `count(*[_type == "editorialAutomationEvidence" && kind == "daily-package-direct-zoho" && packageDate == $packageDate && status == "accepted"])`,
  { packageDate },
);
const skip = Number(accepted) > 0;
console.log(JSON.stringify({ packageDate, acceptedEvidenceCount: Number(accepted), skip }, null, 2));
if (process.env.GITHUB_OUTPUT) {
  const fs = await import("node:fs/promises");
  await fs.appendFile(process.env.GITHUB_OUTPUT, `skip=${skip ? "true" : "false"}\npackage_date=${packageDate}\n`);
}
