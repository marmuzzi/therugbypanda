import assert from "node:assert/strict";
import test from "node:test";
import { assessPositionFreshness, selectFreshPositions, type EditorialPosition } from "./StoryFreshness.ts";

const previous: EditorialPosition = {
  id: "yesterday-crowley",
  subject: "Jack Crowley and Munster",
  development: "Jack Crowley extended absence leaves Munster assessing out-half depth",
  angle: "What Crowley's absence means for Munster's early-season selection",
};

test("rejects a same-story rewrite from a different source/headline", () => {
  const candidate: EditorialPosition = {
    id: "today-crowley-rewrite",
    subject: "Munster Jack Crowley",
    development: "Munster face out-half depth question after Jack Crowley absence is extended",
    angle: "Munster selection options while Crowley remains absent",
  };
  assert.equal(assessPositionFreshness(candidate, [previous]).fresh, false);
});

test("allows the same subject when there is a genuinely different development", () => {
  const candidate: EditorialPosition = {
    id: "crowley-return",
    subject: "Jack Crowley and Munster",
    development: "Jack Crowley returns to full training and is cleared to start",
    angle: "How Crowley's return changes Munster's attacking selection",
  };
  assert.equal(assessPositionFreshness(candidate, [previous]).fresh, true);
});

test("allows progressive coverage of the same match across distinct phases", () => {
  const preview: EditorialPosition = {
    id: "leinster-zebre-preview",
    subject: "Leinster v Zebre",
    development: "Leinster v Zebre match preview and build-up ahead of Saturday",
    angle: "Pre-match questions and what to expect",
  };
  const selection: EditorialPosition = {
    id: "leinster-zebre-selection",
    subject: "Leinster v Zebre",
    development: "Leinster name the starting XV and matchday 23 for Zebre",
    angle: "What the team selection tells us",
  };
  const result: EditorialPosition = {
    id: "leinster-zebre-result",
    subject: "Leinster v Zebre",
    development: "Leinster beat Zebre at full-time with the final score confirmed",
    angle: "How the match was won",
  };
  assert.equal(assessPositionFreshness(selection, [preview]).fresh, true);
  assert.equal(assessPositionFreshness(result, [preview, selection]).fresh, true);
});

test("still rejects rewrites within the same match phase", () => {
  const first: EditorialPosition = {
    id: "leinster-zebre-selection-a",
    subject: "Leinster v Zebre",
    development: "Leinster name the starting XV and matchday 23 for Zebre",
    angle: "Selection calls for Saturday",
  };
  const rewrite: EditorialPosition = {
    id: "leinster-zebre-selection-b",
    subject: "Leinster v Zebre",
    development: "Leinster starting XV and matchday 23 named for Zebre",
    angle: "Saturday selection calls",
  };
  assert.equal(assessPositionFreshness(rewrite, [first]).fresh, false);
});

test("selects exactly five distinct positions and rejects within-package duplicates", () => {
  const candidates: EditorialPosition[] = [
    previous,
    { ...previous, id: "duplicate", angle: "Munster options during Crowley absence" },
    { id: "hansen", subject: "Mack Hansen Connacht", development: "Hansen returns for Connacht", angle: "Back-three impact" },
    { id: "cullen", subject: "Leo Cullen Leinster", development: "Leinster succession timing", angle: "Coaching succession" },
    { id: "women", subject: "Munster Leinster Women", development: "Interpro final selection", angle: "Final selection stakes" },
    { id: "larochelle", subject: "Munster La Rochelle", development: "Munster split preseason squads", angle: "Two-team preseason plan" },
    { id: "ulster", subject: "Ulster Rugby", development: "New academy intake announced", angle: "Pathway depth" },
  ];
  const result = selectFreshPositions(candidates, [], 5);
  assert.equal(result.selected.length, 5);
  assert.equal(result.rejected.some((item) => item.position.id === "duplicate"), true);
});
