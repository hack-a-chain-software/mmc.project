use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{AccountId, env, collections::UnorderedMap};

use crate::{
  Contract,
  errors::{
    INEXISTENT_ERR, UNAUTHORIZED_ERR, UNACC_TOKEN_ERR, NO_PROOF_ERR, EXPIRED_TIME_ERR,
    SEASON_END_ERR, ERR_SEASON_NOT_OPEN, STAKED_TOKEN_ERR, GUESSING_NOT_OPEN, NOT_A_DET_ERROR,
  },
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

  pub fn assert_season_is_going(&self) {
    assert!(
      env::block_timestamp() >= self.season_begin,
      "{}",
      ERR_SEASON_NOT_OPEN
    );

    assert!(
      env::block_timestamp() <= self.season_end,
      "{}",
      SEASON_END_ERR
    );
  }

  pub fn assert_season_is_over(&self) {
    assert!(
      env::block_timestamp() > self.season_end,
      "{}",
      SEASON_END_ERR
    );
  }

  pub fn assert_guessing_is_open(&self) {
    assert!(
      env::block_timestamp() >= self.guessing_start,
      "{}",
      GUESSING_NOT_OPEN
    );
  }

  pub fn only_owner(&self) {
    assert_eq!(
      env::predecessor_account_id(),
      self.owner,
      "{}",
      UNAUTHORIZED_ERR
    );
  }

  pub fn assert_ownership(&self, account_id: AccountId) {
    let proof_time = self
      .proof_of_ownership
      .get(&account_id)
      .expect(NO_PROOF_ERR);

    assert!(env::block_timestamp() < proof_time, "{}", EXPIRED_TIME_ERR);
  }

  pub fn is_token_staked(&self, token_id: &TokenId) -> bool {
    self.contains_staked_token(token_id)
  }

  pub fn contains_staked_token(&self, token_id: &TokenId) -> bool {
    match self.staked_tokens.get(token_id) {
      Some(_) => true,
      None => false,
    }
  }

  pub fn assert_token_unstaked(&self, token_id: &TokenId) {
    assert!(!self.is_token_staked(&token_id), "{}", STAKED_TOKEN_ERR);
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
      self.owner,
      "{}",
      UNAUTHORIZED_ERR
    );
  }

  pub fn assert_detective_transfer(&self) {
    assert_eq!(
      env::predecessor_account_id(),
      self.detective_token_address,
      "{}",
      NOT_A_DET_ERROR
    );
  }

  pub fn assert_fungible_token_is_listed(&self, ft_account: AccountId) {
    assert!(
      self.fungible_tokens.contains_key(&ft_account),
      "{}",
      UNACC_TOKEN_ERR
    );
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
    let is_pup = env::predecessor_account_id() == self.pups_token_address;
    let is_det = env::predecessor_account_id() == self.detective_token_address;

    assert!(
      (is_pup || is_det),
      "{}",
      "This transfered NFT should be a pup or detective "
    )
  }
}
