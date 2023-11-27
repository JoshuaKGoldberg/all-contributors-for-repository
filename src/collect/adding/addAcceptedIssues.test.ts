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

const createStubIssue = (label: string) =>
	({
		labels: [label],
		number: 0,
		user: { login },
	}) as AcceptedIssue;

describe("addAcceptedIssues", () => {
	it("adds an issue when it has a bug label", () => {
		const add = vi.fn();
		const issue = createStubIssue(options.labelTypeBug);

		addAcceptedIssues([issue], { add }, options);

		expect(add).toHaveBeenCalledWith(login, issue.number, "bug");
	});

	it("adds an issue when it has a docs label", () => {
		const add = vi.fn();
		const issue = createStubIssue(options.labelTypeDocs);

		addAcceptedIssues([issue], { add }, options);

		expect(add).toHaveBeenCalledWith(login, issue.number, "docs");
	});

	it("adds an issue when it has a tool label", () => {
		const add = vi.fn();
		const issue = createStubIssue(options.labelTypeTool);

		addAcceptedIssues([issue], { add }, options);

		expect(add).toHaveBeenCalledWith(login, issue.number, "tool");
	});

	it("doesn't add an issue when it has an unrelated label", () => {
		const add = vi.fn();
		const issue = createStubIssue("other");

		addAcceptedIssues([issue], { add }, options);

		expect(add).not.toHaveBeenCalled();
	});
});
