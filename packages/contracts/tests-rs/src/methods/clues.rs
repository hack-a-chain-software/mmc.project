use serde::{Serialize, Deserialize};
use serde_json::json;
use workspaces::{
  result::{ExecutionResult},
  Contract, Account,
};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
use near_contract_standards::non_fungible_token::TokenId;
use crate::{transact_call, GAS_LIMIT};

pub const CLUE_STORAGE_DEPOSIT: u128 = 7090000000000000000000;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Guess {
  pub account_id: String,
  pub murderer: String,
  pub weapon: String,
  pub motive: String,
  pub random_number: String,
}

pub fn sample_token_metadata() -> TokenMetadata {
  TokenMetadata {
    title: Some("Olympus Mons".into()),
    description: Some("The tallest mountain in the charted solar system".into()),
    media: None,
    media_hash: None,
    copies: Some(1u64),
    issued_at: None,
    expires_at: None,
    starts_at: None,
    updated_at: None,
    extra: None,
    reference: None,
    reference_hash: None,
  }
}

pub async fn mint(
  contract: &Contract,
  caller: &Account,
  token_id: String,
  token_metadata: Option<TokenMetadata>,
) -> ExecutionResult<String> {
  transact_call(
    caller
      .call(&contract.as_account().id(), "mint")
      .args_json(json!({
       "token_id": token_id,
       "token_metadata": token_metadata,
      }))
      .deposit(CLUE_STORAGE_DEPOSIT)
      .gas(GAS_LIMIT),
  )
  .await
}

pub async fn view_hash(contract: &Contract, guess: Guess) -> anyhow::Result<String> {
  anyhow::Ok(
    contract
      .view(
        "view_hash",
        json!({ "guess": guess }).to_string().into_bytes(),
      )
      .await?
      .json()?,
  )
}

pub async fn view_user_tickets(contract: &Contract, account_id: String) -> anyhow::Result<u32> {
  anyhow::Ok(
    contract
      .view(
        "view_user_tickets",
        json!({ "account_id": account_id }).to_string().into_bytes(),
      )
      .await?
      .json()?,
  )
}

pub async fn view_if_clue_is_staked(contract: &Contract, token_id: String) -> anyhow::Result<bool> {
  anyhow::Ok(
    contract
      .view(
        "view_if_clue_is_staked",
        json!({ "token_id": token_id }).to_string().into_bytes(),
      )
      .await?
      .json()?,
  )
}

pub async fn view_guess_was_inserted(contract: &Contract, hash: String) -> anyhow::Result<bool> {
  anyhow::Ok(
    contract
      .view(
        "view_guess_was_inserted",
        json!({ "hash": hash }).to_string().into_bytes(),
      )
      .await?
      .json()?,
  )
}

pub async fn view_staked_guesses_contain(contract: &Contract, tuple: (String, String)) -> anyhow::Result<bool> {
  anyhow::Ok(
    contract
      .view(
        "view_staked_guesses_contain",
        json!({ "tuple": tuple }).to_string().into_bytes(),
      )
      .await?
      .json()?,
  )
}



pub async fn insert_token_price(
  contract: &Contract,
  caller: &Account,
  currency: String,
  price: String,
) -> ExecutionResult<String> {
  transact_call(
    caller
      .call(&contract.as_account().id(), "insert_token_price")
      .args_json(json!({
      "currency": currency,
      "price": price,
      }))
      .gas(GAS_LIMIT),
  )
  .await
}

pub async fn claim_rewards(
  contract: &Contract,
  caller: &Account,
  token_id: String,
) -> ExecutionResult<String> {
  transact_call(
    caller
      .call(&contract.as_account().id(), "claim_rewards")
      .args_json(json!({
      "token_id": token_id,
      }))
      .deposit(1)
      .gas(GAS_LIMIT),
  )
  .await
}

pub async fn claim_guess_rewards(
  contract: &Contract,
  caller: &Account,
  guess: Guess,
) -> ExecutionResult<String> {
  transact_call(
    caller
      .call(&contract.as_account().id(), "claim_guess_rewards")
      .args_json(json!({
      "guess": guess,
      }))
      .gas(GAS_LIMIT),
  )
  .await
}


pub async fn unstake_guess(
  contract: &Contract,
  caller: &Account,
  account_id: String,
  token_id: String,
  det_or_pup: String,
) -> ExecutionResult<String> {
  transact_call(
    caller
      .call(&contract.as_account().id(), "unstake_guess")
      .args_json(json!({
      "account_id": account_id,
      "token_id": token_id,
      "det_or_pup": det_or_pup,
      }))
      .deposit(1)
      .gas(GAS_LIMIT),
  )
  .await
}

pub async fn save_guess(
  contract: &Contract,
  caller: &Account,
  account_id: String,
  guess_hash: String,
) -> ExecutionResult<String> {
  transact_call(
    caller
      .call(&contract.as_account().id(), "save_guess")
      .args_json(json!({
      "account_id": account_id,
      "guess_hash": guess_hash,
      }))
      .deposit(1)
      .gas(GAS_LIMIT),
  )
  .await
}
