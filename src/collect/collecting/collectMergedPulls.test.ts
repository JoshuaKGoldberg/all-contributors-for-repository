import { describe, expect, it, vi } from "vitest";

import { PaginatingOctokit } from "../api.js";
import { collectMergedPulls } from "./collectMergedPulls.js";

const mockIterator = vi.fn();

const mockOctokit: PaginatingOctokit = {
	paginate: { iterator: mockIterator },
};

const defaults = {
	owner: "fake-owner",
	repo: "fake-repo",
};

async function* createPage(data: unknown[]) {
	yield await Promise.resolve({ data });
}

describe("collectMergedPulls", () => {
	it("searches all merged pulls when since is not provided", async () => {
		mockIterator.mockReturnValue(createPage([]));

		await collectMergedPulls(defaults, mockOctokit);

		expect(mockIterator).toHaveBeenCalledWith("GET /search/issues", {
			per_page: 100,
			q: "repo:fake-owner/fake-repo+is:pr+is:merged",
		});
	});

	it("searches only pulls merged since the date when since is provided", async () => {
		mockIterator.mockReturnValue(createPage([]));

		await collectMergedPulls(
			defaults,
			mockOctokit,
			new Date("2026-01-02T00:00:00Z"),
		);

		expect(mockIterator).toHaveBeenCalledWith("GET /search/issues", {
			per_page: 100,
			q: "repo:fake-owner/fake-repo+is:pr+is:merged+merged:>=2026-01-02T00:00:00.000Z",
		});
	});
});
