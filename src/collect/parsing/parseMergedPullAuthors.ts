import { CachingCoAuthorToUsername } from "co-author-to-username";
import { descriptionToCoAuthors } from "description-to-co-authors";

interface MergedPullForAuthors {
	body?: string;
	user?: { login?: string } | null;
}

export async function parseMergedPullAuthors(
	mergedPull: MergedPullForAuthors,
	cachingCoAuthorToUsername: CachingCoAuthorToUsername,
) {
	const authors: (string | undefined)[] = [];

	authors.push(mergedPull.user?.login);

	if (mergedPull.body) {
		const coAuthors = descriptionToCoAuthors(mergedPull.body);

		for (const coAuthor of coAuthors) {
			authors.push(await cachingCoAuthorToUsername(coAuthor));
		}
	}

	return Array.from(
		new Set(
			authors.filter(
				(author: string | undefined): author is string => !!author,
			),
		),
	);
}
