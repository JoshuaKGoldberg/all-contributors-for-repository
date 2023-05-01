import { Octokit } from "octokit";

import { paginate } from "./api.js";

export async function collectAcceptedIssues(
	octokit: Octokit,
	labelAcceptingPrs: string
) {
	const issues = await paginate(async (page, perPage) => {
		const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
			labels: labelAcceptingPrs,
			owner: "JoshuaKGoldberg",
			page,
			per_page: perPage,
			repo: "template-typescript-node-package",
			state: "all",
		});
		return response.data;
	});

	return Object.fromEntries(issues.map((issue) => [issue.number, issue]));
}
