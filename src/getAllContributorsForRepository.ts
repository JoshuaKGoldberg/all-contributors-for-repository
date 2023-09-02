import { collect } from "./collect/index.js";
import {
	RawAllContributorsForRepositoryOptions,
	fillInOptions,
} from "./options.js";

export async function getAllContributorsForRepository(
	rawOptions: RawAllContributorsForRepositoryOptions,
) {
	const options = fillInOptions(rawOptions);

	return await collect(options);
}
