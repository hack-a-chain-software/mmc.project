[The Murder Mystery Collective](https://www.playmmc.io/)
==========

## Guidelines
* Use the present tense ("Add feature" not "Added feature") and the imperative mood ("Move class to..." not "Moves class to...") on commits and use the name issue on pull requests.
* Pull requests must be reviewed before merged.
* Done is better than perfect. Does it work as expected? Ship now, iterate later.
* All contributions must have tests. Remember to verify the [Github Actions CI status](https://github.com/hack-a-chain-software/mmc.project/actions/workflows/CI.yml).
* Every commit is checked using [Github Actions](https://github.com/hack-a-chain-software/mmc.project/actions).
* If the CI status are not passing, the deploy will not work.

## Coding Style

- CSS: https://github.com/airbnb/css
- Javascript: https://github.com/airbnb/javascript
- React: https://github.com/airbnb/javascript/tree/master/react
- CSS in Javascript: https://github.com/airbnb/javascript/tree/master/css-in-javascript

## Task Management
* Jira Issues is used to track all tasks that needed to be done.
* Jira MMC board is used to get a decent look on what's going on wright now.
* Every two weeks all done tasks are put together in a Milestone and the current Sprint is closed.
* Issues Board: https://hackachain.atlassian.net/jira/software/projects/MMC/boards/9

## Installation

MMC is powered by [**Vite**](https://vitejs.dev/).

If you have any problems configuring your enviroment, remember to read the [Vite Documentation](https://vitejs.dev/).

-----------------

#### Steps

1) Clone the repository:
```bash
$ git clone git@github.com:hack-a-chain-software/mmc.project.git
$ cd mmc.project
```

2) Check all packages and copy the .env.example file and edit it with your environment config:
```bash
$ cp .env.example .env
```

3) Install frontend dependencies via YARN
```bash
$ yarn
```

When working on frontend, run `yarn front dev`. Files will be compiled, concatenated and the browser will auto update via `browsersync`.

### Cypress

Run cypress tests
```bash
$ yarn cypress run
```

Run to debug tests
```bash
$ yarn cypress open
```
