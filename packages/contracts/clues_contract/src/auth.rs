use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{AccountId, env};

use crate::{
  Contract,
  errors::{INEXISTENT_ERR, UNAUTHORIZED_ERR},
};

impl Contract {
  pub fn is_token_owner(&self, account_id: &AccountId, token_id: &TokenId) -> bool {
    let owner_id = self
      .tokens
      .owner_by_id
      .get(&token_id)
      .expect(INEXISTENT_ERR);

    account_id == &owner_id
  }

  pub fn assert_token_owner(&self, account_id: &AccountId, token_id: &TokenId) {
    assert!(
      self.is_token_owner(&account_id, &token_id),
      "{}",
      UNAUTHORIZED_ERR
    );
  }

  pub fn assert_contract_owner(&self) {
    assert_eq!(
      env::predecessor_account_id(),
      self.tokens.owner_id,
      "{}",
      UNAUTHORIZED_ERR
    );
  }

  pub fn assert_detective_transfer(&self) {
    assert_eq!(
      env::predecessor_account_id(),
      self.detective_token_address,
      "{}",
      UNAUTHORIZED_ERR
    );
  }

  pub fn assert_fungible_token_is_listed(&self, ft_account: AccountId) -> bool {
    self.fungible_tokens.contains(&ft_account)
  }

  pub fn assert_pups_transfer(&self) {
    assert_eq!(
      env::predecessor_account_id(),
      self.pups_token_address,
      "{}",
      UNAUTHORIZED_ERR
    );
  }

  pub fn assert_pups_or_det_transfer(&self) {
    let is_pup = (env::predecessor_account_id() == self.pups_token_address);
    let is_det = (env::predecessor_account_id() == self.detective_token_address);

    assert!((is_pup || is_det), "{}", UNAUTHORIZED_ERR)
  }
}

#[cfg(test)]
mod tests {
  use near_sdk::{AccountId, testing_env};
  use rstest::rstest;

  use super::*;
  use crate::test_utils::{fixtures::*, unwind};

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
  fn test_assert_contract_owner(contract: Contract, owner: AccountId) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(owner);
    testing_env!(context.build());

    // Act / Assert
    contract.assert_contract_owner();
  }

  #[rstest]
  fn test_assert_contract_owner_unauthorized(contract: Contract, account_id: AccountId) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(account_id);
    testing_env!(context.build());

    // Act / Assert
    unwind::assert_unwind_error(|| contract.assert_contract_owner(), UNAUTHORIZED_ERR);
  }
}
