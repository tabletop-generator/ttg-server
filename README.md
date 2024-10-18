# ttg-server

## Development

### Prerequisites

- [Node.js v20.x 'Iron' (LTS)](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

### Setup

- `git clone <url>`: Clone the project to your workspace

- `npm i`: Install required packages using npm

- Enable these VSCode extensions in the project workspace:

  - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Scripts

These scripts are located in `package.json` and can be run using `npm run <script>`.

- `build`: Runs `tsc` to compile the TypeScript files in `src/` and output them to `dist/`.
- `start`: Runs `node dist/index.js` to start the server.
- `dev`: Runs `cross-env LOG_LEVEL=debug nodemon --exec ts-node src/index.ts` to run a development server which reloads on changes to the source code.
- `debug`: Not intended for manual use. Used to configure the debugger in VSCode in `.vscode/launch.json`.
- `format`: Runs `prettier --write .` to format all files in the project directory.
- `lint`: Runs `eslint .` to lint all files in the project directory.
- `prepare`: Not intended for manual use. Used to run the pre-commit hook which formats and lints code before every commit.

### Documentation

- [TypeScript](https://www.typescriptlang.org/docs/)
- [Express](https://expressjs.com/en/4x/api.html)
- [Pino](https://getpino.io/#/docs/api)
- [pino-pretty](https://github.com/pinojs/pino-pretty)
- [Helmet](https://helmetjs.github.io/)
- [Express/CORS](https://github.com/expressjs/cors#readme)
- [Stoppable](https://github.com/hunterloftis/stoppable#readme)
- [ts-node](https://typestrong.org/ts-node/docs/)
- [nodemon](https://github.com/remy/nodemon#readme)
- [typescript-eslint](https://typescript-eslint.io/getting-started/)
- [Node.js](https://nodejs.org/docs/latest-v20.x/api/)
- [npm](https://docs.npmjs.com/)
- [Git](https://git-scm.com/doc)
- [GitHub](https://docs.github.com/)
  - [GitHub Actions](https://docs.github.com/en/actions)
- [ESLint](https://eslint.org/docs/v8.x/)
- [Prettier](https://prettier.io/docs/en/)
- [Husky](https://typicode.github.io/husky/)
