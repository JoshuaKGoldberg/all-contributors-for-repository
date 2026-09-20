const defaultOptions = {
	ignoredLogins: [
		/\[bot\]$/i,
		/^allcontributors$/i,
		/^copilot$/i,
		/^dependabot$/i,
		/^github-actions$/i,
		/^renovate$/i,
	],
	labelAcceptingPrs: "status: accepting prs",
	labelTypeBug: "type: bug",
	labelTypeDocs: "type: documentation",
	labelTypeIdeas: "type: feature",
	labelTypeTool: "area: tooling",
	testFiles: [/\.(spec|test)\.[^/]+$/i, /(^|\/)(__tests__|tests?)\//i],
};

export interface AllContributorsForRepositoryOptions {
	auth?: string;
	ignoredLogins: RegExp[];
	labelAcceptingPrs: string;
	labelTypeBug: string;
	labelTypeDocs: string;
	labelTypeIdeas: string;
	labelTypeTool: string;
	owner: string;
	repo: string;
	testFiles: RegExp[];
}

export interface RawAllContributorsForRepositoryOptions {
	/**
	 * GitHub auth token to query the API with, if necessary for private repositories and/or to avoid rate limiting.
	 */
	auth?: string;

	/**
	 * Regular expressions for usernames to ignore commits from, such as bot users.
	 */
	ignoredLogins?: RegExp[];

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

	/**
	 * Regular expressions for file paths that count as tests, for merged PRs to be given a `test` contribution.
	 */
	testFiles?: RegExp[];
}

export function fillInOptions(
	rawOptions: RawAllContributorsForRepositoryOptions,
): AllContributorsForRepositoryOptions {
	return {
		auth: rawOptions.auth,
		ignoredLogins: rawOptions.ignoredLogins ?? defaultOptions.ignoredLogins,
		labelAcceptingPrs:
			rawOptions.labelAcceptingPrs ?? defaultOptions.labelAcceptingPrs,
		labelTypeBug: rawOptions.labelTypeBug ?? defaultOptions.labelTypeBug,
		labelTypeDocs: rawOptions.labelTypeDocs ?? defaultOptions.labelTypeDocs,
		labelTypeIdeas: rawOptions.labelTypeIdeas ?? defaultOptions.labelTypeIdeas,
		labelTypeTool: rawOptions.labelTypeTool ?? defaultOptions.labelTypeTool,
		owner: rawOptions.owner,
		repo: rawOptions.repo,
		testFiles: rawOptions.testFiles ?? defaultOptions.testFiles,
	};
}
