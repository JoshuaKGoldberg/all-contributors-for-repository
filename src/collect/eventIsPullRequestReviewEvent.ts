import { RepoEvent } from "./collectEvents.js";

type PullRequestReviewEvent = RepoEvent & {
	issue: {
		id: number;
	};
};

export function eventIsPullRequestReviewEvent(
	event: Pick<RepoEvent, "type">
): event is PullRequestReviewEvent {
	return (
		event.type === "PullRequestReviewEvent" &&
		!!(event as Partial<PullRequestReviewEvent>).issue?.id
	);
}
