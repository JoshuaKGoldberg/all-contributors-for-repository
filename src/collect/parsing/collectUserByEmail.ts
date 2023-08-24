import { Octokit } from "octokit";

export async function collectUserByEmail(email: string, octokit: Octokit) {
	return (await octokit.request("GET /search/users", { q: email })).data
		.items[0]?.login;
}
