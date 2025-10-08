import { Contributor } from "./Contributor.js";

/**
 * For a set of logins, the contributions under those users.
 */
export type ContributorsContributions = Record<
	string,
	ContributorContributions
>;

/**
 * For each contribution under a login, the issue/PR numbers that count as that type.
 */
export type ContributorContributions = Record<string, number[]>;

export class ContributorsCollection {
	#contributors: Record<string, Contributor> = {};
	#ignoredLogins: Set<string>;

	constructor(ignoredLogins: Set<string>) {
		this.#ignoredLogins = new Set(
			Array.from(ignoredLogins).map((login) => login.toLowerCase()),
		);
	}

	add(login: string | undefined, number: number, type: string) {
		if (!login) {
			return;
		}

		const loginNormalized = login.toLowerCase();

		if (!this.#ignoredLogins.has(loginNormalized)) {
			(this.#contributors[loginNormalized] ??= new Contributor()).add(
				number,
				type,
			);
		}
	}

	collect(): ContributorsContributions {
		return Object.fromEntries(
			Object.entries(this.#contributors)
				.map(
					([login, contributor]) =>
						[
							login,
							Object.fromEntries(
								Object.entries(contributor.contributions).map(
									([type, numbers]) => [
										type,
										Array.from(numbers).sort((a, b) => a - b),
									],
								),
							),
						] as const,
				)
				.sort(([a], [b]) => a.localeCompare(b)),
		);
	}
}
