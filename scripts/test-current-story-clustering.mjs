import assert from "node:assert/strict";
import { sameCurrentRugbyStory } from "../lib/editorial/CurrentStoryClustering.mjs";

const at = "2026-09-10T05:30:00Z";
const lead = (title, description = title) => ({ title, description, publishedAt: at, editorialPosition: { development: description } });

const cases = [
  {
    name: "cluster differently worded Mack Hansen Connacht reports",
    left: lead("'He's everything we asked for' - Returning Hansen keen to make impact for Lancaster's Connacht"),
    right: lead("Hansen hails Lancaster as Connacht target silverware"),
    expected: true,
  },
  {
    name: "do not merge Ian Madigan's Tom Wood and Leinster coach comments",
    left: lead("Tom Wood has the physicality to take Munster step up, says Madigan"),
    right: lead("Felipe Contepomi would be a great fit for Leinster job, insists Ian Madigan"),
    expected: false,
  },
  {
    name: "do not merge Ulster rugby with Shelbourne football content",
    left: lead("Ulster ace on Challenge Cup Final defeat, why he's relishing the season ahead"),
    right: lead("SHELBOURNE'S RUN IN: Eddie Beach & Olivia Damico | Ajax, UNC & an upcoming Cup Final"),
    expected: false,
  },
  {
    name: "cluster Fintan Gunne Leinster succession reports",
    left: lead("Scrumhalf Fintan Gunne ready to fill the void left by Luke McGrath at Leinster"),
    right: lead("All eyes on No 9 as Leinster look to Fintan Gunne to fill void left by Luke McGrath"),
    expected: true,
  },
];

for (const testCase of cases) {
  assert.equal(sameCurrentRugbyStory(testCase.left, testCase.right), testCase.expected, testCase.name);
}
console.log(JSON.stringify({ currentStoryClusteringRegression: "passed", cases: cases.length }, null, 2));
