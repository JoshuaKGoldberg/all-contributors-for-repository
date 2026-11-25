import { ContributorsContributions } from "../ContributorsCollection.ts";
import { AllContributorsForRepositoryOptions } from "../options.ts";
import { addAcceptedIssues } from "./adding/addAcceptedIssues.ts";
import { addMergedPulls } from "./adding/addMergedPulls.ts";
import { createOctokit } from "./api.ts";
import { collectAcceptedIssues } from "./collecting/collectAcceptedIssues.ts";
import { collectIssueEvents } from "./collecting/collectIssueEvents.ts";
import { collectMergedPulls } from "./collecting/collectMergedPulls.ts";
import { collectRepoEvents } from "./collecting/collectRepoEvents.ts";
import { processContributors } from "./processing/processContributors.ts";

export async function collect(
	options: AllContributorsForRepositoryOptions,
): Promise<ContributorsContributions> {
	const defaults = { owner: options.owner, repo: options.repo };
	const octokit = await createOctokit(options.auth);

	// 1. Collect event data from the GitHub API
	const [acceptedIssues, issueEvents, mergedPulls, repoEvents] =
		await Promise.all([
			collectAcceptedIssues(
				defaults,
				octokit,
				options.labelAcceptingPrs,
				options.since,
			),
			collectIssueEvents(defaults, octokit, options.since),
			collectMergedPulls(defaults, octokit, options.since),
			collectRepoEvents(defaults, octokit, options.since),
		]);

	// 2. Process individual contributors from those events
	const contributors = processContributors(issueEvents, repoEvents, options);

	// 3. Add additional contributors based on issues and pulls
	addAcceptedIssues(Object.values(acceptedIssues), contributors, options);
	await addMergedPulls(mergedPulls, contributors, octokit);

	// 4. Collect the contributions under each contributor
	return contributors.collect();
}
