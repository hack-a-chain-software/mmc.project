use borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::{
  AccountId,
  json_types::U128,
  env, near_bindgen, assert_one_yocto, Promise,
  collections::{Vector, UnorderedSet},
  BorshStorageKey,
};
use near_contract_standards::non_fungible_token::TokenId;

//

use crate::{
  Contract, ContractExt,
  errors::{
    STAKED_TOKEN_ERR, NFT_OWNER_ERR, REWARD_CLAIMED_ERR, SEASON_END_ERR, SEASON_NOT_END_ANS_ERR,
    ERR_NFT_NOT_STAKED, UNAUTHORIZED_ERR, ERR_CLUE_NOT_STAKED,
  },
  ext_interface::{self},
  BASE_GAS, StorageKey,
};

#[near_bindgen]
impl Contract {
  // Claiming the rewards transfers all the locked_tokens to the owner
  #[payable]
  pub fn claim_rewards(&mut self, token_id: TokenId) -> Promise {
    //ensure the function call is signed by a full-access key holder.
    assert_one_yocto();
    self.assert_season_is_over();

    //The user that is claiming the unstake function must be the owner of the NFT being unstaked
    let user: AccountId = env::predecessor_account_id();
    let user_staked_tokens = self
      .staked_tokens_owners
      .get(&user)
      .expect(ERR_CLUE_NOT_STAKED);

    assert!(
      user_staked_tokens.contains(&token_id),
      "{}",
      UNAUTHORIZED_ERR
    );

    let rewards: U128 = calculate_reward(token_id.clone());

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
}

impl Contract {
  pub fn stake(&mut self, token_id: TokenId, staker_id: AccountId) -> bool {
    // for reviewr -> should I validate if the signer id == staker id?
    self.assert_detective_transfer();
    self.assert_token_owner(&staker_id, &token_id);
    self.assert_token_unstaked(&token_id);
    self.assert_season_is_going();

    self.staked_tokens.insert(&token_id);
    let owners = self.staked_tokens_owners.get(&staker_id);

    if let Some(mut x) = owners {
      x.insert(&token_id);
      self.staked_tokens_owners.insert(&staker_id, &x);
    } else {
      let mut set: UnorderedSet<TokenId> = UnorderedSet::new(StorageKey::TokenIdSet {
        account: staker_id.clone(),
      });
      set.insert(&token_id);
      self.staked_tokens_owners.insert(&staker_id, &set);
    }

    true // signals to return token back to owner
  }
}
//TO-DO: implement the reward formula here -> Client still hasn't passed the reward formula for Clues
pub fn calculate_reward(token_id: TokenId) -> U128 {
  U128(100)
}

#[cfg(test)]
mod tests {

  use std::collections::HashMap;

  use near_sdk::{VMConfig, RuntimeFeesConfig, test_utils::accounts};

  use super::*;
  use crate::tests::*;

  pub const REWARD: U128 = U128(100);

  //TESTS:
  //1. stake - test_stake_normal_flow
  //2. stake two clues -> to test the if let Some() - test_stake_normal_flow
  //2. stake w/o detective  (PREDECESSOR) - should panic - test_stake_wrong_predecessor
  //3. stake not being the owner - should panic - test_stake_not_owner
  //4. stake token already staked - should panic - test_stake_twice()
  //5. stake before season begin - should panic   -> test_stake_before_begin
  //6. stake after season end - should panic -> test_stake_after_end
  //7. claim rewards ->  integration tests
  //8. claim reawards not being the owner
  //9. claim rewards not being staked

  //SEASON BEGIN/END  BEGIN: Timestamp = 0; END: Timestamp = 100_000_000;

  #[test]
  fn test_stake_normal_flow() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      DET_ACCOUNT.parse().unwrap(),
      1000,
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

    let token_id = "1";
    let token_id2 = "2";
    //generating an NFT to be staked
    contract.tokens.internal_mint(
      token_id.to_string(),
      accounts(0),
      Some(sample_token_metadata()),
    );

    contract.tokens.internal_mint(
      token_id2.to_string(),
      accounts(0),
      Some(sample_token_metadata()),
    );

    contract.stake(token_id.to_string(), accounts(0));

    assert!(contract.staked_tokens.contains(&token_id.to_string()));
    assert!(contract.staked_tokens_owners.contains_key(&accounts(0)));
    assert!(contract
      .staked_tokens_owners
      .get(&accounts(0))
      .unwrap()
      .contains(&token_id.to_string()));

    contract.stake(token_id2.to_string(), accounts(0));

    assert!(contract.staked_tokens.contains(&token_id.to_string()));
    assert!(contract.staked_tokens.contains(&token_id2.to_string()));
    assert!(contract.staked_tokens_owners.contains_key(&accounts(0)));
    assert!(contract
      .staked_tokens_owners
      .get(&accounts(0))
      .unwrap()
      .contains(&token_id.to_string()));
    assert!(contract
      .staked_tokens_owners
      .get(&accounts(0))
      .unwrap()
      .contains(&token_id2.to_string()));

    //contract.
  }

  #[test]
  #[should_panic(expected = "This function only works if the transfered NFT is a Detective NFT")]
  fn test_stake_wrong_predecessor() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      PUP_ACCOUNT.parse().unwrap(),
      1000,
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

    let token_id = "1";
    //generating an NFT to be staked
    contract.tokens.internal_mint(
      token_id.to_string(),
      accounts(0),
      Some(sample_token_metadata()),
    );
    contract.stake(token_id.to_string(), accounts(1));
  }

  #[test]
  #[should_panic(expected = "Unauthorized")]
  fn test_stake_not_owner() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      DET_ACCOUNT.parse().unwrap(),
      1000,
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

    let token_id = "1";
    //generating an NFT to be staked
    contract.tokens.internal_mint(
      token_id.to_string(),
      accounts(0),
      Some(sample_token_metadata()),
    );
    contract.stake(token_id.to_string(), accounts(1));
  }

  #[test]
  #[should_panic(expected = "Token is staked")]
  fn test_stake_twice() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      DET_ACCOUNT.parse().unwrap(),
      1000,
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

    let token_id = "1";
    //generating an NFT to be staked
    contract.tokens.internal_mint(
      token_id.to_string(),
      accounts(0),
      Some(sample_token_metadata()),
    );
    contract.stake(token_id.to_string(), accounts(0));
    contract.stake(token_id.to_string(), accounts(0));
  }

  #[test]
  #[should_panic(expected = "The season is not open yet to play")]
  fn test_stake_before_begin() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      DET_ACCOUNT.parse().unwrap(),
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

    let token_id = "1";
    //generating an NFT to be staked
    contract.tokens.internal_mint(
      token_id.to_string(),
      accounts(0),
      Some(sample_token_metadata()),
    );
    contract.stake(token_id.to_string(), accounts(0));
  }

  #[test]
  #[should_panic(expected = "The season is over - it is not possible to claim clues or guess")]
  fn test_stake_after_end() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      DET_ACCOUNT.parse().unwrap(),
      (END + 1000000),
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

    let token_id = "1";
    //generating an NFT to be staked
    contract.tokens.internal_mint(
      token_id.to_string(),
      accounts(0),
      Some(sample_token_metadata()),
    );
    contract.stake(token_id.to_string(), accounts(0));
  }

  #[test]
  #[should_panic(expected = "This CLUE was not staked")]
  fn test_claim_rewards_clue_not_staked() {
    let context = get_context_predecessor(
      vec![],
      1,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      accounts(0),
      (END + 1000),
      Gas(300u64 * 10u64.pow(12)),
    );
    testing_env!(
      context,
      VMConfig::test(),
      RuntimeFeesConfig::test(),
      HashMap::default(),
      Vec::default()
    );

    let token_id = "1";
    let mut contract = init_contract();
    contract.claim_rewards(token_id.to_string());
  }

  #[test]
  #[should_panic(expected = "The season is over - it is not possible to claim clues or guess")]
  fn test_claim_rewards_before_end() {
    let context = get_context_predecessor(
      vec![],
      1,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      accounts(0),
      (1_000),
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

    let token_id = "1";

    //contract.staked_tokens.insert(&token_id.to_string().clone());

    //let mut set: UnorderedSet<TokenId> = UnorderedSet::new(StorageKey::TokenIdSet {
    //  account: accounts(0),
    //});
    //set.insert(&token_id.to_string().clone());
    // contract.staked_tokens_owners.insert(&accounts(0), &set);
    contract.claim_rewards(token_id.to_string());
  }

  #[test]
  fn test_claim_rewards() {
    let context = get_context_predecessor(
      vec![],
      1,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      accounts(0),
      (END + 1000),
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

    let token_id = "1";

    contract.staked_tokens.insert(&token_id.to_string().clone());

    let mut set: UnorderedSet<TokenId> = UnorderedSet::new(StorageKey::TokenIdSet {
      account: accounts(0),
    });
    set.insert(&token_id.to_string().clone());
    contract.staked_tokens_owners.insert(&accounts(0), &set);

    //     contract.claim_rewards(token_id.to_string());
  }
}
