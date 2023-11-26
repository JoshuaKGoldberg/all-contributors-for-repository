import { RepoEvent } from "../collecting/collectRepoEvents.js";

export type PullRequestReviewEvent = RepoEvent & {
	issue: {
		number: number;
	};
};

export function repoEventIsPullRequestReviewEvent(
	repoEvent: Pick<RepoEvent, "type">,
): repoEvent is PullRequestReviewEvent {
	return (
		repoEvent.type === "PullRequestReviewEvent" &&
		!!(repoEvent as Partial<PullRequestReviewEvent>).issue?.number
	);
}
