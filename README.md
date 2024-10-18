# ttg-server

## Scripts

### Build

```bash
npm run build
```

Compile the TypeScript files in `src/` and output them to `dist/`.

```json
"build": "tsc"
```

### Start

```bash
npm run start
```

Run `dist/index.js`.

```json
"start": "node dist/index.js"
```

### Dev

```bash
npm run dev
```

Run a development server which reloads on changes to the source code.

```json
"dev": "cross-env LOG_LEVEL=debug nodemon --exec ts-node src/index.ts"
```

### Debug

Not intended for manual use. Used to configure the debugger in VSCode in `.vscode/launch.json`.

```json
"debug": "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/index.js --watch src"
```

### Format

```bash
npm run format
```

Format all files with Prettier.

```json
"format": "prettier --write ."
```

### Lint

```bash
npm run lint
```

Lint all files with ESLint.

```json
"lint": "eslint ."
```

### Prepare

Not intended for manual use. Used to run the pre-commit hook which formats and lints code before every commit.

```json
"prepare": "husky"
```
