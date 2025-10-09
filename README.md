<h1 align="center">All Contributors For Repository</h1>

<p align="center">
	Generates an allcontributors list for an existing repository.
	🤝
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 2" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-2-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/all-contributors-for-repository" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/all-contributors-for-repository?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/all-contributors-for-repository"><img alt="📦 npm version" src="https://img.shields.io/npm/v/all-contributors-for-repository?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

```shell
npm i all-contributors-for-repository
```

```ts
import { getAllContributorsForRepository } from "all-contributors-for-repository";

const contributors = await getAllContributorsForRepository({
	owner: "JoshuaKGoldberg",
	repo: "create-typescript-app",
});

/*
{
  john_reilly: [ 'bug', 'code' ],
  joshuakgoldberg: [ 'maintenance', 'tool' ],
}
*/
console.log(contributors);
```

> **Warning**
> This tool only sees contributions that can be detected from the last 500 events in GitHub's API.
> Don't forget to manually add in other forms of contributions!

The types of contributions detected from the GitHub API are:

- 🐛 `bug`: anybody who filed an issue labeled as accepting PRs and a bug _(see [Options](#options))_
- 📖 `doc`: authors of merged PRs that address issues labeled as accepting PRs and docs _(see [Options](#options))_
- 🚧 `maintenance`: adding labels to issues and PRs, and merging PRs
- 👀 `review`: submitting a review for a PR
- 🔧 `tool`: authors of merged PRs that address issues labeled as accepting PRs and tooling _(see [Options](#options))_

Additionally, based on PR [conventional commit titles](https://www.conventionalcommits.org/en/v1.0.0/#summary) in the [Angular convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type), for all PR authors and co-authors:

- `build` and `ci`: will be treated as an `:infra:` contribution
- `docs`: will be treated as an `:doc:` contribution
- `test`: will be treated as an `:test:` contribution
- All other PRs -including those without a conventional title- will be treated as `:code:` contributions

> 💡 Given that list of contributors, you might want to run `all-contributors add` on each contributor & contribution type.
>
> ```ts
> import { $ } from "execa";
>
> for (const [contributor, contributions] of Object.entries(contributors)) {
> 	const contributionTypes = Object.keys(contributions).join(",");
> 	await $`npx all-contributors add ${contributor} ${contributionTypes}`;
> }
> ```
>
> See [populate-all-contributors-for-repository](https://github.com/JoshuaKGoldberg/populate-all-contributors-for-repository) for a project that does just that. 📋

### Options

The exported `getAllContributorsForRepository` function takes in an object with two required properties:

- `owner` _(`string`)_: The owner of the repository to query, such as `"JoshuaKGoldberg"`.
- `repository` _(`string`)_: The name of the repository to query, such as `"all-contributors-for-repository"`.

It additionally allows for the following optional options.

- `auth` _(`string`)_: GitHub auth token to query the API with, if necessary for private repositories and/or to avoid rate limiting.
- `ignoredLogins` _(`string[]`)_: Usernames to ignore commits from, such as bot and bot-like users.
  - Default: `"allcontributors"`, `"allcontributors[bot]"`, `"copilot"`, `"copilot[bot]"`, `"dependabot"`, `"dependabot[bot]"`, `"renovate"`, `"renovate[bot]"`
- `labelAcceptingPrs` _(`string`)_: Label to indicate an issue is accepting pull requests.
- `labelTypeBug` _(`string`)_: Label to indicate an issue is for a bug.
- `labelTypeDocs` _(`string`)_: Label to indicate an issue is for documentation.
- `labelTypeIdeas` _(`string`)_: Label to indicate an issue is for a feature.
- `labelTypeTool` _(`string`)_: Label to indicate an issue is for tooling.

```ts
import { getAllContributorsForRepository } from "all-contributors-for-repository";

getAllContributorsForRepository({
	auth: "abc123",
	ignoredLogins: ["MyBotLikeUser"],
	labelAcceptingPrs: "help wanted",
	labelTypeBug: "bug",
	labelTypeDocs: "docs",
	labelTypeIdeas: "feature",
	labelTypeTool: "tool",
});
```

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 🤝

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.fdlpm.com"><img src="https://avatars.githubusercontent.com/u/9667945?v=4?s=100" width="100px;" alt="Fabian De La Peña Montero"/><br /><sub><b>Fabian De La Peña Montero</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/commits?author=fdlpm" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg"/><br /><sub><b>Josh Goldberg</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/commits?author=JoshuaKGoldberg" title="Tests">⚠️</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

<!-- You can remove this notice if you don't want it 🙂 no worries! -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo engine](https://create.bingo).
