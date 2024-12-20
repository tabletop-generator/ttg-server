# ttg-server

[![CI](https://github.com/tabletop-generator/server/actions/workflows/ci.yml/badge.svg)](https://github.com/tabletop-generator/server/actions/workflows/ci.yml)

## Prerequisites

- [NVM](https://github.com/nvm-sh/nvm)
- [Node.js v20.x 'Iron' (LTS)](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Setup

- `git clone <url>`: Clone the project to your workspace

- `nvm install`: Install and use the correct version of node for the project

- `npm i`: Install required packages using npm

- Enable these VSCode extensions in the project workspace:

  - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Running

### Single Docker Container

This will run the server as a Docker container and store data in the **server's** memory.

`docker build -t ttg-server .`

`docker container run [--rm] [--init] [-it] [-d] -p [8080]:8080 --env-file [.env] ttg-server`

### Run On Host Machine

See [Scripts > Running](#running-1) below.

## Scripts

These scripts are located in `package.json` and can be run using `npm run <script>`.

### Running

- `start`: Starts the server.
- `dev`: Runs a development server which reloads on changes to the source code.
- `debug`: Used to attach the VSCode Debugger. Not intended for manual use.

### Testing

- `test`: Runs all unit tests. Pass globs for test files you want to run as arguments.
- `test:watch`: Run unit tests and watch for changes to related files.
- `test:coverage`: Runs all unit tests and generates a code coverage report, found in `coverage/lcov-report/index.html`.
- `test:integration`: Runs all integration tests. The server must be running on `http://localhost:8080` with HTTP Basic Auth.

### Linting & Formatting

- `lint`: Runs [ESLint](https://eslint.org/) on all files in the project directory.
- `prettier`: Runs [Prettier](https://prettier.io/) on all files in the project directory.

## Workflow

Please follow the [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) for contributions:

1. **Update your local main branch**

   Switch to your main branch and pull the latest changes from the remote repository:

   ```bash
   git switch main
   git pull --prune
   ```

   - The `--prune` option removes any references to branches that no longer exist on the remote.

2. **Create a new branch**

   Name your branch following the convention `issue-number` (e.g., `issue-1`):

   ```bash
   git switch -c <issue-number> main
   ```

   - If no issue exists for the change you are making, please [create one](https://github.com/tabletop-generator/server/issues/new/choose).

3. **Make your changes**

   Start the development server:

   ```bash
   npm run dev
   ```

   - If introducing new code, add tests for your changes.

4. **Test your changes**

   Run the following checks to ensure everything works as expected:

   ```bash
   npm run lint
   npm run test
   npm run start
   npm run test:integration # Server must be running, so run "npm run start" first
   ```

5. **Review your changes**

   Check which files have been changed:

   ```bash
   git status
   ```

6. **Stage your changes**

   Add the relevant files to staging:

   ```bash
   git add <files>
   ```

7. **Commit your changes**

   Write a meaningful commit message:

   ```bash
   git commit -m "<commit message>"
   ```

8. **Push your branch**

   Push your changes and set the upstream branch:

   ```bash
   git push -u origin <your-branch-name>
   ```

9. **Create a pull request**

   [Create a pull request](https://github.com/tabletop-generator/server/compare) on GitHub. Fill in the template and link it to the issue using:

   ```txt
   Fixes #[issue number]
   ```

## Documentation

- **Language:** [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **Server:** [Express](https://expressjs.com/en/4x/api.html)
  - **Logging:** [Pino](https://getpino.io/#/docs/api), [pino-pretty](https://github.com/pinojs/pino-pretty)
  - **Security:** [Helmet](https://helmetjs.github.io/), [Express/CORS](https://github.com/expressjs/cors#readme)
  - **Graceful Shutdown:** [Stoppable](https://github.com/hunterloftis/stoppable#readme)
- **Runtime:** [Node.js](https://nodejs.org/docs/latest-v20.x/api/)
- **Runners:** [nodemon](https://github.com/remy/nodemon#readme)
- **Package Manager:** [npm](https://docs.npmjs.com/)
- **Version Control System:** [Git](https://git-scm.com/doc), [GitHub](https://docs.github.com/)
- **CI/CD:** [GitHub Actions](https://docs.github.com/en/actions)
- **Testing:**
  - **Unit Testing:** [Jest](https://jestjs.io/)
    - **HTTP Testing Library:** [Supertest](https://github.com/ladjs/supertest#readme)
  - **Integration Testing:** [Hurl](https://hurl.dev/)
- **Linting:** [ESLint](https://eslint.org/docs/v9.x/)
- **Formatting:** [Prettier](https://prettier.io/docs/en/)
- **Git Hooks:** [Husky](https://typicode.github.io/husky/)
