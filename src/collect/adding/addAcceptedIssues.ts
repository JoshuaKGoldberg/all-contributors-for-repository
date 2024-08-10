import { descriptionToCoAuthors } from "description-to-co-authors";
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
			// 💡 `ideas`: anybody who filed an issue labeled as accepting PRs and a feature
			[options.labelTypeIdeas, "ideas"],
			// - 🔧 `tool`: authors of merged PRs that address issues labeled as tooling
			[options.labelTypeTool, "tool"],
		] as const) {
			if (!labels.some((label) => label === labelType)) {
				continue;
			}

			const logins = [];

			if (acceptedIssue.user) {
				logins.push(acceptedIssue.user.login);
			}

			if (acceptedIssue.body) {
				for (const coAuthor of descriptionToCoAuthors(acceptedIssue.body)) {
					logins.push(coAuthor.username);
				}
			}

			for (const login of logins) {
				contributors.add(login, acceptedIssue.number, contribution);
			}
		}
	}
}
