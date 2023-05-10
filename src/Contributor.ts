export class Contributor {
	readonly contributions: Record<string, Set<number>> = {};

	add(number: number, type: string) {
		(this.contributions[type] ??= new Set()).add(number);
	}
}
