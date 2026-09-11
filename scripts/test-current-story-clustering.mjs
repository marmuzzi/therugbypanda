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
  {
    name: "do not treat Exeter Chiefs team name as a person anchor",
    left: lead("Exeter Chiefs confirm academy changes ahead of new season"),
    right: lead("Chiefs winger signs new deal after breakthrough campaign"),
    expected: false,
  },
  {
    name: "do not mix Limerick All-Ireland hurling with Leinster rugby judo feature",
    left: lead("Kiely commits to Limerick for All-Ireland title defence - RTE.ie"),
    right: lead("Meet the All-Ireland judo champion Alex Usanov looking to grab front-row opportunity at Leinster with both hands - Irish Independent"),
    expected: false,
  },
  {
    name: "do not mix Mako Vunipola Leicester signing with Steve Borthwick England story",
    left: lead("Mako Vunipola: Ex-England prop shelved retirement plans to join Leicester Tigers - BBC"),
    right: lead("Ex-England star accuses RFU boss of having 'blinkers on' following Steve Borthwick backing - Planet Rugby"),
    expected: false,
  },
];

for (const testCase of cases) {
  assert.equal(sameCurrentRugbyStory(testCase.left, testCase.right), testCase.expected, testCase.name);
}
console.log(JSON.stringify({ currentStoryClusteringRegression: "passed", cases: cases.length }, null, 2));
