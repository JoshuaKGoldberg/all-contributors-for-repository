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
							login: "Accepted-Issue-User",
						},
					},
				],
			};
		case "GET /repos/{owner}/{repo}/issues/events":
			return {
				data: [
					{
						actor: {
							login: "Issue-Event-User",
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
								login: "Merged-Pull-User",
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
							login: "Issue-Event-User",
						},
						issue: {
							number: 222,
						},
						type: "Pull-Request-Review-Event",
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
			  "accepted-issue-user": {
			    "bug": [
			      111,
			    ],
			  },
			  "issue-event-user": {
			    "maintenance": [
			      222,
			    ],
			  },
			  "merged-pull-user": {
			    "code": [
			      333,
			    ],
			  },
			}
		`);
	});
});
