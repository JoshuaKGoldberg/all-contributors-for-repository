import { describe, expect, it, vi } from "vitest";

import { PaginatingOctokit } from "../api.js";
import { collectPullFiles } from "./collectPullFiles.js";

const mockIterator = vi.fn();

const mockOctokit: PaginatingOctokit = {
	paginate: { iterator: mockIterator },
};

const defaults = {
	owner: "",
	repo: "",
};

async function* createPage(data: unknown[]) {
	yield await Promise.resolve({ data });
}

describe("collectPullFiles", () => {
	it("requests 100 items per page for the pull when collecting files", async () => {
		mockIterator.mockReturnValue(createPage([]));

		await collectPullFiles(defaults, mockOctokit, 123);

		expect(mockIterator).toHaveBeenCalledWith(
			"GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
			{ ...defaults, per_page: 100, pull_number: 123 },
		);
	});

	it("returns the files when the pull has files", async () => {
		const file = { filename: "src/index.ts" };

		mockIterator.mockReturnValue(createPage([file]));

		const actual = await collectPullFiles(defaults, mockOctokit, 123);

		expect(actual).toEqual([file]);
	});
});
