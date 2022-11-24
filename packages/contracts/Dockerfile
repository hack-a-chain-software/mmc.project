# Build cache
FROM rust:1.65 as build_cache

WORKDIR /tmp
COPY . .

## Filter dependencies declarations and locks
RUN mkdir ./cache && \
    find ./ -regextype posix-egrep -regex ".*/Cargo\.(toml|lock)" | \
    xargs cp --parents -t ./cache

# Build
FROM rust:1.65 as build

RUN USER=root cargo new --bin contracts
WORKDIR /contracts

COPY --from=build_cache /tmp/cache .

## First build just to cache dependencies
RUN cargo build --target wasm32-unknown-unknown --release
RUN cd ./tests && cargo build --release
RUN rm */src/*.rs

## Second build that actually generates the binaries
COPY . .
RUN cargo build --target wasm32-unknown-unknown --release
RUN cd ./tests && cargo build --release

# Run
FROM rust:1.65-slim-buster

COPY --from=build /contracts/target/release/ .

RUN ["./target/release/tests"]
