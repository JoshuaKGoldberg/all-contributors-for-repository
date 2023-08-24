type Getter<Key, Value> = (key: Key) => Value;

export class CachingMap<Key, Value> {
	#cache = new Map<Key, Value>();
	#getter: Getter<Key, Value>;

	constructor(getter: Getter<Key, Value>) {
		this.#getter = getter;
	}

	get(key: Key) {
		const existing = this.#cache.get(key);
		if (existing) {
			return existing;
		}

		const value = this.#getter(key);
		this.#cache.set(key, value);
		return value;
	}
}
