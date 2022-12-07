use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{AccountId, env};

use crate::{Contract, errors::UNAVAILABLE_ERR};

impl Contract {
  fn assert_token_available(&self, token_id: &TokenId) {
    let is_owned_by_contract = self.is_token_owner(&env::current_account_id(), token_id);

    assert!(is_owned_by_contract, "{}", UNAVAILABLE_ERR);
  }

  pub fn pick(&mut self, token_id: TokenId, account_id: AccountId) -> bool {
    self.assert_detective_transfer();
    self.assert_token_available(&token_id);

    self.tokens.internal_transfer(
      &env::current_account_id(),
      &account_id,
      &token_id,
      None,
      None,
    );

    true // signals to return token back to owner
  }
}

#[cfg(test)]
mod tests {
  use near_sdk::testing_env;
  use rstest::rstest;

  use super::*;
  use crate::{
    test_utils::{fixtures::*, unwind},
    errors::UNAUTHORIZED_ERR,
  };

  #[rstest]
  fn test_pick(mut contract: Contract, account_id: AccountId, token_id: TokenId) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    // Act
    let returned_detective = contract.pick(token_id.clone(), account_id.clone());

    // Assert
    assert_eq!(
      contract.tokens.owner_by_id.get(&token_id).unwrap(),
      account_id
    );

    assert!(returned_detective);
  }

  #[rstest]
  fn test_pick_unavailable(
    mut contract: Contract,
    account_id: AccountId,
    staked_token_id: TokenId,
  ) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    // Act / Assert
    unwind::assert_unwind_error(
      move || contract.pick(staked_token_id, account_id),
      UNAVAILABLE_ERR,
    );
  }

  #[rstest]
  pub fn test_pick_predecessor(mut contract: Contract, account_id: AccountId, token_id: TokenId) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(account_id.clone());
    testing_env!(context.build());

    // Act / Assert
    unwind::assert_unwind_error(
      move || contract.pick(token_id, account_id),
      UNAUTHORIZED_ERR,
    );
  }

  #[rstest]
  fn test_assert_token_available(contract: Contract, token_id: TokenId) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    // Act / Assert
    contract.assert_token_available(&token_id);
  }

  #[rstest]
  fn test_assert_token_available_owned(contract: Contract, owned_token_id: TokenId) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    // Act / Assert
    unwind::assert_unwind_error(
      || contract.assert_token_available(&owned_token_id),
      UNAVAILABLE_ERR,
    );
  }
}
