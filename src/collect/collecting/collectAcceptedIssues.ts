import {
	paginate,
	PaginatingOctokit,
	perPage,
	RequestDefaults,
} from "../api.ts";

export type AcceptedIssue = Awaited<
	ReturnType<typeof collectAcceptedIssues>
>[number];

export async function collectAcceptedIssues(
	defaults: RequestDefaults,
	octokit: PaginatingOctokit,
	labelAcceptingPrs: string,
	since?: Date,
) {
	const issues = await paginate(
		octokit.paginate.iterator("GET /repos/{owner}/{repo}/issues", {
			...defaults,
			labels: labelAcceptingPrs,
			per_page: perPage,
			...(since && { since: since.toISOString() }),
			state: "all",
		}),
	);

	return issues;
}
