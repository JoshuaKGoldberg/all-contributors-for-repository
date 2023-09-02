import { Octokit } from "octokit";

import { RequestDefaults, paginate } from "./api.js";

const relevantIssueEvents = new Set([
	"assigned",
	"locked",
	"merged",
	"pinned",
	"unlocked",
]);

export async function collectIssueEvents(
	defaults: RequestDefaults,
	octokit: Octokit,
) {
	const issueEvents = await paginate(defaults, async (options) => {
		const response = await octokit.request(
			"GET /repos/{owner}/{repo}/issues/events",
			{
				...options,
				state: "all",
			},
		);
		return response.data;
	});

	return issueEvents.filter((issueEvent) =>
		relevantIssueEvents.has(issueEvent.event),
	);
}
