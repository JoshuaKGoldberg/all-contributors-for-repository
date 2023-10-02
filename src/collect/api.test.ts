import { describe, expect, it } from "vitest";

import { RequestOptionsWithPage, paginate } from "./api.js";

const defaults = {
	owner: "",
	repo: "",
};

describe("paginate", () => {
	it("returns an empty array when request returns an empty array", async () => {
		const request = () => Promise.resolve([]);

		const actual = await paginate(defaults, request);

		expect(actual).toEqual([]);
	});

	it("returns the first request's items when request returns an array the first time", async () => {
		const request = ({ page }: RequestOptionsWithPage) =>
			Promise.resolve(page ? [] : [{ page }]);

		const actual = await paginate(defaults, request);

		expect(actual).toEqual([{ page: 0 }]);
	});

	it("returns multiple request items when request returns multiple times", async () => {
		const request = ({ page }: RequestOptionsWithPage) =>
			Promise.resolve(page < 2 ? Array(100).fill({ page }) : []);

		const actual = await paginate(defaults, request);

		expect(actual).toEqual([
			...Array(100).fill({ page: 0 }),
			...Array(100).fill({ page: 1 }),
		]);
	});

	it("stops retrieving after 10 requests", async () => {
		const request = ({ page }: RequestOptionsWithPage) =>
			Promise.resolve(Array(100).fill({ page }));

		const actual = await paginate(defaults, request);

		expect(actual).toEqual([
			...Array(100).fill({ page: 0 }),
			...Array(100).fill({ page: 1 }),
			...Array(100).fill({ page: 2 }),
			...Array(100).fill({ page: 3 }),
			...Array(100).fill({ page: 4 }),
			...Array(100).fill({ page: 5 }),
			...Array(100).fill({ page: 6 }),
			...Array(100).fill({ page: 7 }),
			...Array(100).fill({ page: 8 }),
			...Array(100).fill({ page: 9 }),
		]);
	});
});
