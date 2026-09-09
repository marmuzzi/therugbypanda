import assert from "node:assert/strict";
import { scoreOfficialVideo } from "../lib/editorial/OfficialVideoRelevance.ts";

const cases = [
  {
    name: "named player exact surname passes",
    story: { title: "Fintan Gunne ready to fill Leinster No 9 vacancy" },
    video: { title: "Fintan Gunne on stepping up for Leinster" },
    expected: true,
  },
  {
    name: "generic same-team video fails named player story",
    story: { title: "Fintan Gunne ready to fill Leinster No 9 vacancy" },
    video: { title: "Leinster Rugby training ahead of the new season" },
    expected: false,
  },
  {
    name: "wrong Springbok player fails Kolbe story",
    story: { title: "Cheslin Kolbe moves to fullback for South Africa against New Zealand" },
    video: { title: "Eben Etzebeth speaks before Springboks v All Blacks" },
    expected: false,
  },
  {
    name: "exact named player passes Kolbe story",
    story: { title: "Cheslin Kolbe moves to fullback for South Africa against New Zealand" },
    video: { title: "Cheslin Kolbe ahead of Springboks v All Blacks" },
    expected: true,
  },
  {
    name: "specific event overlap can pass story without named person",
    story: { title: "Connacht mark PRO12 decade with anniversary celebration" },
    video: { title: "Connacht PRO12 anniversary celebration" },
    expected: true,
  },
  {
    name: "generic Connacht clip fails event story",
    story: { title: "Connacht mark PRO12 decade with anniversary celebration" },
    video: { title: "Connacht Rugby training highlights" },
    expected: false,
  },
];

for (const test of cases) {
  const result = scoreOfficialVideo(test.story, test.video);
  assert.equal(result.passed, test.expected, `${test.name}: ${JSON.stringify(result)}`);
}
console.log(JSON.stringify({ officialVideoRelevanceRegression: "passed", cases: cases.length }, null, 2));
