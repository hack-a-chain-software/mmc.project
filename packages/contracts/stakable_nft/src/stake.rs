use near_sdk::{near_bindgen, env};
use near_contract_standards::non_fungible_token::TokenId;

use crate::{Contract, ContractExt};

const STAKED_TOKEN_ERR: &'static str = "Token is already staked";
const UNAUTHORIZED_ERR: &'static str = "Unauthorized";

#[near_bindgen]
impl Contract {
  #[payable]
  pub fn stake(&mut self, token_id: &TokenId) {
    let staker_id = env::predecessor_account_id();

    /*
     *   This assertion has two purposes:
     *      1. Provides a better error message in case of an accidental duplicated stake call
     *      2. Prevents the contract to double stake a token and steal it (as the contract owns staked tokens)
     */
    assert!(!self.is_token_staked(&token_id), "{}", STAKED_TOKEN_ERR);
    assert!(
      self.is_token_owner(&staker_id, &token_id),
      "{}",
      UNAUTHORIZED_ERR
    );

    // TODO: check if staker owns detective/pup NFT

    self.tokens.internal_transfer(
      &staker_id,
      &env::current_account_id(),
      &token_id,
      None,
      None,
    );

    self.staked_tokens.insert(&token_id, &staker_id);
  }
}

#[allow(unused_imports)]
#[cfg(test)]
mod tests {
  use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
  use near_sdk::{testing_env, AccountId};
  use rstest::rstest;

  use super::*;
  use crate::tests::*;

  #[rstest]
  pub fn test_stake(
    mut contract: Contract,
    owner: AccountId,
    token_id: TokenId,
    token_metadata: TokenMetadata,
  ) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(owner.clone());
    context.attached_deposit(5650000000000000000000);
    testing_env!(context.build());

    contract
      .tokens
      .internal_mint(token_id.clone(), owner.clone(), Some(token_metadata));

    // Act
    contract.stake(&token_id);

    // Assert
    assert!(contract.is_token_owner(&env::current_account_id(), &token_id));
    assert_eq!(contract.staked_tokens.get(&token_id), Some(owner));
  }

  #[rstest]
  pub fn test_stake_staked(
    mut contract: Contract,
    owner: AccountId,
    token_id: TokenId,
    token_metadata: TokenMetadata,
  ) {
    // Arrange
    let mut context = get_context();
    context.predecessor_account_id(owner.clone());
    context.attached_deposit(5650000000000000000000);
    testing_env!(context.build());

    contract
      .tokens
      .internal_mint(token_id.clone(), owner.clone(), Some(token_metadata));

    contract.staked_tokens.insert(&token_id, &owner);

    std::panic::set_hook(Box::new(|_| {}));

    // Act
    let panicked = std::panic::catch_unwind(move || {
      contract.stake(&token_id);
    });

    // Assert
    assert!(panicked.is_err());
  }
}
