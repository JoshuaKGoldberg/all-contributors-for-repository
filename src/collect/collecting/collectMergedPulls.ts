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
	since?: Date,
) {
	const qualifiers = [
		`repo:${defaults.owner}/${defaults.repo}`,
		"is:pr",
		"is:merged",
		...(since ? [`merged:>=${since.toISOString()}`] : []),
	];

	return await paginate(
		octokit.paginate.iterator("GET /search/issues", {
			per_page: perPage,
			q: qualifiers.join("+"),
		}),
	);
}
