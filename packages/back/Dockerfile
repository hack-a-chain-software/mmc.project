# Build
FROM node:18 AS build

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

COPY yarn.lock /usr/src/app/
COPY packages/back /usr/src/app
RUN yarn install --frozen-lockfile
RUN yarn build

# Yarn v1 has no way to prune devDependencies, we should consider upgrading so the build runs faster
# We could also do the production installation on the production step, but then we would miss cache 
RUN rm -rf node_modules
RUN yarn install --prod --ignore-scripts --prefer-offline --frozen-lockfile
RUN yarn cache clean

# Prod
FROM node:18-bullseye-slim

LABEL org.opencontainers.image.source https://github.com/hack-a-chain-software/mmc.project

WORKDIR /usr/src/app
USER node

ENV NODE_ENV production

COPY --chown=node:node --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/dist /usr/src/app/dist
COPY --chown=node:node --from=build /usr/src/app/package.json /usr/src/app/

CMD ["dumb-init", "yarn", "start:prod"]
