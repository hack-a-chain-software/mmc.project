use near_sdk::{
  AccountId, json_types::U128, env, near_bindgen, assert_one_yocto, ext_contract, Promise,
};
use near_contract_standards::non_fungible_token::TokenId;

use crate::{
  Contract, ContractExt,
  errors::{STAKED_TOKEN_ERR, NFT_OWNER_ERR, REWARD_CLAIMED_ERR},
  ext_interface::{*, self},
  BASE_GAS,
};

#[near_bindgen]
impl Contract {
  // Claiming the rewards transfers all the locked_tokens to the owner
  #[payable]
  pub fn claim_rewards(&mut self, token_id: TokenId) -> Promise {
    //ensure the function call is signed by a full-access key holder.
    assert_one_yocto();
    self.is_token_staked(&token_id.clone());
    assert!(
      !self.used_tokens.contains(&token_id),
      "{}",
      REWARD_CLAIMED_ERR
    );

    //The user that is claiming the unstake function must be the owner of the NFT being unstaked
    let user = env::predecessor_account_id();
    let staked_token_owner = self.staked_tokens.get(&token_id.clone()).unwrap();
    assert!(user == staked_token_owner, "{}", NFT_OWNER_ERR);

    let rewards: U128 = calculate_reward(token_id.clone());

    self.used_tokens.insert(&token_id.clone());
    self.staked_tokens.remove(&token_id);

    ext_interface::token_contract::ext(self.locked_tokens_address.clone())
      .with_static_gas(BASE_GAS)
      .with_attached_deposit(1)
      .ft_transfer(
        user.clone().to_string(),
        rewards,
        "Clues reward".to_string(),
      )
      .then(
        ext_interface::ext_self::ext(env::current_account_id())
          .with_static_gas(BASE_GAS)
          .undo_transfer(token_id, user),
      )
  }

  /// Unstake function allows users to unstake their NFTs even if they did not
  /// claim their rewards - be careful
  #[payable]
  pub fn unstake(&mut self, token_id: TokenId) {
    //ensure the function call is signed by a full-access key holder.
    assert_one_yocto();

    //The user that is claiming the unstake function must be the owner of the NFT being unstaked
    let user = env::predecessor_account_id();
    let staked_token_owner = self.staked_tokens.get(&token_id.clone()).unwrap();
    assert!(user == staked_token_owner, "{}", NFT_OWNER_ERR);

    //For reviewer: I am im doubt if its the best approach to insert the NFT on the removed tokens list
    if !self.used_tokens.contains(&token_id) {
      self.used_tokens.insert(&token_id.clone());
    }
    self.staked_tokens.remove(&token_id);

    // Transfer the NFT back to the owner
    self
      .tokens
      .internal_transfer(&env::current_account_id(), &user, &token_id, None, None);
  }

  /// Unstake function allows users to unstake their NFTs even if they did not
  /// claim their rewards - be careful
  #[payable]
  #[private]
  pub fn unstake_for_callback(&mut self, token_id: TokenId, user_id: AccountId) {
    //ensure the function call is signed by a full-access key holder.
    assert_one_yocto();

    self
      .tokens
      .internal_transfer(&env::current_account_id(), &user_id, &token_id, None, None);
  }
}

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
//TO-DO: implement the reward formula here -> Client still hasn't passed the reward formula for Clues
pub fn calculate_reward(token_id: TokenId) -> U128 {
  U128(100)
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
