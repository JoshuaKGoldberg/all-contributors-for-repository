import { describe, expect, it } from "vitest";

import { IssueEvent } from "../collecting/collectIssueEvents.js";
import { RepoEvent } from "../collecting/collectRepoEvents.js";
import { processContributors } from "./processContributors.js";

const fakeOptions = { ignoredLogins: new Set(["ignored-login"]) };

describe("processContributors", () => {
	it("adds a contributor as a maintainer when they accept an issue", () => {
		const issueId = 1;
		const login = "abc123";

		const contributors = processContributors(
			[{ actor: { login }, issue: { number: issueId } } as IssueEvent],
			[],
			fakeOptions,
		);

		expect(contributors.collect()).toEqual({
			[login]: { maintenance: [issueId] },
		});
	});

	it("adds a contributor as a reviewer when they review a PR", () => {
		const issueId = 1;
		const login = "abc123";

		const contributors = processContributors(
			[{ actor: { login }, issue: { number: issueId } } as IssueEvent],
			[
				{
					actor: { login },
					issue: { number: issueId },
					type: "PullRequestReviewEvent",
				} as Pick<RepoEvent, "type">,
			],
			fakeOptions,
		);

		expect(contributors.collect()).toEqual({
			[login]: { maintenance: [issueId], review: [issueId] },
		});
	});
});
