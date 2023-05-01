<h1 align="center">All Contributors For Repository</h1>

<p align="center">Generates an allcontributors list for an existing repository.</p>

<p align="center">
	<a href="#contributors" target="_blank">
<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<img alt="All Contributors: 1" src="https://img.shields.io/badge/all_contributors-1-21bb42.svg" />
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- prettier-ignore-end -->
	</a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/all-contributors-for-repository" target="_blank">
		<img alt="Codecov Test Coverage" src="https://codecov.io/gh/JoshuaKGoldberg/all-contributors-for-repository/branch/main/graph/badge.svg?token=eVIFY4MhfQ"/>
	</a>
	<a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank">
		<img alt="Contributor Covenant" src="https://img.shields.io/badge/code_of_conduct-enforced-21bb42" />
	</a>
	<a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/blob/main/LICENSE.md" target="_blank">
	    <img alt="License: MIT" src="https://img.shields.io/github/license/JoshuaKGoldberg/all-contributors-for-repository?color=21bb42">
    </a>
	<a href="https://github.com/sponsors/JoshuaKGoldberg" target="_blank">
    	<img alt="Sponsor: On GitHub" src="https://img.shields.io/badge/sponsor-on_github-21bb42.svg" />
    </a>
	<img alt="Style: Prettier" src="https://img.shields.io/badge/style-prettier-21bb42.svg" />
    <img alt="TypeScript: Strict" src="https://img.shields.io/badge/typescript-strict-21bb42.svg" />
</p>

## Usage

```shell
npm i all-contributors-for-repository
```

```ts
import { createAllContributorsForRepository } from "all-contributors-for-repository";

const contributors = await createAllContributorsForRepository({
	owner: "JoshuaKGoldberg",
	repo: "template-typescript-node-package",
});
/*
{
  john_reilly: [ 'bug', 'code' ],
  joshuakgoldberg: [ 'maintenance', 'tool' ],
}
*/
```

> **Warning**
> This tool only sees contributions that can be detected from GitHub's API.
> Don't forget to manually add in other forms of contributions!

The types of contributions detected are:

- 🐛 `bug`: anybody who filed an issue labeled as accepting PRs and a bug _(see options)_
- 💻 `computer`: all PR authors and co-authors
- 📖 `doc`: authors of merged PRs that address issues labeled as accepting PRs and docs _(see options)_
- 🚧 `maintenance`: adding labels to issues and PRs, and merging PRs
- 👀 `review`: submitting a review for a PR
- 🔧 `tool`: authors of merged PRs that address issues labeled as accepting PRs and tooling _(see options)_

> 💡 Given that list of contributors, you might want to run `all-contributors add` on each contributor & contribution type.
>
> ```ts
> import { $ } from "execa";
>
> for (const [contributor, contributions] of Object.entries(contributors)) {
> 	for (const contribution of contributions) {
> 		await $`npx all-contributors add ${contributor} ${contribution}`;
> 	}
> }
> ```

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 💖

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg"/><br /><sub><b>Josh Goldberg</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/pulls?q=is%3Apr+reviewed-by%3AJoshuaKGoldberg" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/JoshuaKGoldberg/all-contributors-for-repository/commits?author=JoshuaKGoldberg" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

<!-- You can remove this notice if you don't want it 🙂 no worries! -->

> 💙 This package is based on [@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg)'s [template-typescript-node-package](https://github.com/JoshuaKGoldberg/template-typescript-node-package).
