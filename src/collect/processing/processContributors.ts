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
	const contributors = new ContributorsCollection(options.ignoredLogins);
	const maintainers = new Set<string>();

	for (const issueEvent of issueEvents) {
		const login = getMaintainerLogin(issueEvent);
		if (login && issueEvent.issue) {
			contributors.add(login, issueEvent.issue.number, "maintenance");
			maintainers.add(login);
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

/**
 * The GitHub API reports the assignee, not the assigner, as the actor of an
 * "assigned" issue event. Being assigned an issue doesn't require any repo
 * permissions, so the maintenance credit belongs to whoever did the assigning.
 */
function getMaintainerLogin(issueEvent: IssueEvent) {
	return issueEvent.event === "assigned"
		? issueEvent.assigner?.login
		: issueEvent.actor?.login;
}
