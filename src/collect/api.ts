import { Octokit } from "octokit";

import { AllContributorsForRepositoryOptions } from "../options.js";

const perPage = 100;

export function createOctokit(
	options: AllContributorsForRepositoryOptions
): Octokit {
	return new (Octokit.defaults({
		owner: options.owner,
		per_page: perPage,
		repo: options.repo,
	}))({ auth: options.auth });
}

export async function paginate<T>(
	request: (page: number, perPage: number) => Promise<T[]>
) {
	const items: T[] = [];

	for (let i = 0; ; i += 1) {
		const response = await request(i, perPage);

		items.push(...response);

		if (response.length < 100) {
			break;
		}
	}

	return items;
}
