use workspaces::Account;

use crate::{transactions::deploy_contract, constants::gas::DEFAULT_GAS};
pub use client::*;

mod client {
  near_abi_client::generate!(FungibleTokenClient for "abi/fungible_token_abi.json");
}

const FT_WASM_BYTES: &[u8] = include_bytes!(env!("CARGO_CDYLIB_FILE_FUNGIBLE_TOKEN"));

impl FungibleTokenClient {
  pub async fn deploy_and_initialize(
    contract_account: &Account,
    owner: &Account,
    metadata: FungibleTokenMetadata,
  ) -> workspaces::Result<Self> {
    let ft_client = Self {
      contract: deploy_contract(&contract_account, FT_WASM_BYTES).await?,
    };

    ft_client
      .new(DEFAULT_GAS, 0, owner.id().to_string(), metadata)
      .await?;

    Ok(ft_client)
  }
}
