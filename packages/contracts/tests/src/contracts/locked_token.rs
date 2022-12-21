use workspaces::Account;

use crate::{transactions::deploy_contract, constants::gas::DEFAULT_GAS};
pub use client::*;

mod client {
  near_abi_client::generate!(LockedTokenClient for "abi/locked_token_abi.json");
}

const LOCKED_TOKEN_WASM_BYTES: &[u8] = include_bytes!(env!("CARGO_CDYLIB_FILE_LOCKED_TOKEN"));

impl LockedTokenClient {
  pub async fn deploy_and_initialize(
    contract_account: &Account,
    locked_token_name: String,
    locked_token_symbol: String,
    locked_token_icon: String,
    locked_token_decimals: u8,
    contract_config: ContractConfig,
  ) -> workspaces::Result<Self> {
    let locked_token_client = Self {
      contract: deploy_contract(&contract_account, LOCKED_TOKEN_WASM_BYTES).await?,
    };

    locked_token_client
      .new(
        DEFAULT_GAS,
        0,
        locked_token_name,
        locked_token_symbol,
        locked_token_icon,
        locked_token_decimals.into(),
        contract_config,
      )
      .await
      .and(Ok(locked_token_client))
  }
}
