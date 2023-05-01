import { Octokit } from "octokit";

const perPage = 100;

export interface RequestDefaults {
	owner: string;
	repo: string;
}

export function createOctokit(auth: string | undefined): Octokit {
	return new (Octokit.defaults({
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
		per_page: perPage,
	}))({ auth });
}

export interface RequestOptionsWithPage extends RequestDefaults {
	page: number;
	per_page: number;
}

export async function paginate<T>(
	defaults: RequestDefaults,
	request: (options: RequestOptionsWithPage) => Promise<T[]>
) {
	const items: T[] = [];

	for (let i = 0; ; i += 1) {
		const response = await request({ page: i, per_page: perPage, ...defaults });

		items.push(...response);

		if (response.length < 100) {
			break;
		}
	}

	return items;
}
