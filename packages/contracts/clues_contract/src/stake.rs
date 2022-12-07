use near_sdk::AccountId;
use near_contract_standards::non_fungible_token::TokenId;

use crate::{Contract, errors::STAKED_TOKEN_ERR};

impl Contract {
  fn is_token_staked(&self, token_id: &TokenId) -> bool {
    self.staked_tokens.contains_key(&token_id)
  }

  pub fn assert_token_unstaked(&self, token_id: &TokenId) {
    assert!(!self.is_token_staked(&token_id), "{}", STAKED_TOKEN_ERR);
  }

  pub fn stake(&mut self, token_id: TokenId, staker_id: AccountId) -> bool {
    self.assert_detective_transfer();
    self.assert_token_owner(&staker_id, &token_id);
    self.assert_token_unstaked(&token_id);

    self.staked_tokens.insert(&token_id, &staker_id);

    true // signals to return token back to owner
  }
}

#[cfg(test)]
mod tests {
  use near_sdk::{testing_env, AccountId};
  use rstest::rstest;

  use super::*;
  use crate::{
    test_utils::{fixtures::*, unwind},
    errors::UNAUTHORIZED_ERR,
  };

  #[rstest]
  pub fn test_stake(mut contract: Contract, account_id: AccountId, owned_token_id: TokenId) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(contract.detective_token_address.clone());
    testing_env!(context.build());

    // Act
    let returned_detective = contract.stake(owned_token_id.clone(), account_id.clone());

    // Assert
    assert_eq!(
      contract.staked_tokens.get(&owned_token_id),
      Some(account_id)
    );

    assert!(returned_detective);
  }

  #[rstest]
  pub fn test_stake_staked(
    mut contract: Contract,
    account_id: AccountId,
    staked_token_id: TokenId,
  ) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(contract.detective_token_address.clone());
    testing_env!(context.build());

    // Act / Assert
    unwind::assert_unwind_error(
      move || contract.stake(staked_token_id, account_id),
      STAKED_TOKEN_ERR,
    );
  }

  #[rstest]
  pub fn test_stake_owned(mut contract: Contract, owner: AccountId, owned_token_id: TokenId) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(contract.detective_token_address.clone());
    testing_env!(context.build());

    // Act / Assert
    unwind::assert_unwind_error(
      move || contract.stake(owned_token_id, owner),
      UNAUTHORIZED_ERR,
    );
  }

  #[rstest]
  pub fn test_stake_predecessor(
    mut contract: Contract,
    account_id: AccountId,
    owned_token_id: TokenId,
  ) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(account_id.clone());
    testing_env!(context.build());

    // Act / Assert
    unwind::assert_unwind_error(
      move || contract.stake(owned_token_id, account_id),
      UNAUTHORIZED_ERR,
    );
  }
}
