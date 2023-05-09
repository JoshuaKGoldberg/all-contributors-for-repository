import { describe, expect, it } from "vitest";

import { parseMergedPullType } from "./parseMergedPullType.js";

describe("parseMergedPullType", () => {
	it.each([
		[".", "code"],
		["chore: ...", "code"],
		["build: fix a thing", "infra"],
		["ci: ...", "infra"],
		["docs: ...", "doc"],
		["test: ...", "test"],
	])("given %s, returns %j", (mergedPull, expected) => {
		const result = parseMergedPullType(mergedPull);

		expect(result).toEqual(expected);
	});
});
