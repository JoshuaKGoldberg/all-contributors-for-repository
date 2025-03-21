import { Octokit } from "octokit";

import { paginate, RequestDefaults } from "../api.js";

export type RepoEvent = Awaited<ReturnType<typeof collectRepoEvents>>[number];

export async function collectRepoEvents(
	defaults: RequestDefaults,
	octokit: Octokit,
) {
	return await paginate(defaults, async (options) => {
		const eventsResponse = await octokit.request(
			"GET /repos/{owner}/{repo}/events",
			{
				...options,
				state: "all",
			},
		);

		return eventsResponse.data;
	});
}
