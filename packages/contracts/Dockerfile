# TODO: replace this with 1.67 if/when they stabilize bindeps and per-package-target
FROM rustlang/rust:nightly-bullseye@sha256:fb5569710ad2531c551889c46e2e460646bbcdc0c731193ac080dd80fb0a0f6a

EXPOSE 1337
EXPOSE 1338

WORKDIR /usr/src/app

RUN rustup target add wasm32-unknown-unknown

COPY . .

RUN cargo build

ENTRYPOINT ["./target/debug/tests"]
