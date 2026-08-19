import { Octokit } from "octokit";
import { octokitFromAuthSafe } from "octokit-from-auth";

const maxPages = 10;

export const perPage = 100;

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

export async function paginate<T>(pages: AsyncIterable<{ data: T[] }>) {
	const items: T[] = [];
	let requested = 0;

	for await (const page of pages) {
		items.push(...page.data);
		requested += 1;

		if (requested >= maxPages) {
			break;
		}
	}

	return items;
}
