pub use units::*;

#[allow(dead_code)]
mod units {
  pub const UNIT_TO_NANO: u64 = 1_000_000_000;

  pub const AVERAGE_BLOCK_TIME_NS: u64 = 1_200_000_000;

  pub const fn seconds_to_blocks(seconds: u64) -> u64 {
    seconds * UNIT_TO_NANO / AVERAGE_BLOCK_TIME_NS
  }
}
