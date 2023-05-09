import { Octokit } from "octokit";

import { paginate, RequestDefaults } from "./api.js";

export async function collectMergedPulls(
	defaults: RequestDefaults,
	octokit: Octokit
) {
	return await paginate(defaults, async (options) => {
		const response = await octokit.request("GET /search/issues", {
			...options,
			q: "repo:JoshuaKGoldberg/template-typescript-node-package+is:pr+is:merged",
		});

		return response.data.items;
	});
}

export type MergedPull = Awaited<ReturnType<typeof collectMergedPulls>>[number];
