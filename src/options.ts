const defaultOptions = {
	ignoredLogins: [
		"allcontributors",
		"allcontributors[bot]",
		"dependabot",
		"dependabot[bot]",
		"renovate",
		"renovate[bot]",
	],
	labelAcceptingPrs: "status: accepting prs",
	labelTypeBug: "type: bug",
	labelTypeDocs: "type: documentation",
	labelTypeTool: "area: tooling",
};

export interface RawAllContributorsForRepositoryOptions {
	auth?: string;
	ignoredLogins?: string[];
	labelAcceptingPrs?: string;
	labelTypeBug?: string;
	labelTypeDocs?: string;
	labelTypeTool?: string;
	owner: string;
	repo: string;
}

export interface AllContributorsForRepositoryOptions {
	auth?: string;
	ignoredLogins: Set<string>;
	labelAcceptingPrs: string;
	labelTypeBug: string;
	labelTypeDocs: string;
	labelTypeTool: string;
	owner: string;
	repo: string;
}

export function fillInOptions(
	rawOptions: RawAllContributorsForRepositoryOptions
): AllContributorsForRepositoryOptions {
	return {
		auth: rawOptions.auth,
		ignoredLogins: new Set(
			rawOptions.ignoredLogins ?? defaultOptions.ignoredLogins
		),
		labelAcceptingPrs:
			rawOptions.labelAcceptingPrs ?? defaultOptions.labelAcceptingPrs,
		labelTypeBug: rawOptions.labelTypeBug ?? defaultOptions.labelTypeBug,
		labelTypeDocs: rawOptions.labelTypeDocs ?? defaultOptions.labelTypeDocs,
		labelTypeTool: rawOptions.labelTypeTool ?? defaultOptions.labelTypeTool,
		owner: rawOptions.owner,
		repo: rawOptions.repo,
	};
}
