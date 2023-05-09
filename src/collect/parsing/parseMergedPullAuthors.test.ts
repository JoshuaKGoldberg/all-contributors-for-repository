import { describe, expect, it } from "vitest";

import { parseMergedPullAuthors } from "./parseMergedPullAuthors.js";

describe("parseMergedPullAuthors", () => {
	it.each([
		[{ body: undefined, user: null }, []],
		[{ body: undefined, user: { login: "abc123" } }, ["abc123"]],
		[{ body: "feat: something", user: { login: "abc123" } }, ["abc123"]],
		[
			{
				body: "feat: something\nco-authored-by: not-a-github-username",
				user: { login: "abc123" },
			},
			["abc123"],
		],
		[
			{
				body: "feat: something\nco-authored-by: @def456",
				user: { login: "abc123" },
			},
			["abc123", "def456"],
		],
	])("given %j, returns %j", (mergedPull, expected) => {
		const result = parseMergedPullAuthors(mergedPull);

		expect(result).toEqual(expected);
	});
});
