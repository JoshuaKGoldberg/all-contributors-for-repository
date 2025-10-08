import { Octokit } from "octokit";

import { paginate, RequestDefaults } from "../api.js";

export type AcceptedIssue = Awaited<
	ReturnType<typeof collectAcceptedIssues>
>[number];

export async function collectAcceptedIssues(
	defaults: RequestDefaults,
	octokit: Octokit,
	labelAcceptingPrs: string,
) {
	const issues = await paginate(defaults, async (requestOptions) => {
		const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
			...requestOptions,
			labels: labelAcceptingPrs,
			state: "all",
		});
		return response.data;
	});

	return issues;
}
