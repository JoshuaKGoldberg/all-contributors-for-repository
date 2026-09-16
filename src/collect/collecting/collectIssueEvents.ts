import {
	paginate,
	PaginatingOctokit,
	perPage,
	RequestDefaults,
} from "../api.js";

const relevantIssueEvents = new Set([
	"assigned",
	"locked",
	"merged",
	"pinned",
	"unlocked",
]);

export type IssueEvent = Awaited<ReturnType<typeof collectIssueEvents>>[number];

export async function collectIssueEvents(
	defaults: RequestDefaults,
	octokit: PaginatingOctokit,
) {
	const issueEvents = await paginate(
		octokit.paginate.iterator("GET /repos/{owner}/{repo}/issues/events", {
			...defaults,
			per_page: perPage,
		}),
	);

	return issueEvents.filter((issueEvent) =>
		relevantIssueEvents.has(issueEvent.event),
	);
}
