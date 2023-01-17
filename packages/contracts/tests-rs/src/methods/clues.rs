use serde::{Serialize, Deserialize};
use serde_json::json;
use workspaces::{
  result::{ExecutionResult},
  Contract, Account,
};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
use crate::{transact_call, GAS_LIMIT};

pub const CLUE_STORAGE_DEPOSIT: u128 = 7090000000000000000000;

#[derive(Serialize, Deserialize)]
pub struct Guess {
  account_id: String,
  murderer: String,
  weapon: String,
  motive: String,
  random_number: String,
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

pub async fn claim_guess_rewards(contract: &Contract, guess: Guess) -> anyhow::Result<String> {
  anyhow::Ok(
    contract
      .view(
        "claim_guess_rewards",
        json!({ "guess": guess }).to_string().into_bytes(),
      )
      .await?
      .json()?,
  )
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


pub async fn prove_ownership(
    contract: &Contract,
    caller: &Account,
    account_id: String,
  ) -> ExecutionResult<String> {
    transact_call(
      caller
        .call(&contract.as_account().id(), "prove_ownership")
        .args_json(json!({
         "account_id": account_id,
        }))
        .deposit(CLUE_STORAGE_DEPOSIT)
        .gas(GAS_LIMIT),
    )
    .await
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
        .deposit(CLUE_STORAGE_DEPOSIT)
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
        .deposit(CLUE_STORAGE_DEPOSIT)
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
            .deposit(CLUE_STORAGE_DEPOSIT)
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
                .deposit(CLUE_STORAGE_DEPOSIT)
                .gas(GAS_LIMIT),
            )
            .await
          }


