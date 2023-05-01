import { Octokit } from "octokit";

export async function collectEvents(octokit: Octokit) {
	const eventsResponse = await octokit.request(
		"GET /repos/{owner}/{repo}/events",
		{
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
			owner: "JoshuaKGoldberg",
			per_page: 100,
			repo: "template-typescript-node-package",
			state: "all",
		}
	);

	return eventsResponse.data;
}
