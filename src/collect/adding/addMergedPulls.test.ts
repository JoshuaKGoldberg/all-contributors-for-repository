import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";

import { MergedPull } from "../collecting/collectMergedPulls.js";
import { addMergedPulls } from "./addMergedPulls.js";

const mockCreateCachingCoAuthorToUsername = vi.fn();

vi.mock("co-author-to-username", () => ({
	get createCachingCoAuthorToUsername() {
		return mockCreateCachingCoAuthorToUsername;
	},
}));

const mockParseMergedPullAuthors = vi.fn();

vi.mock("../parsing/parseMergedPullAuthors.js", () => ({
	get parseMergedPullAuthors() {
		return mockParseMergedPullAuthors;
	},
}));

describe("addMergedPulls", () => {
	it("adds each contributor from parsed pull authors", async () => {
		const add = vi.fn();
		const mergedPull = {
			number: 123,
			title: "feat: add fancy feature",
		} as MergedPull;
		const author = { login: "abc123" };

		mockCreateCachingCoAuthorToUsername.mockResolvedValue([mergedPull]);
		mockParseMergedPullAuthors.mockResolvedValue([author]);

		await addMergedPulls([mergedPull], { add }, vi.fn() as unknown as Octokit);

		expect(add).toHaveBeenCalledWith(author, mergedPull.number, "code");
	});
});
