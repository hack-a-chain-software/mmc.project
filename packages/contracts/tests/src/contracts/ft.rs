use serde_json::json;
use workspaces::{Account, Contract};
use near_contract_standards::fungible_token::metadata::FungibleTokenMetadata;

use crate::{
  constants::gas::GAS_LIMIT,
  transactions::{deploy_contract, transact_call_json, transact_call},
};

const FT_WASM_BYTES: &[u8] = include_bytes!("../../../target/wasm32-unknown-unknown/release/fungible_token.wasm");

pub struct FtContract {
  contract: Contract,
}

impl FtContract {
  pub async fn deploy_and_initialize(
    contract_account: Account,
    owner: &Account,
    total_supply: u128,
    metadata: FungibleTokenMetadata,
  ) -> workspaces::Result<Self> {
    metadata.assert_valid();

    let ft_contract = Self {
      contract: deploy_contract(&contract_account, FT_WASM_BYTES).await?,
    };

    let call_transaction = ft_contract.contract.call("new").args_json(json!({
      "owner_id": owner.id(),
      "total_supply": total_supply.to_string(),
      "metadata": metadata
    }));

    transact_call(call_transaction).await.and(Ok(ft_contract))
  }

  pub async fn ft_transfer(
    &self,
    sender: &Account,
    receiver: &Account,
    amount: u128,
    memo: Option<&str>,
  ) -> workspaces::Result<()> {
    let call_transaction = sender
      .call(self.contract.id(), "ft_transfer")
      .args_json(json!({
        "receiver_id": receiver.id(),
        "amount": amount.to_string(),
        "memo": memo,
      }))
      .deposit(1)
      .gas(GAS_LIMIT);

    transact_call_json::<()>(call_transaction).await
  }

  pub async fn ft_transfer_call(
    &self,
    sender: &Account,
    receiver: &Account,
    amount: u128,
    msg: String,
  ) -> workspaces::Result<()> {
    let call_transaction = sender
      .call(self.contract.id(), "ft_transfer_call")
      .args_json(json!({
        "receiver_id": receiver.id(),
        "amount": amount.to_string(),
        "memo": null,
        "msg": msg
      }))
      .deposit(1)
      .gas(GAS_LIMIT);

    transact_call_json::<()>(call_transaction).await
  }

  pub async fn ft_balance_of(&self, account: &Account) -> workspaces::Result<u128> {
    self
      .contract
      .view(
        "ft_balance_of",
        json!({
          "account_id": account.id()
        })
        .to_string()
        .into_bytes(),
      )
      .await?
      .json::<String>()
      .map(|s| u128::from_str_radix(s.as_str(), 10).unwrap())
  }
}
