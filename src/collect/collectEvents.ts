import { Octokit } from "octokit";

import { RequestDefaults, paginate } from "./api.js";

export type RepoEvent = Awaited<ReturnType<typeof collectEvents>>[number];

export async function collectEvents(
	defaults: RequestDefaults,
	octokit: Octokit,
) {
	const events = await paginate(defaults, async (options) => {
		const eventsResponse = await octokit.request(
			"GET /repos/{owner}/{repo}/events",
			{
				...options,
				state: "all",
			},
		);

		return eventsResponse.data;
	});

	return events;
}
