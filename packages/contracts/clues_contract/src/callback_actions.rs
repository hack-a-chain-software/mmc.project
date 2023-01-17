use crate::*;

use near_sdk::{env, near_bindgen, PromiseResult};

#[near_bindgen]
impl Contract {
  #[private]
  pub fn undo_transfer(&mut self, token_id: TokenId, user_id: AccountId) {
    assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");

    match env::promise_result(0) {
      PromiseResult::NotReady => unreachable!(),
      PromiseResult::Successful(_val) => {
        //If tokens are transfered
        self.unstake_for_callback(token_id, user_id);
        //TO-DO: event - token removal successfull
      }
      PromiseResult::Failed => {
        //if tokens are not sucessfully transfered, we must ensure that the user can try to withdraw rewards again
        // Remove the token from the used tokens list
        self.used_tokens.remove(&token_id.clone());
        // Insert the token back on the staked tokens list
        self.staked_tokens.remove(&token_id);
      }
    }
  }
}
