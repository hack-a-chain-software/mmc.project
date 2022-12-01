use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise, PromiseOrValue};
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};
use near_contract_standards::non_fungible_token::metadata::{
  NonFungibleTokenMetadataProvider, NFTContractMetadata,
};
use near_contract_standards::{
  impl_non_fungible_token_approval, impl_non_fungible_token_core,
  impl_non_fungible_token_enumeration,
};

mod auth;
mod mint;
mod stake;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
  tokens: NonFungibleToken,
  metadata: LazyOption<NFTContractMetadata>,
  staked_tokens: LookupMap<TokenId, AccountId>,
}

#[near_bindgen]
impl Contract {
  #[init]
  pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
    assert!(!env::state_exists(), "Already initialized");
    metadata.assert_valid();

    Contract {
      tokens: NonFungibleToken::new(b'a', owner_id, Some(b'b'), Some(b'c'), Some(b'd')),
      metadata: LazyOption::new(b'e', Some(&metadata)),
      staked_tokens: LookupMap::new(b'f'),
    }
  }
}

impl_non_fungible_token_core!(Contract, tokens);
impl_non_fungible_token_approval!(Contract, tokens);
impl_non_fungible_token_enumeration!(Contract, tokens);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
  fn nft_metadata(&self) -> NFTContractMetadata {
    self.metadata.get().unwrap()
  }
}

#[cfg(test)]
pub(crate) mod tests {
  use std::str::FromStr;

  use near_contract_standards::non_fungible_token::metadata::{NFTContractMetadata, TokenMetadata};
  use near_sdk::{test_utils::VMContextBuilder, AccountId, testing_env};
  use rstest::fixture;

  use super::*;

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
  pub fn token_id() -> TokenId {
    "#1".to_string()
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
  pub fn staked_token_id() -> TokenId {
    "#2".to_string()
  }

  #[fixture]
  pub fn owned_token_id() -> TokenId {
    "#3".to_string()
  }

  #[fixture]
  pub fn contract(
    owner: AccountId,
    contract_metadata: NFTContractMetadata,
    account_id: AccountId,
    token_id: TokenId,
    token_metadata: TokenMetadata,
    staked_token_id: TokenId,
    owned_token_id: TokenId,
  ) -> Contract {
    let context = get_context();
    testing_env!(context.build());

    let mut contract = Contract::new(owner, contract_metadata);

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
      env::current_account_id(),
      Some(token_metadata.clone()),
    );

    // Owned token
    contract
      .tokens
      .internal_mint(owned_token_id, account_id, Some(token_metadata));

    contract
  }
}
