import { collect } from "./collect/index.ts";
import {
	fillInOptions,
	RawAllContributorsForRepositoryOptions,
} from "./options.ts";

export async function getAllContributorsForRepository(
	rawOptions: RawAllContributorsForRepositoryOptions,
) {
	const options = fillInOptions(rawOptions);

	return await collect(options);
}
