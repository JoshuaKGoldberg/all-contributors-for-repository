import { describe, expect, it, vi } from "vitest";

import { PaginatingOctokit } from "../api.js";
import { collectRepoEvents } from "./collectRepoEvents.js";

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

describe("collectRepoEvents", () => {
	it("returns all events when since is not provided", async () => {
		const events = [
			{ created_at: "2026-01-03T00:00:00Z", type: "PushEvent" },
			{ created_at: "2026-01-01T00:00:00Z", type: "PushEvent" },
		];

		mockIterator.mockReturnValue(createPage(events));

		const actual = await collectRepoEvents(defaults, mockOctokit);

		expect(actual).toEqual(events);
	});

	it("excludes events from before since when since is provided", async () => {
		const recent = { created_at: "2026-01-03T00:00:00Z", type: "PushEvent" };
		const old = { created_at: "2026-01-01T00:00:00Z", type: "PushEvent" };

		mockIterator.mockReturnValue(createPage([recent, old]));

		const actual = await collectRepoEvents(
			defaults,
			mockOctokit,
			new Date("2026-01-02"),
		);

		expect(actual).toEqual([recent]);
	});
});
