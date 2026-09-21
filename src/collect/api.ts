import { Octokit } from "octokit";
import { octokitFromAuthSafe } from "octokit-from-auth";

const maxPages = 10;

export const perPage = 100;

export interface PaginateOptions<T> {
	/**
	 * Earliest time an item may have happened at to be included.
	 * Pages are expected to be ordered newest-first, so paginating stops
	 * on the first page that contains an item from before this time.
	 */
	since?: Date;

	/**
	 * Retrieves when an item happened, for comparing against `since`.
	 */
	timestampOf?: (item: T) => null | string | undefined;
}

export interface PaginatingOctokit {
	paginate: Pick<Octokit["paginate"], "iterator">;
}

export interface RequestDefaults {
	owner: string;
	repo: string;
}

export async function createOctokit(
	auth: string | undefined,
): Promise<Octokit> {
	return await octokitFromAuthSafe({
		auth,
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});
}

export async function paginate<T>(
	pages: AsyncIterable<{ data: T[] }>,
	{ since, timestampOf }: PaginateOptions<T> = {},
) {
	const items: T[] = [];
	let requested = 0;

	for await (const page of pages) {
		const pageItems =
			since && timestampOf
				? page.data.filter((item) => !isBefore(timestampOf(item), since))
				: page.data;

		items.push(...pageItems);
		requested += 1;

		if (requested >= maxPages || pageItems.length < page.data.length) {
			break;
		}
	}

	return items;
}

function isBefore(timestamp: null | string | undefined, since: Date) {
	return !!timestamp && new Date(timestamp) < since;
}
