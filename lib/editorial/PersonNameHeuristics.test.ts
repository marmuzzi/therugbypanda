import test from "node:test";
import assert from "node:assert/strict";
// @ts-ignore -- Node's stripped-TypeScript test runner requires the explicit .ts extension.
import { extractPersonNames } from "./PersonNameHeuristics.ts";

test("keeps real person names", () => {
  assert.deepEqual(extractPersonNames("Stuart Lancaster discussed Mack Hansen and Tommy O'Brien"), ["Stuart Lancaster", "Mack Hansen", "Tommy O'Brien"]);
});

test("normalizes honorifics so the same person does not become a surname collision", () => {
  assert.deepEqual(extractPersonNames("Steve Hansen spoke after Sir Steve Hansen was quoted"), ["Steve Hansen"]);
});

test("rejects team and competition phrase false positives", () => {
  assert.deepEqual(extractPersonNames("Lancaster's Connacht update was reported by The Irish Times Connacht desk"), []);
  assert.deepEqual(extractPersonNames("WXV Global and Wallaroos Global Series updates"), []);
});

test("does not turn publisher or team labels into people", () => {
  assert.deepEqual(extractPersonNames("Irish Independent Leinster Rugby Planet Rugby"), []);
});
