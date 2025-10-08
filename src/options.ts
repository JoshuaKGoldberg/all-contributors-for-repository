const defaultOptions = {
	ignoredLogins: [
		"allcontributors",
		"allcontributors[bot]",
		"copilot",
		"copilot[bot]",
		"dependabot",
		"dependabot[bot]",
		"github-actions",
		"github-actions[bot]",
		"renovate",
		"renovate[bot]",
	],
	labelAcceptingPrs: "status: accepting prs",
	labelTypeBug: "type: bug",
	labelTypeDocs: "type: documentation",
	labelTypeIdeas: "type: feature",
	labelTypeTool: "area: tooling",
};

export interface AllContributorsForRepositoryOptions {
	auth?: string;
	ignoredLogins: Set<string>;
	labelAcceptingPrs: string;
	labelTypeBug: string;
	labelTypeDocs: string;
	labelTypeIdeas: string;
	labelTypeTool: string;
	owner: string;
	repo: string;
}

export interface RawAllContributorsForRepositoryOptions {
	/**
	 * GitHub auth token to query the API with, if necessary for private repositories and/or to avoid rate limiting.
	 */
	auth?: string;

	/**
	 * Usernames to ignore commits from, such as bot and bot-like users.
	 */
	ignoredLogins?: string[];

	/**
	 * Label to indicate an issue is accepting pull requests.
	 */
	labelAcceptingPrs?: string;

	/**
	 * Label to indicate an issue is for a bug.
	 */
	labelTypeBug?: string;

	/**
	 * Label to indicate an issue is for documentation.
	 */
	labelTypeDocs?: string;

	/**
	 * Label to indicate an issue is for a feature.
	 */
	labelTypeIdeas?: string;

	/**
	 * Label to indicate an issue is for tooling.
	 */
	labelTypeTool?: string;

	/**
	 * The owner of the repository to query, such as `"JoshuaKGoldberg"`.
	 */
	owner: string;

	/**
	 *  The name of the repository to query, such as `"all-contributors-for-repository"`.
	 */
	repo: string;
}

export function fillInOptions(
	rawOptions: RawAllContributorsForRepositoryOptions,
): AllContributorsForRepositoryOptions {
	return {
		auth: rawOptions.auth,
		ignoredLogins: new Set(
			rawOptions.ignoredLogins ?? defaultOptions.ignoredLogins,
		),
		labelAcceptingPrs:
			rawOptions.labelAcceptingPrs ?? defaultOptions.labelAcceptingPrs,
		labelTypeBug: rawOptions.labelTypeBug ?? defaultOptions.labelTypeBug,
		labelTypeDocs: rawOptions.labelTypeDocs ?? defaultOptions.labelTypeDocs,
		labelTypeIdeas: rawOptions.labelTypeIdeas ?? defaultOptions.labelTypeIdeas,
		labelTypeTool: rawOptions.labelTypeTool ?? defaultOptions.labelTypeTool,
		owner: rawOptions.owner,
		repo: rawOptions.repo,
	};
}
