import { describe, expect, it } from "vitest";

import { fillInOptions } from "./options.js";

const owner = "fake-owner";
const repo = "fake-repo";

describe("fillInOptions", () => {
	it("fills in defaults when raw options don't provide them", () => {
		const actual = fillInOptions({ owner, repo });

		expect(actual).toMatchInlineSnapshot(`
			{
			  "auth": undefined,
			  "ignoredLogins": Set {
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
			  },
			  "labelAcceptingPrs": "status: accepting prs",
			  "labelTypeBug": "type: bug",
			  "labelTypeDocs": "type: documentation",
			  "labelTypeIdeas": "type: feature",
			  "labelTypeTool": "area: tooling",
			  "owner": "fake-owner",
			  "repo": "fake-repo",
			}
		`);
	});

	it("uses provided options when raw options provide them", () => {
		const actual = fillInOptions({
			ignoredLogins: ["abc"],
			labelAcceptingPrs: "fake-label-accepting-prs",
			labelTypeBug: "fake-label-type-bug",
			labelTypeDocs: "fake-label-type-docs",
			labelTypeTool: "fake-label-type-tool",
			owner,
			repo,
		});

		expect(actual).toMatchInlineSnapshot(`
			{
			  "auth": undefined,
			  "ignoredLogins": Set {
			    "abc",
			  },
			  "labelAcceptingPrs": "fake-label-accepting-prs",
			  "labelTypeBug": "fake-label-type-bug",
			  "labelTypeDocs": "fake-label-type-docs",
			  "labelTypeIdeas": "type: feature",
			  "labelTypeTool": "fake-label-type-tool",
			  "owner": "fake-owner",
			  "repo": "fake-repo",
			}
		`);
	});
});
