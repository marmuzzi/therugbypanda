import assert from "node:assert/strict";
import { isIrishRugbyDiscoveryLead } from "../lib/editorial/IrishDiscoveryQualification.mjs";

const cases = [
  {
    name: "reject Shelbourne soccer identity even when clustered beside sport content",
    item: { title: "SHELBOURNE'S RUN IN: Eddie Beach & Olivia Damico | Ajax, UNC & an upcoming Cup Final | OFF THE BALL", description: "Irish sport discussion" },
    expected: false,
  },
  {
    name: "keep Ireland Women WXV feature when contextual summary mentions boxing and soccer",
    item: { title: "'Inspiration is all around' as Ireland prepare for WXV Global Series", description: "Fiona Tuite-O'Sullivan discusses Katie Taylor, women's soccer and Ireland rugby preparations." },
    expected: true,
  },
  {
    name: "keep Ulster rugby feature",
    item: { title: "'Everyone was in floods of tears' - An eight-year wait to win with Ulster", description: "Ulster second-row Fiona Tuite-O'Sullivan reflects on provincial rugby." },
    expected: true,
  },
  {
    name: "keep Mack Hansen Connacht rugby story",
    item: { title: "Ireland star Mack Hansen reveals fear after injury return", description: "Connacht winger back after a ten-month rugby injury layoff under Stuart Lancaster." },
    expected: true,
  },
  {
    name: "reject Irish Open golf",
    item: { title: "Irish Open: McIlroy begins title defence", description: "Ireland sport latest" },
    expected: false,
  },
];

for (const testCase of cases) {
  assert.equal(isIrishRugbyDiscoveryLead(testCase.item), testCase.expected, testCase.name);
}

console.log(JSON.stringify({ irishDiscoveryQualificationRegression: "passed", cases: cases.length }, null, 2));
