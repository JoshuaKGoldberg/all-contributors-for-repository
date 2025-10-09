import { describe, expect, it, vi } from "vitest";

import { AcceptedIssue } from "../collecting/collectAcceptedIssues.js";
import { addAcceptedIssues } from "./addAcceptedIssues.js";

const options = {
	labelTypeBug: "labelTypeBug",
	labelTypeDocs: "labelTypeDocs",
	labelTypeIdeas: "labelTypeIdeas",
	labelTypeTool: "labelTypeTool",
};

const login = "abc123";
const loginCoAuthor = "other-login";

const mockDescriptionToCoAuthors = vi
	.fn()
	.mockReturnValue([{ username: loginCoAuthor }]);

vi.mock("description-to-co-authors", () => ({
	get descriptionToCoAuthors() {
		return mockDescriptionToCoAuthors;
	},
}));

const createStubIssue = ({ body, labels }: Partial<AcceptedIssue>) =>
	({
		body,
		labels,
		number: 0,
		user: { login },
	}) as AcceptedIssue;

describe("addAcceptedIssues", () => {
	it("adds an issue when it has a bug label", () => {
		const add = vi.fn();
		const issue = createStubIssue({
			labels: [options.labelTypeBug],
		});

		addAcceptedIssues([issue], { add }, options);

		expect(add).toHaveBeenCalledExactlyOnceWith(login, issue.number, "bug");
	});

	it("adds an issue when it has a docs label", () => {
		const add = vi.fn();
		const issue = createStubIssue({
			labels: [options.labelTypeDocs],
		});

		addAcceptedIssues([issue], { add }, options);

		expect(add).toHaveBeenCalledExactlyOnceWith(login, issue.number, "docs");
	});

	it("adds an issue when it has a feature label", () => {
		const add = vi.fn();
		const issue = createStubIssue({
			labels: [options.labelTypeIdeas],
		});

		addAcceptedIssues([issue], { add }, options);

		expect(add).toHaveBeenCalledExactlyOnceWith(login, issue.number, "ideas");
	});

	it("adds an issue when it has a tool label", () => {
		const add = vi.fn();
		const issue = createStubIssue({
			labels: [options.labelTypeTool],
		});

		addAcceptedIssues([issue], { add }, options);

		expect(add).toHaveBeenCalledExactlyOnceWith(login, issue.number, "tool");
	});

	it("adds an issue's co-author when the body includes them", () => {
		const add = vi.fn();
		const issue = createStubIssue({
			body: `(mocked)`,
			labels: [options.labelTypeTool],
		});

		addAcceptedIssues([issue], { add }, options);

		expect(add.mock.calls).toEqual([
			[login, issue.number, "tool"],
			[loginCoAuthor, issue.number, "tool"],
		]);
		expect(mockDescriptionToCoAuthors).toHaveBeenCalledExactlyOnceWith(
			issue.body,
		);
	});

	it("doesn't call for co-authors when there is no issue body", () => {
		const add = vi.fn();
		const issue = createStubIssue({
			labels: [options.labelTypeTool],
		});

		addAcceptedIssues([issue], { add }, options);

		expect(add).toHaveBeenCalledExactlyOnceWith(login, issue.number, "tool");
		expect(add).toHaveBeenCalledTimes(1);
	});

	it("doesn't add an issue when it has an unrelated label", () => {
		const add = vi.fn();
		const issue = createStubIssue({
			labels: ["other"],
		});

		addAcceptedIssues([issue], { add }, options);

		expect(add).not.toHaveBeenCalled();
	});
});
