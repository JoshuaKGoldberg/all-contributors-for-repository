import { CachingMap } from "../../CachingMap.js";

interface MergedPullForAuthors {
	body?: string;
	user?: { login?: string } | null;
}

export async function parseMergedPullAuthors(
	mergedPull: MergedPullForAuthors,
	authorsCache: CachingMap<string, Promise<string | undefined>>
) {
	const authors: (string | undefined)[] = [];

	authors.push(mergedPull.user?.login);

	for (const match of mergedPull.body?.match(/co-authored-by:.+/gi) ?? []) {
		const split = match.split(/\s+/);

		if (/@\w+/.test(split[1])) {
			authors.push(split[1].slice(1));
			continue;
		}

		const email =
			split.length > 2 && split[split.length - 1].match(/<(.+)>/)?.[1];
		if (email) {
			const newLocal = await authorsCache.get(email);
			authors.push(newLocal);
		}
	}

	return Array.from(
		new Set(
			authors.filter((author: string | undefined): author is string => !!author)
		)
	);
}
