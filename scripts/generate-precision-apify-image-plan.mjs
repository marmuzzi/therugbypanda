import fs from "node:fs/promises";
import path from "node:path";

const targetsPath = process.env.EDITORIAL_IMAGE_TARGETS_FILE ?? "data/editorial-images/acquisition-targets-2026-27.json";
const outputPath = process.env.EDITORIAL_IMAGE_PLAN_FILE ?? "data/editorial-images/precision-apify-query-plan-2026-08-18.json";

const targets = JSON.parse(await fs.readFile(path.resolve(process.cwd(), targetsPath), "utf8"));
const defaultLimit = Math.min(targets.defaultResultsPerQuery ?? 3, targets.maximumResultsPerQuery ?? 5);
const plan = [];
const seen = new Set();

function add({ keyword, scope, subjectType, subject, competition, requiredSignals = [], resultsWanted = defaultLimit, tier = 2 }) {
  const key = keyword.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  plan.push({
    keyword,
    scope,
    subjectType,
    subject,
    competition,
    requiredSignals: [...new Set(requiredSignals.filter(Boolean))],
    resultsWanted: Math.min(resultsWanted, targets.maximumResultsPerQuery ?? 5),
    sort: "relevance",
    tier,
    preferredFromYear: targets.preferredCurrentImageYear ?? 2024,
  });
}

for (const team of targets.priorityTeams) {
  add({
    keyword: `${team} rugby match`,
    scope: team,
    subjectType: "team",
    subject: team,
    requiredSignals: [team.replace(/ Rugby$/i, ""), team],
    resultsWanted: 4,
    tier: 1,
  });
}

for (const player of targets.priorityIrelandPlayers) {
  add({
    keyword: `${player} Ireland rugby`,
    scope: "Ireland players",
    subjectType: "person",
    subject: player,
    competition: "international rugby",
    requiredSignals: [player],
    resultsWanted: 3,
    tier: 1,
  });
}

for (const coach of targets.priorityCoaches) {
  add({
    keyword: `${coach.name} ${coach.team} rugby`,
    scope: coach.team,
    subjectType: "person",
    subject: coach.name,
    requiredSignals: [coach.name],
    resultsWanted: 3,
    tier: 1,
  });
}

for (const team of targets.urcTeams) {
  add({
    keyword: `${team} United Rugby Championship`,
    scope: "URC",
    subjectType: "team",
    subject: team,
    competition: "United Rugby Championship",
    requiredSignals: [team.replace(/ Rugby$/i, ""), team],
    resultsWanted: targets.priorityTeams.includes(team) ? 4 : 3,
    tier: targets.priorityTeams.includes(team) ? 1 : 2,
  });
}

for (const team of targets.sixNationsTeams) {
  add({
    keyword: `${team} Six Nations rugby`,
    scope: "Six Nations",
    subjectType: "national-team",
    subject: team,
    competition: "Guinness Men's Six Nations",
    requiredSignals: [team],
    resultsWanted: team === "Ireland" ? 4 : 3,
    tier: team === "Ireland" ? 1 : 2,
  });
}

for (const team of targets.nationsChampionshipTeams) {
  add({
    keyword: `${team} Nations Championship rugby`,
    scope: "Nations Championship",
    subjectType: "national-team",
    subject: team,
    competition: "Nations Championship",
    requiredSignals: [team],
    resultsWanted: team === "Ireland" ? 4 : 3,
    tier: team === "Ireland" ? 1 : 2,
  });
}

for (const venue of targets.priorityVenues) {
  add({
    keyword: `${venue} rugby`,
    scope: "venues",
    subjectType: "venue",
    subject: venue,
    requiredSignals: venue.split(/\s+(?:Stadium|Park)$/i).slice(0, 1),
    resultsWanted: 3,
    tier: 3,
  });
}

plan.sort((a, b) => a.tier - b.tier || a.scope.localeCompare(b.scope) || a.keyword.localeCompare(b.keyword));
const totals = plan.reduce(
  (acc, item) => {
    acc.queries += 1;
    acc.maximumRequestedResults += item.resultsWanted;
    acc[`tier${item.tier}`] = (acc[`tier${item.tier}`] ?? 0) + 1;
    return acc;
  },
  { queries: 0, maximumRequestedResults: 0 },
);

const output = {
  generatedAt: new Date().toISOString(),
  actor: targets.actor,
  executionPolicy: {
    paidRunRequiresExplicitApproval: true,
    broadGenericQueriesForbidden: true,
    expandOnlyAfterMeasuredUsefulYield: true,
    approvalBoundary: "assistant visual/editorial first-pass; owner only for genuinely uncertain cases",
    initialPaidBatchMaximumQueries: targets.initialPaidBatchMaximumQueries ?? 12,
    initialPaidBatchMaximumResults: targets.initialPaidBatchMaximumResults ?? 40,
    minimumUsefulApprovalYieldPercent: targets.minimumUsefulApprovalYieldPercent ?? 60,
    stopAndRedesignBelowUsefulYield: true,
    fullPlanExecutionForbiddenByDefault: true,
  },
  totals,
  queries: plan,
};

await fs.writeFile(path.resolve(process.cwd(), outputPath), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Generated ${totals.queries} precision queries with a hard ceiling of ${totals.maximumRequestedResults} requested results.`);
console.log(`Paid execution policy: max ${output.executionPolicy.initialPaidBatchMaximumQueries} queries / ${output.executionPolicy.initialPaidBatchMaximumResults} results before yield review.`);
console.log(`Plan: ${outputPath}`);
