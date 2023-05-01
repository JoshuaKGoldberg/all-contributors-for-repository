import { ContributorsCollection } from "../ContributorsCollection.js";
import { AllContributorsForRepositoryOptions } from "../options.js";
import { createOctokit } from "./api.js";
import { collectAcceptedIssues } from "./collectAcceptedIssues.js";
import { collectEvents } from "./collectEvents.js";
import { collectIssueEvents } from "./collectIssueEvents.js";
import { collectMergedPulls } from "./collectMergedPulls.js";

export async function collect(options: AllContributorsForRepositoryOptions) {
	const octokit = createOctokit(options);
	const contributors = new ContributorsCollection(options.ignoredLogins);

	const [acceptedIssues, events, issueEvents, mergedPulls] = await Promise.all([
		collectAcceptedIssues(octokit, options.labelAcceptingPrs),
		collectEvents(octokit),
		collectIssueEvents(octokit),
		collectMergedPulls(octokit),
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
				contributors.add(acceptedIssue.user?.login, contribution);
			}
		}
	}

	// 💻 `code`: all PR authors and co-authors
	for (const mergedPull of mergedPulls) {
		contributors.add(mergedPull.user?.login, "code");

		for (const coAuthor of mergedPull.body
			?.match(/co-authored-by:.+/gi)
			?.map((text) => text.match(/@(\S+)/)) ?? []) {
			contributors.add(coAuthor?.[1], "code");
		}
	}

	// 🚧 `maintenance`: adding labels to issues and PRs, and merging PRs
	const maintainers = new Set<string>();

	for (const event of issueEvents) {
		if (event.actor) {
			contributors.add(event.actor.login, "maintenance");
			maintainers.add(event.actor.login);
		}
	}

	// 👀 `review`: submitting a review for a PR
	// (restricted just to users marked as maintainers)
	for (const event of events) {
		if (
			event.type === "PullRequestReviewEvent" &&
			maintainers.has(event.actor.login)
		) {
			contributors.add(event.actor.login, "review");
		}
	}

	return contributors.collect();
}
