import { describe, expect, it } from "vitest";

import { CachingMap } from "../../CachingMap.js";
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
		[
			{
				body: "feat: something\nco-authored-by: @def456 <ghi@jkl.com>",
				user: { login: "abc123" },
			},
			["abc123", "def456"],
		],
		[
			{
				body: "feat: something\nco-authored-by: Username <def456@ghi.com>",
				user: { login: "abc123" },
			},
			["abc123", "def456"],
		],
		[
			{
				body: "feat: something\nco-authored-by: Username <def456@ghi.com>\nco-authored-by: Username <def456@ghi.com>",
				user: { login: "abc123" },
			},
			["abc123", "def456"],
		],
	])("given %j, returns %j", async (mergedPull, expected) => {
		const result = await parseMergedPullAuthors(
			mergedPull,
			new CachingMap((key: string) => Promise.resolve(key.split("@")[0])),
		);

		expect(result).toEqual(expected);
	});
});
