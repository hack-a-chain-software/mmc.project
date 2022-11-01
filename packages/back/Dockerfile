# Build
FROM node:18 AS build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app

COPY yarn.lock /usr/src/app/
COPY packages/back/package.json /usr/src/app/

RUN yarn install --prod

# Prod
FROM node:18-bullseye-slim

ENV NODE_ENV production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node

WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node packages/back /usr/src/app

CMD ["dumb-init", "yarn", "start:prod"]
