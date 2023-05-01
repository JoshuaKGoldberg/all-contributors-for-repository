import { Octokit } from "octokit";

import { paginate } from "./api.js";

const relevantIssueEvents = new Set([
	"assigned",
	"locked",
	"merged",
	"pinned",
	"unlocked",
]);

export async function collectIssueEvents(octokit: Octokit) {
	const issueEvents = await paginate(async (page, perPage) => {
		const response = await octokit.request(
			"GET /repos/{owner}/{repo}/issues/events",
			{
				headers: {
					"X-GitHub-Api-Version": "2022-11-28",
				},
				owner: "JoshuaKGoldberg",
				page,
				per_page: perPage,
				repo: "template-typescript-node-package",
				state: "all",
			}
		);
		return response.data;
	});

	return issueEvents.filter((issueEvent) =>
		relevantIssueEvents.has(issueEvent.event)
	);
}
