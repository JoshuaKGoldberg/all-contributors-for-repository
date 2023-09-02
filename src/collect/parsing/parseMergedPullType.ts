import conventionalCommitsParser from "conventional-commits-parser";

const allContributorsTypes = new Map([
	["build", "infra"],
	["ci", "infra"],
	["docs", "doc"],
	["test", "test"],
]);

export function parseMergedPullType(title: string) {
	const { type } = conventionalCommitsParser.sync(title);

	return (type && allContributorsTypes.get(type)) ?? "code";
}
