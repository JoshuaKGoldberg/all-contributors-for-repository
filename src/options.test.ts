import { describe, expect, it } from "vitest";

import { fillInOptions } from "./options.js";

const owner = "fake-owner";
const repo = "fake-repo";

describe(fillInOptions, () => {
	it("fills in defaults when raw options don't provide them", () => {
		const actual = fillInOptions({ owner, repo });

		expect(actual).toMatchInlineSnapshot(`
      {
        "auth": undefined,
        "ignoredLogins": [
          /\\\\\\[bot\\\\\\]\\$/i,
          /\\^allcontributors\\$/i,
          /\\^copilot\\$/i,
          /\\^dependabot\\$/i,
          /\\^github-actions\\$/i,
          /\\^renovate\\$/i,
        ],
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
			ignoredLogins: [/abc/i],
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
			  "ignoredLogins": [
			    /abc/i,
			  ],
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
