import { describe, expect, it } from "vitest";

import { Contributor } from "./Contributor.js";

describe("Contributor", () => {
	it("adds a new entry under a type when that type doesn't yet exist", () => {
		const contributor = new Contributor();

		contributor.add(1, "code");

		expect(contributor.contributions).toEqual({ code: [1] });
	});

	it("adds a new entry under an existing type when that type already exists", () => {
		const contributor = new Contributor();

		contributor.add(1, "code");
		contributor.add(2, "code");

		expect(contributor.contributions).toEqual({ code: [1, 2] });
	});

	it("adds a new entry under a second type when that type does not already exist", () => {
		const contributor = new Contributor();

		contributor.add(1, "code");
		contributor.add(2, "design");

		expect(contributor.contributions).toEqual({ code: [1], design: [2] });
	});
});
