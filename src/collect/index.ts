import { CachingMap } from "../CachingMap.js";
import {
	ContributorsCollection,
	ContributorsContributions,
} from "../ContributorsCollection.js";
import { AllContributorsForRepositoryOptions } from "../options.js";
import { createOctokit } from "./api.js";
import { collectAcceptedIssues } from "./collectAcceptedIssues.js";
import { collectEvents } from "./collectEvents.js";
import { collectIssueEvents } from "./collectIssueEvents.js";
import { collectMergedPulls } from "./collectMergedPulls.js";
import { eventIsPullRequestReviewEvent } from "./eventIsPullRequestReviewEvent.js";
import { collectUserByEmail } from "./parsing/collectUserByEmail.js";
import { parseMergedPullAuthors } from "./parsing/parseMergedPullAuthors.js";
import { parseMergedPullType } from "./parsing/parseMergedPullType.js";

export async function collect(
	options: AllContributorsForRepositoryOptions
): Promise<ContributorsContributions> {
	const contributors = new ContributorsCollection(options.ignoredLogins);
	const defaults = { owner: options.owner, repo: options.repo };
	const octokit = createOctokit(options.auth);

	const [acceptedIssues, events, issueEvents, mergedPulls] = await Promise.all([
		collectAcceptedIssues(defaults, octokit, options.labelAcceptingPrs),
		collectEvents(defaults, octokit),
		collectIssueEvents(defaults, octokit),
		collectMergedPulls(defaults, octokit),
	]);

	for (const acceptedIssue of Object.values(acceptedIssues)) {
		const labels = acceptedIssue.labels.map((label) =>
			typeof label === "string" ? label : label.name
		);

		for (const [labelType, contribution] of [
			// 🐛 `bug`: anybody who filed an issue labeled as accepting PRs and a bug
			[options.labelTypeBug, "bug"],
			// - 📖 `doc`: authors of merged PRs that address issues labeled as docs
			[options.labelTypeDocs, "docs"],
			// - 🔧 `tool`: authors of merged PRs that address issues labeled as tooling
			[options.labelTypeTool, "tool"],
		]) {
			if (labels.some((label) => label === labelType)) {
				contributors.add(
					acceptedIssue.user?.login,
					acceptedIssue.number,
					contribution
				);
			}
		}
	}

	// 💻 `code` & others: all PR authors and co-authors
	const authorsByEmailCache = new CachingMap(
		async (email: string) => await collectUserByEmail(email, octokit)
	);
	for (const mergedPull of mergedPulls) {
		const authors = await parseMergedPullAuthors(
			mergedPull,
			authorsByEmailCache
		);
		const type = parseMergedPullType(mergedPull.title);

		for (const author of authors) {
			contributors.add(author, mergedPull.number, type);
		}
	}

	// 🚧 `maintenance`: adding labels to issues and PRs, and merging PRs
	const maintainers = new Set<string>();

	for (const event of issueEvents) {
		if (event.actor && event.issue) {
			contributors.add(event.actor.login, event.issue.number, "maintenance");
			maintainers.add(event.actor.login);
		}
	}

	// 👀 `review`: submitting a review for a PR
	// (restricted just to users marked as maintainers)
	for (const event of events) {
		if (
			eventIsPullRequestReviewEvent(event) &&
			maintainers.has(event.actor.login)
		) {
			contributors.add(event.actor.login, event.issue.number, "review");
		}
	}

	return contributors.collect();
}
