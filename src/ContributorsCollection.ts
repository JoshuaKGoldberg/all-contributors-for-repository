export class ContributorsCollection {
	#contributors: Record<string, Set<string>> = {};
	#ignoredLogins: Set<string>;

	constructor(ignoredLogins: Set<string>) {
		this.#ignoredLogins = ignoredLogins;
	}

	add(login: string | undefined, type: string) {
		if (login && !this.#ignoredLogins.has(login)) {
			(this.#contributors[login.toLowerCase()] ??= new Set()).add(type);
		}
	}

	collect() {
		return Object.fromEntries(
			Object.entries(this.#contributors)
				.map(
					([contributor, types]) =>
						[contributor, Array.from(types).sort()] as const
				)
				.sort(([a], [b]) => a.localeCompare(b))
		);
	}
}
