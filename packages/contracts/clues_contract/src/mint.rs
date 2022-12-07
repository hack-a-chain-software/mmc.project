use near_sdk::{near_bindgen, env, assert_one_yocto};
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
    assert_one_yocto();
    self.assert_contract_owner();
    self.assert_token_unminted(&token_id);

    // TODO: token_metadata.assert_valid() ?

    self
      .tokens
      .internal_mint(token_id, env::current_account_id(), token_metadata)
  }
}

#[cfg(test)]
mod tests {
  use near_sdk::{AccountId, testing_env};
  use rstest::{rstest, fixture};

  use super::*;
  use crate::{
    test_utils::{fixtures::*, unwind},
    errors::UNAUTHORIZED_ERR,
  };

  #[fixture]
  fn unminted_token_id() -> TokenId {
    "#unminted".to_string()
  }

  #[rstest]
  fn test_mint(
    mut contract: Contract,
    owner: AccountId,
    unminted_token_id: TokenId,
    token_metadata: TokenMetadata,
  ) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(owner.clone());
    context.attached_deposit(1);
    testing_env!(context.build());

    // Act
    let token = contract.mint(unminted_token_id, Some(token_metadata));

    // Assert
    assert_eq!(token.owner_id, env::current_account_id());
  }

  #[rstest]
  fn test_mint_unauthorized(
    mut contract: Contract,
    account_id: AccountId,
    unminted_token_id: TokenId,
    token_metadata: TokenMetadata,
  ) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(account_id.clone());
    context.attached_deposit(1);
    testing_env!(context.build());

    // Act / Assert
    unwind::assert_unwind_error(
      move || contract.mint(unminted_token_id, Some(token_metadata)),
      UNAUTHORIZED_ERR,
    );
  }

  #[rstest]
  fn test_mint_minted(
    mut contract: Contract,
    owner: AccountId,
    token_id: TokenId,
    token_metadata: TokenMetadata,
  ) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(owner.clone());
    context.attached_deposit(1);
    testing_env!(context.build());

    // Act / Assert
    unwind::assert_unwind_error(
      move || contract.mint(token_id, Some(token_metadata)),
      DUPLICATE_TOKEN_ERR,
    );
  }
}
