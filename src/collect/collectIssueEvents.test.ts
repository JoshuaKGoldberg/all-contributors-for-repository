import { describe, expect, it, vi } from "vitest";

import { collectIssueEvents } from "./collectIssueEvents.js";

const mockRequest = vi.fn();

const mockOctokit = { request: mockRequest } as unknown as Parameters<
	typeof collectIssueEvents
>[1];

const defaults = {
	owner: "",
	repo: "",
};

describe("collectIssueEvents", () => {
	it("returns [] when no existing issue data body includes events", async () => {
		mockRequest.mockResolvedValue({
			data: [],
		});

		const actual = await collectIssueEvents(defaults, mockOctokit);

		expect(actual).toEqual([]);
	});

	it("returns [] when existing issue data body includes only irrelevant events", async () => {
		const issue = { event: "unrelated", id: "abc123" };
		mockRequest.mockResolvedValue({
			data: [issue],
		});

		const actual = await collectIssueEvents(defaults, mockOctokit);

		expect(actual).toEqual([]);
	});

	it("includes the event when existing issue data body includes a relevant event", async () => {
		const issue = { event: "assigned", id: "abc123" };
		mockRequest.mockResolvedValue({
			data: [issue],
		});

		const actual = await collectIssueEvents(defaults, mockOctokit);

		expect(actual).toEqual([issue]);
	});
});
