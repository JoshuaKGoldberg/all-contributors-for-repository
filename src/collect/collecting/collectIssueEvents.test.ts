import { describe, expect, it, vi } from "vitest";

import { PaginatingOctokit } from "../api.js";
import { collectIssueEvents } from "./collectIssueEvents.js";

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

describe("collectIssueEvents", () => {
	it("requests 100 items per page when collecting events", async () => {
		mockIterator.mockReturnValue(createPage([]));

		await collectIssueEvents(defaults, mockOctokit);

		expect(mockIterator).toHaveBeenCalledWith(
			"GET /repos/{owner}/{repo}/issues/events",
			{ ...defaults, per_page: 100 },
		);
	});

	it("returns [] when no existing issue data body includes events", async () => {
		mockIterator.mockReturnValue(createPage([]));

		const actual = await collectIssueEvents(defaults, mockOctokit);

		expect(actual).toEqual([]);
	});

	it("returns [] when existing issue data body includes only irrelevant events", async () => {
		mockIterator.mockReturnValue(
			createPage([{ event: "unrelated", id: "abc123" }]),
		);

		const actual = await collectIssueEvents(defaults, mockOctokit);

		expect(actual).toEqual([]);
	});

	it("includes the event when existing issue data body includes a relevant event", async () => {
		const issue = { event: "assigned", id: "abc123" };

		mockIterator.mockReturnValue(createPage([issue]));

		const actual = await collectIssueEvents(defaults, mockOctokit);

		expect(actual).toEqual([issue]);
	});
});
