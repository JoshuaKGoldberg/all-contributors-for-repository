import { createCachingCoAuthorToUsername } from "co-author-to-username";
import { Octokit } from "octokit";

import { ContributorsCollection } from "../../ContributorsCollection.js";
import { AllContributorsForRepositoryOptions } from "../../options.js";
import { MergedPull } from "../collecting/collectMergedPulls.js";
import { collectPullFiles } from "../collecting/collectPullFiles.js";
import { parseMergedPullAuthors } from "../parsing/parseMergedPullAuthors.js";
import { parseMergedPullType } from "../parsing/parseMergedPullType.js";

export async function addMergedPulls(
	mergedPulls: MergedPull[],
	contributors: Pick<ContributorsCollection, "add">,
	octokit: Octokit,
	options: Pick<
		AllContributorsForRepositoryOptions,
		"owner" | "repo" | "testFiles"
	>,
) {
	const cachingCoAuthorToUsername = createCachingCoAuthorToUsername({
		fetcher: octokit,
	});
	const defaults = { owner: options.owner, repo: options.repo };

	for (const mergedPull of mergedPulls) {
		const authors = await parseMergedPullAuthors(
			mergedPull,
			cachingCoAuthorToUsername,
		);
		const types = [parseMergedPullType(mergedPull.title)];

		if (
			!types.includes("test") &&
			options.testFiles.length &&
			(await touchesTestFiles(mergedPull.number))
		) {
			types.push("test");
		}

		for (const author of authors) {
			for (const type of types) {
				contributors.add(author, mergedPull.number, type);
			}
		}
	}

	async function touchesTestFiles(pullNumber: number) {
		const files = await collectPullFiles(defaults, octokit, pullNumber);

		return files.some((file) =>
			options.testFiles.some((pattern) => pattern.test(file.filename)),
		);
	}
}
