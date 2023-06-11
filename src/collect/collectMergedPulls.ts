import { Octokit } from "octokit";

import { paginate, RequestDefaults } from "./api.js";

export async function collectMergedPulls(
	defaults: RequestDefaults,
	octokit: Octokit
) {
	return await paginate(defaults, async (options) => {
		const response = await octokit.request("GET /search/issues", {
			...options,
			q: `repo:${defaults.owner}/${defaults.repo}+is:pr+is:merged`,
		});

		return response.data.items;
	});
}
