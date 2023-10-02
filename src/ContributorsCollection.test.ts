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

		contributors.add("abc", 0, "bug");

		const actual = contributors.collect();

		expect(actual).toEqual({ abc: { bug: [0] } });
	});

	it("adds sorted contributions for logins when they are added in non-alphabetical order", () => {
		const contributors = new ContributorsCollection(new Set());

		contributors.add("def", 1, "tool");
		contributors.add("abc", 2, "tool");
		contributors.add("abc", 3, "bug");
		contributors.add("abc", 4, "code");
		contributors.add("def", 5, "code");

		const actual = contributors.collect();

		expect(actual).toEqual({
			abc: { bug: [3], code: [4], tool: [2] },
			def: { code: [5], tool: [1] },
		});
	});

	it("does not add a login contribution when it is ignored", () => {
		const contributors = new ContributorsCollection(new Set(["ignored"]));

		contributors.add("abc", 1, "bug");
		contributors.add("ignored", 2, "code");

		const actual = contributors.collect();

		expect(actual).toEqual({
			abc: { bug: [1] },
		});
	});
});
