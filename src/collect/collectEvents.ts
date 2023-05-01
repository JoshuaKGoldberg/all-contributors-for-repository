import { Octokit } from "octokit";

import { paginate, RequestDefaults } from "./api.js";

export async function collectEvents(
	defaults: RequestDefaults,
	octokit: Octokit
) {
	const events = await paginate(defaults, async (options) => {
		const eventsResponse = await octokit.request(
			"GET /repos/{owner}/{repo}/events",
			{
				...options,
				state: "all",
			}
		);

		return eventsResponse.data;
	});

	return events;
}
