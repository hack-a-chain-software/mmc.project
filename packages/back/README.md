# MMC Backend

## Description

This repository contains the source-code for the MMC Project backend. Its written in TypeScript, with [NestJS](https://docs.nestjs.com) as its framework. 

## Installation

```bash
$ yarn
```

## Running the app

See also the [environment section](#environment).

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Environment
In order to run the app both locally and in production, the following environment variables should be present in your `.env` file:

- `RECEIVER_ID`: the account ID of the MMC smart contract
- `NEAR_NETWORK`: the type of network you want to run against (e.g. testnet, mainnet)
- `NEAR_NODE_URL`: the URL for the Near RPC node you want to use
- `JWT_SECRET`: a securely generated random password that's not used anywhere else
- `JWT_VALID_FOR_S`: how long you want users to be authenticated, in seconds. It's a fine trade-off between UX and security, but something like 180 (3 minutes) should be ok
- `AUTH_MESSAGE_VALID_FOR_MS`: read the #[authentication docs](./docs/authentication.md) for more information. Something around 60000 (1 minute) should work.