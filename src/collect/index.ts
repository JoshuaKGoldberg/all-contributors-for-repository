import { ContributorsContributions } from "../ContributorsCollection.js";
import { AllContributorsForRepositoryOptions } from "../options.js";
import { addAcceptedIssues } from "./adding/addAcceptedIssues.js";
import { addMergedPulls } from "./adding/addMergedPulls.js";
import { createOctokit } from "./api.js";
import { collectAcceptedIssues } from "./collecting/collectAcceptedIssues.js";
import { collectIssueEvents } from "./collecting/collectIssueEvents.js";
import { collectMergedPulls } from "./collecting/collectMergedPulls.js";
import { collectRepoEvents } from "./collecting/collectRepoEvents.js";
import { processContributors } from "./processing/processContributors.js";

export async function collect(
	options: AllContributorsForRepositoryOptions,
): Promise<ContributorsContributions> {
	const defaults = { owner: options.owner, repo: options.repo };
	const octokit = createOctokit(options.auth);

	// 1. Collect event data from the GitHub API
	const [acceptedIssues, issueEvents, mergedPulls, repoEvents] =
		await Promise.all([
			collectAcceptedIssues(defaults, octokit, options.labelAcceptingPrs),
			collectIssueEvents(defaults, octokit),
			collectMergedPulls(defaults, octokit),
			collectRepoEvents(defaults, octokit),
		]);

	// 2. Process individual contributors from those events
	const contributors = processContributors(issueEvents, repoEvents, options);

	// 3. Add additional contributors based on issues and pulls
	addAcceptedIssues(Object.values(acceptedIssues), contributors, options);
	await addMergedPulls(mergedPulls, contributors, octokit);

	// 4. Collect the contributions under each contributor
	return contributors.collect();
}
