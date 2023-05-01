import { describe, expect, it } from "vitest";

import { ContributorsCollection } from "./ContributorsCollection.js";

describe("ContributorsCollection", () => {
	it("produces no entries when none were added", () => {
		const contributors = new ContributorsCollection(new Set());

		const actual = contributors.collect();

		expect(actual).toEqual({});
	});

	it("adds a login when it is not ignored", () => {
		const contributors = new ContributorsCollection(new Set());

		contributors.add("abc", "bug");

		const actual = contributors.collect();

		expect(actual).toEqual({ abc: ["bug"] });
	});

	it("adds sorted contributions for logins when they are added in non-alphabetical order ", () => {
		const contributors = new ContributorsCollection(new Set());

		contributors.add("def", "tool");
		contributors.add("abc", "tool");
		contributors.add("abc", "bug");
		contributors.add("abc", "code");
		contributors.add("def", "code");

		const actual = contributors.collect();

		expect(actual).toEqual({
			abc: ["bug", "code", "tool"],
			def: ["code", "tool"],
		});
	});

	it("does not add a login contribution when it is ignored ", () => {
		const contributors = new ContributorsCollection(new Set(["ignored"]));

		contributors.add("abc", "bug");
		contributors.add("ignored", "code");

		const actual = contributors.collect();

		expect(actual).toEqual({
			abc: ["bug"],
		});
	});
});
