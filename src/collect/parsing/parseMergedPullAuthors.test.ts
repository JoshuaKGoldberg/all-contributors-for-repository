import { describe, expect, it, vi } from "vitest";

import { parseMergedPullAuthors } from "./parseMergedPullAuthors.js";

describe("parseMergedPullAuthors", () => {
	it("returns an empty array when the pull has no user", async () => {
		const actual = await parseMergedPullAuthors({}, vi.fn());

		expect(actual).toEqual([]);
	});

	it("returns an empty array when the pull has a user with no login", async () => {
		const actual = await parseMergedPullAuthors({ user: {} }, vi.fn());

		expect(actual).toEqual([]);
	});

	it("returns the user login when the pull has a user with login", async () => {
		const login = "abc123";

		const actual = await parseMergedPullAuthors({ user: { login } }, vi.fn());

		expect(actual).toEqual([login]);
	});

	it("retrieves usernames when the PR has a body with co-authors", async () => {
		const username = "abc123";
		const cachingCoAuthorToUsername = vi.fn().mockResolvedValue(username);
		const actual = await parseMergedPullAuthors(
			{ body: "co-authored-by: ..." },
			cachingCoAuthorToUsername,
		);

		expect(actual).toEqual([username]);
	});
});
