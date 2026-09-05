const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) throw new Error("Sanity configuration is required.");

const tests = [
  {
    articleId: "drafts.article-auto004-live-munster-larochelle-20260827",
    expectedTitleTerms: ["munster", "la rochelle"],
    embed: {
      _type: "socialEmbed",
      _key: "socialmunsterlarochelle",
      platform: "instagram",
      url: "https://www.instagram.com/p/DcgzkCeDeQT/",
      caption: "Munster Rugby training in La Rochelle before the pre-season fixture.",
      sourceLabel: "Munster Rugby",
      isOfficialSource: true,
    },
  },
];

async function query(groq, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", groq);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) throw new Error(`Sanity query failed ${response.status}: ${await response.text()}`);
  return (await response.json()).result;
}

async function mutate(mutations) {
  const response = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnDocuments=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  if (!response.ok) throw new Error(`Sanity mutation failed ${response.status}: ${await response.text()}`);
  return response.json();
}

function insertEmbed(body, embed) {
  const existing = (body ?? []).find((item) => item?._type === "socialEmbed" && item?.url === embed.url);
  if (existing) return { body, changed: false, reason: "already-present" };

  const next = [...(body ?? [])];
  let textBlocksSeen = 0;
  let insertAt = next.length;
  for (let index = 0; index < next.length; index += 1) {
    if (next[index]?._type === "block") textBlocksSeen += 1;
    if (textBlocksSeen >= 3) {
      insertAt = index + 1;
      break;
    }
  }
  next.splice(insertAt, 0, embed);
  return { body: next, changed: true, reason: "inserted" };
}

const summary = [];
for (const test of tests) {
  const article = await query(`*[_id==$id][0]{_id,title,workflowStatus,body}`, { id: test.articleId });
  if (!article) {
    summary.push({ articleId: test.articleId, status: "skipped", reason: "draft-not-found" });
    continue;
  }
  const title = String(article.title ?? "").toLowerCase();
  if (!test.expectedTitleTerms.every((term) => title.includes(term))) {
    summary.push({ articleId: test.articleId, title: article.title, status: "skipped", reason: "title-safety-check-failed" });
    continue;
  }
  if (article.workflowStatus === "published") {
    summary.push({ articleId: test.articleId, title: article.title, status: "skipped", reason: "published-document-boundary" });
    continue;
  }

  const prepared = insertEmbed(article.body, test.embed);
  if (!prepared.changed) {
    summary.push({ articleId: test.articleId, title: article.title, status: "unchanged", reason: prepared.reason, url: test.embed.url });
    continue;
  }

  await mutate([{ patch: { id: test.articleId, set: { body: prepared.body } } }]);
  const readback = await query(`*[_id==$id][0]{_id,title,"embeds":body[_type=="socialEmbed"]{platform,url,sourceLabel,isOfficialSource}}`, { id: test.articleId });
  const verified = (readback?.embeds ?? []).some((embed) => embed.url === test.embed.url && embed.isOfficialSource === true);
  summary.push({ articleId: test.articleId, title: article.title, status: verified ? "applied-and-readback-verified" : "readback-failed", platform: test.embed.platform, url: test.embed.url, sourceLabel: test.embed.sourceLabel });
  if (!verified) throw new Error(`Social embed readback verification failed for ${test.articleId}`);
}

console.log(JSON.stringify({ socialEmbedTest: summary }, null, 2));
