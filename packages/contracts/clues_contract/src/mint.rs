use near_sdk::{near_bindgen, env};
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;

use crate::errors::DUPLICATE_TOKEN_ERR;
use crate::{Contract, ContractExt};

impl Contract {
  fn assert_token_unminted(&self, token_id: &TokenId) {
    assert!(
      !self.tokens.owner_by_id.contains_key(&token_id),
      "{}",
      DUPLICATE_TOKEN_ERR
    );
  }
}

#[near_bindgen]
impl Contract {
  #[payable]
  pub fn mint(&mut self, token_id: TokenId, token_metadata: Option<TokenMetadata>) -> Token {
    //assert_one_yocto(); -> for reviewer: commented out bc it's necessary to attatch Near to mint
    self.assert_contract_owner();
    self.assert_token_unminted(&token_id);

    self
      .tokens
      .internal_mint(token_id, env::current_account_id(), token_metadata)
  }
}

#[cfg(test)]
mod tests {

  use std::collections::HashMap;

  use near_sdk::{VMConfig, RuntimeFeesConfig, test_utils::accounts};

  use super::*;
  use crate::tests::*;
  //TESTS:
  //1. MINT NORMAL FLOW
  //2. MINT W ACC THAT IS NOT THE OWNER
  //3. MINT TOKEN ALREADY MINTED

  #[test]
  fn test_mint_normal_flow() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      0,
      Gas(300u64 * 10u64.pow(12)),
    );
    testing_env!(
      context,
      VMConfig::test(),
      RuntimeFeesConfig::test(),
      HashMap::default(),
      Vec::default()
    );

    let mut contract = init_contract();

    let token_id: TokenId = "1".to_string();
    contract.mint(token_id.clone(), Some(sample_token_metadata()));

    //assert that the NFT was transfered to the actual owner
    assert_eq!(
      contract.tokens.owner_by_id.get(&token_id).unwrap(),
      CONTRACT_ACCOUNT.parse().unwrap()
    );
  }

  #[test]
  #[should_panic(expected = "Unauthorized")]
  fn test_mint_not_owner() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      0,
      Gas(300u64 * 10u64.pow(12)),
    );
    testing_env!(
      context,
      VMConfig::test(),
      RuntimeFeesConfig::test(),
      HashMap::default(),
      Vec::default()
    );

    let mut contract = init_contract();

    let token_id: TokenId = "1".to_string();
    contract.mint(token_id.clone(), Some(sample_token_metadata()));
  }

  #[test]
  #[should_panic(expected = "A token with the specified ID already exists")]
  fn test_mint_already_minted() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      0,
      Gas(300u64 * 10u64.pow(12)),
    );
    testing_env!(
      context,
      VMConfig::test(),
      RuntimeFeesConfig::test(),
      HashMap::default(),
      Vec::default()
    );

    let mut contract = init_contract();

    let token_id: TokenId = "1".to_string();
    //mint once
    contract.mint(token_id.clone(), Some(sample_token_metadata()));

    //mint twice the same token
    contract.mint(token_id.clone(), Some(sample_token_metadata()));
  }
}
