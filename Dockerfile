#######################################
# Dependency Installation Stage
#######################################

FROM node:22.16-alpine3.22@sha256:41e4389f3d988d2ed55392df4db1420ad048ae53324a8e2b7c6d19508288107e \
  AS dependencies

LABEL org.opencontainers.image.source=https://github.com/tabletop-generator/ttg-server
  
# Tell node & npm to perform production environment optimizations
ENV NODE_ENV=production

# Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package.json package-lock.json ./

COPY prisma/schema.prisma ./

# Install node production dependencies defined in package-lock.json
# Since we set NODE_ENV=production, we don't need to use --production
RUN npm ci --ignore-scripts && \
    npx prisma generate

#######################################
# Final Stage
#######################################

FROM node:22.16-alpine3.22@sha256:41e4389f3d988d2ed55392df4db1420ad048ae53324a8e2b7c6d19508288107e \
  AS final
  
# Default to use port 8080 in our service
ENV PORT=8080

ENV NODE_ENV=production

WORKDIR /app

# Copy our HTPASSWD file from the build context
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# Install curl to run a health check on the API
# Don't need to update/upgrade when using --no-cache
# hadolint ignore=DL3018
RUN apk add --no-cache curl

# Copy package.json from the build context (the app imports data from it)
COPY --chown=node:node package.json ./

# Copy openapi.yaml (needed by express-openapi-validator)
COPY --chown=node:node openapi.yaml ./

# Copy node_modules from the dependency installation stage and
# change ownership to the unprivileged user
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

# Copy src to /app/src/ from the build context
COPY --chown=node:node ./src ./src

# Switch to the unprivileged user
# USER node

# Start the container by running our server
CMD ["node", "src/index.js"]

EXPOSE 8080

# Define a health check so Docker can test whether the container is healthy
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/ || exit 1
