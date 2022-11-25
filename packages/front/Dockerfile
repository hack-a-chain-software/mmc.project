# Build
FROM node:18 AS build

LABEL org.opencontainers.image.source https://github.com/hack-a-chain-software/mmc.project

WORKDIR /usr/src/app

COPY packages/front/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY yarn.lock /usr/src/app/
COPY packages/front /usr/src/app

RUN yarn install

ENTRYPOINT ["/entrypoint.sh"]

CMD ["yarn", "dev"]
