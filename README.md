# ttg-server

[![CI](https://github.com/tabletop-generator/ttg-server/actions/workflows/ci.yml/badge.svg)](https://github.com/tabletop-generator/ttg-server/actions/workflows/ci.yml)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)
- [Node.js v22.x 'Jod' (LTS)](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Setup

You will need to provide the following environment variables:

- `GROQ_API_KEY`: Your [Groq API key](https://console.groq.com/)
- `CF_ACCOUNT_ID`: Your Cloudflare account ID
- `CF_TOKEN`: Your [Cloudflare Workers AI API key](https://developers.cloudflare.com/workers-ai/)
- `CF_AIG_TOKEN`: Your [Cloudflare AI Gateway token](https://developers.cloudflare.com/ai-gateway/)
- `CF_AIG_NAME`: Your [Cloudflare AI Gateway name](https://developers.cloudflare.com/ai-gateway/)

You can use these environment variables to customize the AI models used:

- `GROQ_MODEL`: [Groq text generation model name](https://console.groq.com/docs/models) (the default is`gemma2-9b-it`)
- `CF_TEXT_TO_IMAGE_MODEL`: [Cloudflare Workers AI text-to-image model name](https://developers.cloudflare.com/workers-ai/models/) (the default is `@cf/stabilityai/stable-diffusion-xl-base-1.0`)

1. Clone the project to your workspace.

   ```bash
   git clone <url> ttg-server
   cd ttg-server
   ```

2. Create a .env file with development presets. Then enter your own environment variables from the links above.

   ```bash
   cp .env.example .env
   ```

3. Install and use the project's supported Node.js version.

   With nvm:

   ```bash
   nvm install
   ```

   With fnm:

   ```bash
   fnm install
   ```

4. Install dependencies.

   ```bash
   npm install
   ```

5. Generate Prisma Client

   ```bash
   npx prisma generate
   ```

6. Start backing services with Docker.

   ```bash
   docker compose up # -d to detach i.e. run in background
   ```

   This starts MinIO, creates the default bucket, and starts Postgres. Wait for the services to finish starting, it takes a while before they're ready.

7. Start the server on `localhost:8080` (or whatever `PORT` environment variable you specified)

   ```bash
   npm run start
   ```

## Solution Stack

- **Language:** [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **Server:** [Express](https://expressjs.com/en/4x/api.html)
  - **Logging:** [Pino](https://getpino.io/#/docs/api), [pino-pretty](https://github.com/pinojs/pino-pretty)
  - **Security:** [Helmet](https://helmetjs.github.io/), [Express/CORS](https://github.com/expressjs/cors#readme)
  - **Graceful Shutdown:** [Stoppable](https://github.com/hunterloftis/stoppable#readme)
  - **Rate Limiting:** [express-rate-limit](https://express-rate-limit.mintlify.app/)
- **Storage:** [Prisma](https://www.prisma.io/docs), [AWS SDK for JavaScript S3 Client](https://www.npmjs.com/package/@aws-sdk/client-s3)
- **Authorization:** [Passport.js](https://www.passportjs.org/)
  - **Production:** [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify#readme), [passport-http-bearer](https://www.passportjs.org/packages/passport-http-bearer/)
  - **Local:** [http-auth](https://www.npmjs.com/package/http-auth), [http-auth-passport](https://www.npmjs.com/package/http-auth-passport)
- **Testing:**
  - **Unit Testing:** [Jest](https://jestjs.io/), [Supertest](https://github.com/ladjs/supertest#readme)
  - **Integration Testing:** [Hurl](https://hurl.dev/)
- **Containerization:** [Docker](https://docs.docker.com/reference/)
- **Local Backing Services:** [Docker Compose](https://docs.docker.com/compose/), [Postgres Docker Image](https://hub.docker.com/_/postgres), [MinIO Docker Image](https://hub.docker.com/r/minio/minio)
- **Runtime:** [Node.js](https://nodejs.org/docs/latest-v22.x/api/)
- **Runners:** [nodemon](https://github.com/remy/nodemon#readme)
- **Package Manager:** [npm](https://docs.npmjs.com/)
- **Version Control System:** [Git](https://git-scm.com/doc), [GitHub](https://docs.github.com/)
- **CI/CD:** [GitHub Actions](https://docs.github.com/en/actions)
- **Linting:** [ESLint](https://eslint.org/docs/v9.x/)
- **Formatting:** [Prettier](https://prettier.io/docs/en/)
- **Git Hooks:**
  - [Husky](https://typicode.github.io/husky/)
  - [lint-staged](https://github.com/lint-staged/lint-staged)
