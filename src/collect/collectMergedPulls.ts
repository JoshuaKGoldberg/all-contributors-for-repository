import { Octokit } from "octokit";

import { paginate } from "./api.js";

export async function collectMergedPulls(octokit: Octokit) {
	return await paginate(async (page, perPage) => {
		const response = await octokit.request("GET /search/issues", {
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
			q: "repo:JoshuaKGoldberg/template-typescript-node-package+is:pr+is:merged",
			page,
			per_page: perPage,
			state: "closed",
		});

		return response.data.items;
	});
}
