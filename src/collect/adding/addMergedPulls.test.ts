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

const mockCollectPullFiles = vi.fn();

vi.mock("../collecting/collectPullFiles.js", () => ({
	get collectPullFiles() {
		return mockCollectPullFiles;
	},
}));

const mockParseMergedPullAuthors = vi.fn();

vi.mock("../parsing/parseMergedPullAuthors.js", () => ({
	get parseMergedPullAuthors() {
		return mockParseMergedPullAuthors;
	},
}));

const octokit = vi.fn() as unknown as Octokit;

const options = {
	owner: "TestOwner",
	repo: "test-repository",
	testFiles: [/\.test\.ts$/],
};

const author = { login: "abc123" };

describe("addMergedPulls", () => {
	it("adds each contributor from parsed pull authors", async () => {
		const add = vi.fn();
		const mergedPull = {
			number: 123,
			title: "feat: add fancy feature",
		} as MergedPull;

		mockCollectPullFiles.mockResolvedValue([{ filename: "src/index.ts" }]);
		mockParseMergedPullAuthors.mockResolvedValue([author]);

		await addMergedPulls([mergedPull], { add }, octokit, options);

		expect(add).toHaveBeenCalledExactlyOnceWith(
			author,
			mergedPull.number,
			"code",
		);
	});

	it("adds a test contribution when the pull touches a test file", async () => {
		const add = vi.fn();
		const mergedPull = {
			number: 123,
			title: "feat: add fancy feature",
		} as MergedPull;

		mockCollectPullFiles.mockResolvedValue([
			{ filename: "src/index.ts" },
			{ filename: "src/index.test.ts" },
		]);
		mockParseMergedPullAuthors.mockResolvedValue([author]);

		await addMergedPulls([mergedPull], { add }, octokit, options);

		expect(add.mock.calls).toEqual([
			[author, mergedPull.number, "code"],
			[author, mergedPull.number, "test"],
		]);
		expect(mockCollectPullFiles).toHaveBeenCalledExactlyOnceWith(
			{ owner: options.owner, repo: options.repo },
			octokit,
			mergedPull.number,
		);
	});

	it("doesn't collect files when the pull title already indicates a test", async () => {
		const add = vi.fn();
		const mergedPull = {
			number: 123,
			title: "test: add fancy tests",
		} as MergedPull;

		mockParseMergedPullAuthors.mockResolvedValue([author]);

		await addMergedPulls([mergedPull], { add }, octokit, options);

		expect(add).toHaveBeenCalledExactlyOnceWith(
			author,
			mergedPull.number,
			"test",
		);
		expect(mockCollectPullFiles).not.toHaveBeenCalled();
	});

	it("doesn't collect files when there are no test file patterns", async () => {
		const add = vi.fn();
		const mergedPull = {
			number: 123,
			title: "feat: add fancy feature",
		} as MergedPull;

		mockParseMergedPullAuthors.mockResolvedValue([author]);

		await addMergedPulls([mergedPull], { add }, octokit, {
			...options,
			testFiles: [],
		});

		expect(add).toHaveBeenCalledExactlyOnceWith(
			author,
			mergedPull.number,
			"code",
		);
		expect(mockCollectPullFiles).not.toHaveBeenCalled();
	});
});
