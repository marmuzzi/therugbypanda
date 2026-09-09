import assert from "node:assert/strict";
import { currentPackagePrefix, isCurrentPackageEditorialInputId } from "../lib/editorial/CurrentPackageIdentity.ts";

const date = "2026-09-09";
assert.equal(currentPackagePrefix(date), "current-2026-09-09-");
assert.equal(isCurrentPackageEditorialInputId("current-2026-09-09-abc123", date), true);
assert.equal(isCurrentPackageEditorialInputId("current-2026-09-01-abc123", date), false);
assert.equal(isCurrentPackageEditorialInputId("current-2026-09-02-abc123", date), false);
assert.equal(isCurrentPackageEditorialInputId("current-2026-09-090-abc123", date), false);
assert.equal(isCurrentPackageEditorialInputId(undefined, date), false);
console.log(JSON.stringify({ currentPackageIdentityRegression: "passed", date }, null, 2));
