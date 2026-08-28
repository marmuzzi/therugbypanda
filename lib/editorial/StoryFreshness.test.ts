import { describe, expect, it } from "vitest";
import { assessPositionFreshness, selectFreshPositions, type EditorialPosition } from "./StoryFreshness";

const previous: EditorialPosition = {
  id: "yesterday-crowley",
  subject: "Jack Crowley and Munster",
  development: "Jack Crowley extended absence leaves Munster assessing out-half depth",
  angle: "What Crowley's absence means for Munster's early-season selection",
};

describe("StoryFreshness", () => {
  it("rejects a same-story rewrite from a different source/headline", () => {
    const candidate: EditorialPosition = {
      id: "today-crowley-rewrite",
      subject: "Munster Jack Crowley",
      development: "Munster face out-half depth question after Jack Crowley absence is extended",
      angle: "Munster selection options while Crowley remains absent",
    };
    expect(assessPositionFreshness(candidate, [previous]).fresh).toBe(false);
  });

  it("allows the same subject when there is a genuinely different development", () => {
    const candidate: EditorialPosition = {
      id: "crowley-return",
      subject: "Jack Crowley and Munster",
      development: "Jack Crowley returns to full training and is cleared to start",
      angle: "How Crowley's return changes Munster's attacking selection",
    };
    expect(assessPositionFreshness(candidate, [previous]).fresh).toBe(true);
  });

  it("selects exactly five distinct positions and rejects within-package duplicates", () => {
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
    expect(result.selected).toHaveLength(5);
    expect(result.rejected.map((item) => item.position.id)).toContain("duplicate");
  });
});
