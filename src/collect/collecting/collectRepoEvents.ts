import {
	paginate,
	PaginatingOctokit,
	perPage,
	RequestDefaults,
} from "../api.js";

export type RepoEvent = Awaited<ReturnType<typeof collectRepoEvents>>[number];

export async function collectRepoEvents(
	defaults: RequestDefaults,
	octokit: PaginatingOctokit,
	since?: Date,
) {
	return await paginate(
		octokit.paginate.iterator("GET /repos/{owner}/{repo}/events", {
			...defaults,
			per_page: perPage,
		}),
		{ since, timestampOf: (repoEvent) => repoEvent.created_at },
	);
}
