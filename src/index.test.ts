import { describe, expect, test, vi } from "vitest";

import { getAllContributorsForRepository } from "./index.js";

const mockRequest = (url: string) => {
	switch (url) {
		case "GET /repos/{owner}/{repo}/issues":
			return {
				data: [
					{
						labels: ["type: bug"],
						number: 111,
						user: {
							login: "AcceptedIssueUser",
						},
					},
				],
			};
		case "GET /repos/{owner}/{repo}/issues/events":
			return {
				data: [
					{
						actor: {
							login: "IssueEventUser",
						},
						event: "assigned",
						issue: {
							number: 222,
						},
					},
				],
			};
		case "GET /search/issues":
			return {
				data: {
					items: [
						{
							number: 333,
							title: "feat: Merged PR",
							user: {
								login: "MergedPullUser",
							},
						},
					],
				},
			};
		case "GET /repos/{owner}/{repo}/events":
			return {
				data: [
					{
						actor: {
							login: "IssueEventUser",
						},
						issue: {
							number: 222,
						},
						type: "PullRequestReviewEvent",
					},
				],
			};
	}
};

vi.mock("octokit", () => ({
	get Octokit() {
		return class MockOctokit {
			static defaults = () => MockOctokit;

			request = mockRequest;
		};
	},
}));

describe("end-to-end", () => {
	test("getAllContributorsForRepository", async () => {
		const actual = await getAllContributorsForRepository({
			owner: "TestOwner",
			repo: "test-repository",
		});

		expect(actual).toMatchInlineSnapshot(`
			{
			  "acceptedissueuser": {
			    "bug": [
			      111,
			    ],
			  },
			  "issueeventuser": {
			    "maintenance": [
			      222,
			    ],
			    "review": [
			      222,
			    ],
			  },
			  "mergedpulluser": {
			    "code": [
			      333,
			    ],
			  },
			}
		`);
	});
});
