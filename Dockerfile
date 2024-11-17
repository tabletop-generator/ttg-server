FROM node:20.18.0-alpine3.20@sha256:c13b26e7e602ef2f1074aef304ce6e9b7dd284c419b35d89fcf3cc8e44a8def9 \
  AS dependencies

ENV NODE_ENV=production

ENV NPM_CONFIG_LOGLEVEL=warn

ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

#######################################

FROM node:20.18.0-alpine3.20@sha256:c13b26e7e602ef2f1074aef304ce6e9b7dd284c419b35d89fcf3cc8e44a8def9 \
  AS build

ENV NODE_ENV=production

WORKDIR /app

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node ./tsconfig.json ./package.json ./

COPY --chown=node:node ./src ./src

RUN npm run build

#######################################

FROM node:20.18.0-alpine3.20@sha256:c13b26e7e602ef2f1074aef304ce6e9b7dd284c419b35d89fcf3cc8e44a8def9
  
ENV PORT=8080

ENV NODE_ENV=production

WORKDIR /app

RUN apk add --no-cache curl

COPY --chown=node:node package.json ./

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node --from=build /app/dist ./dist

USER node

CMD ["node", "dist/src/index.js"]

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/ || exit 1
