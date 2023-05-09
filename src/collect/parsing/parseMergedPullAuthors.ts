interface MergedPullForAuthors {
	body?: string;
	user?: { login?: string } | null;
}

export function parseMergedPullAuthors(mergedPull: MergedPullForAuthors) {
	const authors: (string | undefined)[] = [];

	authors.push(mergedPull.user?.login);

	for (const coAuthor of mergedPull.body
		?.match(/co-authored-by:.+/gi)
		?.map((text) => text.match(/@(\S+)/)) ?? []) {
		authors.push(coAuthor?.[1]);
	}

	return authors.filter(
		(author: string | undefined): author is string => !!author
	);
}
