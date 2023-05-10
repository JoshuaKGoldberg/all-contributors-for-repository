export class Contributor {
	readonly contributions: Record<string, number[]> = {};

	add(id: number, type: string) {
		(this.contributions[type] ??= []).push(id);
	}
}
