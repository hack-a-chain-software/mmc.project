use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{AccountId, env};

use crate::Contract;

impl Contract {
  pub fn is_token_owner(&self, account_id: &AccountId, token_id: &TokenId) -> bool {
    self
      .tokens
      .owner_by_id
      .get(&token_id)
      .map(|id| &id == account_id)
      .unwrap_or(false)
  }

  pub fn is_token_staked(&self, token_id: &TokenId) -> bool {
    self.staked_tokens.contains_key(&token_id)
  }

  pub fn assert_token_available(&self, token_id: &TokenId) {
    let is_owned_by_contract = self.is_token_owner(&env::current_account_id(), token_id);
    let is_staked = self.is_token_staked(token_id);

    assert!(
      is_owned_by_contract && !is_staked,
      "Token was already picked"
    );
  }

  pub fn assert_owner(&self, account_id: &AccountId) {
    assert_eq!(account_id, &self.tokens.owner_id, "Unauthorized");
  }
}

#[cfg(test)]
mod tests {
  use near_sdk::{AccountId, testing_env};
  use rstest::rstest;

  use super::*;
  use crate::tests::*;

  #[rstest]
  fn test_is_token_owner(mut contract: Contract, account_id: AccountId, token_id: TokenId) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    contract.tokens.internal_transfer(
      &env::current_account_id(),
      &account_id,
      &token_id,
      None,
      None,
    );

    // Act
    let is_owner = contract.is_token_owner(&account_id, &token_id);

    // Assert
    assert!(is_owner);
  }

  #[rstest]
  fn test_is_token_owner_unauthorized(
    contract: Contract,
    account_id: AccountId,
    token_id: TokenId,
  ) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    // Act
    let is_owner = contract.is_token_owner(&account_id, &token_id);

    // Assert
    assert!(!is_owner);
  }

  #[rstest]
  fn test_assert_owner(contract: Contract, owner: AccountId) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    // Act / Assert
    contract.assert_owner(&owner);
  }

  #[rstest]
  fn test_assert_owner_unauthorized(contract: Contract, account_id: AccountId) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    // Act
    let panicked = std::panic::catch_unwind(|| {
      contract.assert_owner(&account_id);
    });

    // Assert
    assert!(panicked.is_err());
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
  fn test_assert_token_available_staked(contract: Contract, staked_token_id: TokenId) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    std::panic::set_hook(Box::new(|_| {}));

    // Act
    let panicked = std::panic::catch_unwind(|| {
      contract.assert_token_available(&staked_token_id);
    });

    // Assert
    assert!(panicked.is_err());
  }

  #[rstest]
  fn test_assert_token_available_owned(contract: Contract, owned_token_id: TokenId) {
    // Arrange
    let context = get_context();
    testing_env!(context.build());

    std::panic::set_hook(Box::new(|_| {}));

    // Act
    let panicked = std::panic::catch_unwind(|| {
      contract.assert_token_available(&owned_token_id);
    });

    // Assert
    assert!(panicked.is_err());
  }
}
