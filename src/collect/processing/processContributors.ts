import { ContributorsCollection } from "../../ContributorsCollection.ts";
import { AllContributorsForRepositoryOptions } from "../../options.ts";
import { IssueEvent } from "../collecting/collectIssueEvents.ts";
import { RepoEvent } from "../collecting/collectRepoEvents.ts";
import { repoEventIsPullRequestReviewEvent } from "./repoEventIsPullRequestReviewEvent.ts";

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

function getMaintainerLogin(issueEvent: IssueEvent) {
	return issueEvent.event === "assigned"
		? issueEvent.assigner?.login
		: issueEvent.actor?.login;
}
