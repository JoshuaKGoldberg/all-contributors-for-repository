import { createCachingCoAuthorToUsername } from "co-author-to-username";
import { Octokit } from "octokit";

import { ContributorsCollection } from "../../ContributorsCollection.js";
import { MergedPull } from "../collecting/collectMergedPulls.js";
import { parseMergedPullAuthors } from "../parsing/parseMergedPullAuthors.js";
import { parseMergedPullType } from "../parsing/parseMergedPullType.js";

export async function addMergedPulls(
	mergedPulls: MergedPull[],
	contributors: Pick<ContributorsCollection, "add">,
	octokit: Octokit,
) {
	const cachingCoAuthorToUsername = createCachingCoAuthorToUsername({
		fetcher: octokit,
	});

	for (const mergedPull of mergedPulls) {
		const authors = await parseMergedPullAuthors(
			mergedPull,
			cachingCoAuthorToUsername,
		);
		const type = parseMergedPullType(mergedPull.title);

		for (const author of authors) {
			contributors.add(author, mergedPull.number, type);
		}
	}
}
