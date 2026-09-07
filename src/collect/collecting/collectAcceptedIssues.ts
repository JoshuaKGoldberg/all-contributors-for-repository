import {
	paginate,
	PaginatingOctokit,
	perPage,
	RequestDefaults,
} from "../api.js";

export type AcceptedIssue = Awaited<
	ReturnType<typeof collectAcceptedIssues>
>[number];

export async function collectAcceptedIssues(
	defaults: RequestDefaults,
	octokit: PaginatingOctokit,
	labelAcceptingPrs: string,
) {
	const issues = await paginate(
		octokit.paginate.iterator("GET /repos/{owner}/{repo}/issues", {
			...defaults,
			labels: labelAcceptingPrs,
			per_page: perPage,
			state: "all",
		}),
	);

	return issues;
}
