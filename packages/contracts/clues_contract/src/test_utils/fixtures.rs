use std::str::FromStr;

use near_contract_standards::non_fungible_token::{
  metadata::{NFTContractMetadata, TokenMetadata},
  TokenId,
};
use near_sdk::{test_utils::VMContextBuilder, AccountId, testing_env, env};
use rstest::fixture;

use crate::Contract;

pub fn get_context() -> VMContextBuilder {
  let mut context = VMContextBuilder::new();
  context.attached_deposit(6650000000000000000000);

  context
}

#[fixture]
pub fn contract_metadata() -> NFTContractMetadata {
  NFTContractMetadata {
    name: "Test".to_string(),
    spec: "nft-1.0.0".to_string(),
    symbol: "T".to_string(),
    reference: None,
    reference_hash: None,
    base_uri: None,
    icon: None,
  }
}

#[fixture]
pub fn owner() -> AccountId {
  AccountId::from_str("owner.near").unwrap()
}

#[fixture]
pub fn account_id() -> AccountId {
  AccountId::from_str("account.near").unwrap()
}

#[fixture]
pub fn detective_token() -> AccountId {
  AccountId::from_str("detectives.near").unwrap()
}

#[fixture]
pub fn token_id() -> TokenId {
  "#1".to_string()
}

#[fixture]
pub fn staked_token_id() -> TokenId {
  "#2".to_string()
}

#[fixture]
pub fn owned_token_id() -> TokenId {
  "#3".to_string()
}

#[fixture]
pub fn token_metadata() -> TokenMetadata {
  TokenMetadata {
    title: Some("Token".to_string()),
    description: Some("It is not fungible".to_string()),
    media: None,
    media_hash: None,
    copies: Some(1),
    issued_at: None,
    expires_at: None,
    starts_at: None,
    updated_at: None,
    extra: None,
    reference: None,
    reference_hash: None,
  }
}

#[fixture]
pub fn contract(
  owner: AccountId,
  contract_metadata: NFTContractMetadata,
  detective_token: AccountId,
  account_id: AccountId,
  token_id: TokenId,
  token_metadata: TokenMetadata,
  staked_token_id: TokenId,
  owned_token_id: TokenId,
) -> Contract {
  let context = get_context();
  testing_env!(context.build());

  let mut contract = Contract::new(owner, contract_metadata, detective_token);

  // Available token
  contract.tokens.internal_mint(
    token_id,
    env::current_account_id(),
    Some(token_metadata.clone()),
  );

  // Staked token
  contract.staked_tokens.insert(&staked_token_id, &account_id);

  contract.tokens.internal_mint(
    staked_token_id,
    account_id.clone(),
    Some(token_metadata.clone()),
  );

  // Owned token
  contract
    .tokens
    .internal_mint(owned_token_id, account_id, Some(token_metadata));

  contract
}
