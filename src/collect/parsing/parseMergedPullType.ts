import { CommitParser } from "conventional-commits-parser";

const allContributorsTypes = new Map([
	["build", "infra"],
	["ci", "infra"],
	["docs", "doc"],
	["test", "test"],
]);

const parser = new CommitParser();

export function parseMergedPullType(title: string) {
	const { type } = parser.parse(title);

	return (type && allContributorsTypes.get(type)) ?? "code";
}
