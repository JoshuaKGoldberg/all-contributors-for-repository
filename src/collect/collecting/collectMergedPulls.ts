import {
	paginate,
	PaginatingOctokit,
	perPage,
	RequestDefaults,
} from "../api.js";

export type MergedPull = Awaited<ReturnType<typeof collectMergedPulls>>[number];

export async function collectMergedPulls(
	defaults: RequestDefaults,
	octokit: PaginatingOctokit,
) {
	return await paginate(
		octokit.paginate.iterator("GET /search/issues", {
			per_page: perPage,
			q: `repo:${defaults.owner}/${defaults.repo}+is:pr+is:merged`,
		}),
	);
}
