import { collect } from "./collect/index.js";
import {
	fillInOptions,
	RawAllContributorsForRepositoryOptions,
} from "./options.js";

export async function createAllContributorsForRepository(
	rawOptions: RawAllContributorsForRepositoryOptions
) {
	const options = fillInOptions(rawOptions);

	return await collect(options);
}
