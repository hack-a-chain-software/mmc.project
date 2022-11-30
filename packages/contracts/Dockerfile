FROM rust:1.65.0

WORKDIR /usr/src/app

RUN rustup target add wasm32-unknown-unknown

COPY . .

RUN cargo build --target wasm32-unknown-unknown
RUN cd ./tests && cargo build

ENTRYPOINT ["./tests/target/debug/tests"]
