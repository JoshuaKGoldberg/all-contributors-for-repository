import { describe, expect, it, vi } from "vitest";

import { CachingMap } from "./CachingMap.js";

describe("CachingMap", () => {
	it("creates a new value under a key when the value doesn't yet exist", () => {
		const value = "value-first";
		const getter = vi.fn().mockReturnValue(value);
		const cachingMap = new CachingMap(getter);

		const actual = cachingMap.get("key-first");

		expect(actual).toEqual(value);
	});

	it("reuses an existing value under a key when the value doesn't yet exist", () => {
		const value = "value-first";
		const getter = vi.fn().mockReturnValueOnce(value).mockReturnValue("second");
		const cachingMap = new CachingMap(getter);

		const actual = cachingMap.get("key-first");

		expect(actual).toEqual(value);
	});

	it("caches values under provided keys when multiple keys are used", () => {
		const getter = vi.fn().mockImplementation((key: string) => key);
		const cachingMap = new CachingMap(getter);

		expect(cachingMap.get("key-first")).toEqual("key-first");
		expect(cachingMap.get("key-second")).toEqual("key-second");
		expect(cachingMap.get("key-first")).toEqual("key-first");
		expect(cachingMap.get("key-second")).toEqual("key-second");
		expect(cachingMap.get("key-second")).toEqual("key-second");
		expect(cachingMap.get("key-first")).toEqual("key-first");
		expect(cachingMap.get("key-first")).toEqual("key-first");

		expect(getter.mock.calls).toEqual([["key-first"], ["key-second"]]);
	});
});
