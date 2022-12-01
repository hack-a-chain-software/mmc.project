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
  use near_sdk::{test_utils::VMContextBuilder, AccountId};
  use rstest::fixture;

  use super::*;

  pub fn get_context() -> VMContextBuilder {
    VMContextBuilder::new()
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
  pub fn contract(owner: AccountId, contract_metadata: NFTContractMetadata) -> Contract {
    Contract::new(owner, contract_metadata)
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
}
