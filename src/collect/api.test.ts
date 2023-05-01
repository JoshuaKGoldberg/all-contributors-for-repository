import { describe, expect, it } from "vitest";

import { paginate } from "./api.js";

describe("paginate", () => {
	it("returns an empty array when request returns an empty array", async () => {
		const request = () => Promise.resolve([]);

		const actual = await paginate(request);

		expect(actual).toEqual([]);
	});

	it("returns the first request's items when request returns an array the first time", async () => {
		const request = (page: number) => Promise.resolve(page ? [] : [{ page }]);

		const actual = await paginate(request);

		expect(actual).toEqual([{ page: 0 }]);
	});

	it("returns multiple request items when request returns multiple times time", async () => {
		const request = (page: number) =>
			Promise.resolve(page < 2 ? Array(100).fill({ page }) : []);

		const actual = await paginate(request);

		expect(actual).toEqual([
			...Array(100).fill({ page: 0 }),
			...Array(100).fill({ page: 1 }),
		]);
	});
});
