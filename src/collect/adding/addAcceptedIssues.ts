import { ContributorsCollection } from "../../ContributorsCollection.js";
import { AllContributorsForRepositoryOptions } from "../../options.js";
import { AcceptedIssue } from "../collecting/collectAcceptedIssues.js";

export function addAcceptedIssues(
	acceptedIssues: AcceptedIssue[],
	contributors: Pick<ContributorsCollection, "add">,
	options: Pick<
		AllContributorsForRepositoryOptions,
		`labelType${string}` & keyof AllContributorsForRepositoryOptions
	>,
) {
	for (const acceptedIssue of acceptedIssues) {
		const labels = acceptedIssue.labels.map((label) =>
			typeof label === "string" ? label : label.name,
		);

		for (const [labelType, contribution] of [
			// 🐛 `bug`: anybody who filed an issue labeled as accepting PRs and a bug
			[options.labelTypeBug, "bug"],
			// - 📖 `doc`: authors of merged PRs that address issues labeled as docs
			[options.labelTypeDocs, "docs"],
			// - 🔧 `tool`: authors of merged PRs that address issues labeled as tooling
			[options.labelTypeTool, "tool"],
		] as const) {
			if (labels.some((label) => label === labelType)) {
				contributors.add(
					acceptedIssue.user?.login,
					acceptedIssue.number,
					contribution,
				);
			}
		}
	}
}
