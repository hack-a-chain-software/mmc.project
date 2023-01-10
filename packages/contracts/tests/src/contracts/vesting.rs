use workspaces::Account;

use crate::{transactions::deploy_contract, constants::gas::DEFAULT_GAS};
pub use client::*;

mod client {
  // TODO: figure out if we can import more structs instead of generating them from JSON schema
  use vesting_contract::schema::Schema; // TODO: figure out why this import was necessary

  near_abi_client::generate!(VestingClient for "abi/vesting_contract_abi.json");
}

const VESTING_WASM_BYTES: &[u8] = include_bytes!(env!("CARGO_CDYLIB_FILE_VESTING_CONTRACT"));

impl VestingClient {
  pub async fn deploy_and_initialize(
    contract_account: &Account,
    owner: &Account,
    token_contract: &Account,
  ) -> workspaces::Result<Self> {
    let vesting_client = Self {
      contract: deploy_contract(&contract_account, VESTING_WASM_BYTES).await?,
    };

    vesting_client
      .new(
        DEFAULT_GAS,
        0,
        owner.id().to_string(),
        token_contract.id().to_string(),
      )
      .await
      .and(Ok(vesting_client))
  }
}
