import { describe, expect, it } from "vitest";

import { paginate } from "./api.js";

async function* createPages(pages: number[][]) {
	for (const data of pages) {
		yield await Promise.resolve({ data });
	}
}

describe("paginate", () => {
	it("returns an empty array when the iterable yields no pages", async () => {
		const actual = await paginate(createPages([]));

		expect(actual).toEqual([]);
	});

	it("returns all items when the iterable ends before the page limit", async () => {
		const actual = await paginate(createPages([[1, 2], [3]]));

		expect(actual).toEqual([1, 2, 3]);
	});

	it("stops requesting pages when the page limit is reached", async () => {
		const requested: number[] = [];

		async function* createMorePagesThanTheLimit() {
			for (let page = 1; page <= 12; page += 1) {
				requested.push(page);
				yield await Promise.resolve({ data: [page] });
			}
		}

		const actual = await paginate(createMorePagesThanTheLimit());

		expect({ actual, requested }).toEqual({
			actual: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			requested: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		});
	});
});
