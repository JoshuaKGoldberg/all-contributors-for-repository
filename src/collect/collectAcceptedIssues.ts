import { Octokit } from "octokit";

import { paginate, RequestDefaults } from "./api.js";

export async function collectAcceptedIssues(
	defaults: RequestDefaults,
	octokit: Octokit,
	labelAcceptingPrs: string
) {
	const issues = await paginate(defaults, async (options) => {
		const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
			...options,
			labels: labelAcceptingPrs,
			state: "all",
		});
		return response.data;
	});

	return Object.fromEntries(issues.map((issue) => [issue.number, issue]));
}
