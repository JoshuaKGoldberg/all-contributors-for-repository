import { describe, expect, it, vi } from "vitest";

import { PaginatingOctokit } from "../api.js";
import { collectAcceptedIssues } from "./collectAcceptedIssues.js";

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

describe("collectAcceptedIssues", () => {
	it("requests all issues with the label when since is not provided", async () => {
		mockIterator.mockReturnValue(createPage([]));

		await collectAcceptedIssues(defaults, mockOctokit, "accepting prs");

		expect(mockIterator).toHaveBeenCalledWith(
			"GET /repos/{owner}/{repo}/issues",
			{ ...defaults, labels: "accepting prs", per_page: 100, state: "all" },
		);
	});

	it("requests only issues updated since the date when since is provided", async () => {
		mockIterator.mockReturnValue(createPage([]));

		await collectAcceptedIssues(
			defaults,
			mockOctokit,
			"accepting prs",
			new Date("2026-01-02T00:00:00Z"),
		);

		expect(mockIterator).toHaveBeenCalledWith(
			"GET /repos/{owner}/{repo}/issues",
			{
				...defaults,
				labels: "accepting prs",
				per_page: 100,
				since: "2026-01-02T00:00:00.000Z",
				state: "all",
			},
		);
	});
});
