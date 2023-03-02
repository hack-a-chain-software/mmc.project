use crate::{
  *,
  errors::{ERR_NFT_NOT_USED},
};

use near_sdk::{env, near_bindgen, PromiseResult};

#[near_bindgen]
impl Contract {
  #[private]
  pub fn undo_transfer(&mut self, token_id: TokenId, user_id: AccountId) {
    assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");

    match env::promise_result(0) {
      PromiseResult::NotReady => unreachable!(),
      PromiseResult::Successful(_val) => {
        self.staked_tokens.remove(&token_id);
        let mut set = self
          .staked_tokens_owners
          .get(&user_id)
          .expect("NFT already removed from owner");

        set.remove(&token_id);

        // we are inserting a new set of NFTs WITHOUT the one that was unstaked
        self.staked_tokens_owners.insert(&user_id, &set);
      }
      PromiseResult::Failed => {
        panic!("CALLBACK_ERR");
      }
    }
  }

  #[private]
  pub fn undo_guess(&mut self, hash: U256, account_id: AccountId) {
    assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");

    match env::promise_result(0) {
      PromiseResult::NotReady => unreachable!(),
      PromiseResult::Successful(_val) => {
        self.guesses.remove(&hash);

        let mut set = self
          .guesses_owners
          .get(&account_id)
          .expect("Guess already removed from owner");

        set.remove(&hash);

        self.guesses_owners.insert(&account_id, &set);
      }
      PromiseResult::Failed => {
        panic!("CALLBACK_ERR");
      }
    }
  }

  #[private]
  pub fn unstake_guess_callback(&mut self, token_id: TokenId, account_id: AccountId) {
    assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");

    match env::promise_result(0) {
      PromiseResult::NotReady => unreachable!(),
      PromiseResult::Successful(_val) => {
        let det_or_pup = env::predecessor_account_id();
        self
          .staked_guesses
          .remove(&(det_or_pup.clone(), token_id.clone()));

        self
          .staked_guesses_owner
          .get(&account_id)
          .expect(ERR_NFT_NOT_USED)
          .remove(&(det_or_pup, token_id));
      }

      PromiseResult::Failed => {
        panic!("CALLBACK_ERR");
      }
    }
  }
}
