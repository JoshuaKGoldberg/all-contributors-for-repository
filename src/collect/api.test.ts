import { describe, expect, it } from "vitest";

import { paginate } from "./api.js";

async function* createPages<T>(pages: T[][]) {
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

	it("returns all items when since is provided but no timestampOf is", async () => {
		const actual = await paginate(createPages([[1, 2], [3]]), {
			since: new Date("2026-01-02"),
		});

		expect(actual).toEqual([1, 2, 3]);
	});

	it("excludes items from before since and stops requesting pages once one is seen", async () => {
		const requested: number[] = [];

		async function* createDatedPages() {
			const pages = [
				["2026-01-04", "2026-01-03"],
				["2026-01-02", "2026-01-01"],
				["2025-12-31"],
			];

			for (const [index, data] of pages.entries()) {
				requested.push(index + 1);
				yield await Promise.resolve({ data });
			}
		}

		const actual = await paginate(createDatedPages(), {
			since: new Date("2026-01-02"),
			timestampOf: (item) => item,
		});

		expect({ actual, requested }).toEqual({
			actual: ["2026-01-04", "2026-01-03", "2026-01-02"],
			requested: [1, 2],
		});
	});

	it("keeps items without a timestamp when since is provided", async () => {
		const actual = await paginate(createPages([[null, "2026-01-01"]]), {
			since: new Date("2026-01-02"),
			timestampOf: (item) => item,
		});

		expect(actual).toEqual([null]);
	});
});
