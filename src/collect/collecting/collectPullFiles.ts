import {
	paginate,
	PaginatingOctokit,
	perPage,
	RequestDefaults,
} from "../api.js";

export type PullFile = Awaited<ReturnType<typeof collectPullFiles>>[number];

export async function collectPullFiles(
	defaults: RequestDefaults,
	octokit: PaginatingOctokit,
	pullNumber: number,
) {
	return await paginate(
		octokit.paginate.iterator(
			"GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
			{
				...defaults,
				per_page: perPage,
				pull_number: pullNumber,
			},
		),
	);
}
