use near_sdk::serde::de::DeserializeOwned;
use workspaces::{
  operations::{CallTransaction, CreateAccountTransaction},
  result::{Result, ExecutionSuccess},
  Account, Contract,
};

use crate::constants::balances::{USER_ACCOUNT_BALANCE, CONTRACT_ACCOUNT_BALANCE};

pub async fn transact_call<'a>(call_transaction: CallTransaction<'a>) -> Result<ExecutionSuccess> {
  call_transaction
    .transact()
    .await?
    .into_result()
    .map_err(workspaces::error::Error::from)
}

#[allow(dead_code)]
pub async fn transact_call_json<'a, Response: DeserializeOwned>(
  call_transaction: CallTransaction<'a>,
) -> Result<Response> {
  transact_call(call_transaction)
    .await
    .and_then(|ok| ok.json::<Response>())
}

async fn transact_create_account<'a, 'b>(
  transaction: CreateAccountTransaction<'a, 'b>,
) -> Result<Account> {
  transaction
    .transact()
    .await?
    .into_result()
    .map_err(workspaces::error::Error::from)
}

pub async fn create_user_subaccount(tla: &Account, account_id: &str) -> Result<Account> {
  transact_create_account(
    tla
      .create_subaccount(account_id)
      .initial_balance(USER_ACCOUNT_BALANCE),
  )
  .await
}

pub async fn create_contract_subaccount(tla: &Account, account_id: &str) -> Result<Account> {
  transact_create_account(
    tla
      .create_subaccount(account_id)
      .initial_balance(CONTRACT_ACCOUNT_BALANCE),
  )
  .await
}

pub async fn deploy_contract(contract_account: &Account, wasm: &[u8]) -> Result<Contract> {
  contract_account
    .deploy(wasm)
    .await?
    .into_result()
    .map_err(workspaces::error::Error::from)
}
