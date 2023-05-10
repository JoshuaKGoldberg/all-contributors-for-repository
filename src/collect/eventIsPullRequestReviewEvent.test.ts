import { describe, expect, it } from "vitest";

import { eventIsPullRequestReviewEvent } from "./eventIsPullRequestReviewEvent.js";

describe("eventIsPullRequestReviewEvent", () => {
	it.each([
		[{ type: "other" }, false],
		[{ issue: {}, type: "other" }, false],
		[{ issue: { number: 1 }, type: "other" }, false],
		[{ type: "PullRequestReviewEvent" }, false],
		[{ issue: { number: 1 }, type: "PullRequestReviewEvent" }, true],
	])("when given %j, returns %s", (event, expected) => {
		const actual = eventIsPullRequestReviewEvent(event);

		expect(actual).toBe(expected);
	});
});
