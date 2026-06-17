import { ContributorsCollection } from "../../ContributorsCollection.js";
import { AllContributorsForRepositoryOptions } from "../../options.js";
import { IssueEvent } from "../collecting/collectIssueEvents.js";
import { RepoEvent } from "../collecting/collectRepoEvents.js";
import { repoEventIsPullRequestReviewEvent } from "./repoEventIsPullRequestReviewEvent.js";

export function processContributors(
	issueEvents: IssueEvent[],
	repoEvents: Pick<RepoEvent, "type">[],
	options: Partial<AllContributorsForRepositoryOptions>,
) {
	const contributors = new ContributorsCollection({
		ignoredLoginPatterns: options.ignoredLoginPatterns,
		ignoredLogins: options.ignoredLogins,
	});
	const maintainers = new Set<string>();

	for (const issueEvent of issueEvents) {
		if (issueEvent.actor && issueEvent.issue) {
			contributors.add(
				issueEvent.actor.login,
				issueEvent.issue.number,
				"maintenance",
			);
			maintainers.add(issueEvent.actor.login);
		}
	}

	for (const repoEvent of repoEvents) {
		if (
			repoEventIsPullRequestReviewEvent(repoEvent) &&
			maintainers.has(repoEvent.actor.login)
		) {
			contributors.add(repoEvent.actor.login, repoEvent.issue.number, "review");
		}
	}

	return contributors;
}
