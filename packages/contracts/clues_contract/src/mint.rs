use near_sdk::{near_bindgen, env};
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;

use crate::{Contract, ContractExt};

#[near_bindgen]
impl Contract {
  #[payable]
  pub fn mint(&mut self, token_id: TokenId, token_metadata: Option<TokenMetadata>) -> Token {
    self.assert_owner(&env::predecessor_account_id());

    assert!(
      !self.tokens.owner_by_id.contains_key(&token_id),
      "A token with the specified ID already exists"
    );

    self
      .tokens
      .internal_mint(token_id, env::current_account_id(), token_metadata)
  }

  #[payable]
  pub fn pick(&mut self, token_id: TokenId) {
    self.assert_token_available(&token_id);

    self.tokens.internal_transfer(
      &env::current_account_id(),
      &env::predecessor_account_id(),
      &token_id,
      None,
      None,
    );
  }
}

#[cfg(test)]
mod tests {
  use near_sdk::{AccountId, testing_env};
  use rstest::{rstest, fixture};

  use super::*;
  use crate::tests::*;

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
    testing_env!(context.build());

    // Act
    let panicked =
      std::panic::catch_unwind(move || contract.mint(unminted_token_id, Some(token_metadata)));

    // Assert
    assert!(panicked.is_err());
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
    testing_env!(context.build());

    // Act
    let panicked = std::panic::catch_unwind(move || contract.mint(token_id, Some(token_metadata)));

    // Assert
    assert!(panicked.is_err());
  }

  #[rstest]
  fn test_pick(mut contract: Contract, account_id: AccountId, token_id: TokenId) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(account_id);
    testing_env!(context.build());

    // Act
    contract.pick(token_id);

    // Assert
  }

  #[rstest]
  fn test_pick_unavailable(
    mut contract: Contract,
    account_id: AccountId,
    staked_token_id: TokenId,
  ) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(account_id);
    testing_env!(context.build());

    // Act
    let panicked = std::panic::catch_unwind(move || contract.pick(staked_token_id));

    // Assert
    assert!(panicked.is_err());
  }
}
