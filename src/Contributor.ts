export class Contributor {
	readonly contributions: Record<string, Set<number>> = {};

	add(number: number, type: string) {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		(this.contributions[type] ??= new Set()).add(number);
	}
}
