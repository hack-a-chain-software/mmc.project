//view user tickets
//view staked NFTs?
// view necessary price for ticket
// View staked nfts
// View staked nfts user

use std::vec;
use std::io::Error;
use near_bigint::U256;
use crate::{*, guess::Guess, Contract, ContractExt};

#[near_bindgen]
impl Contract {
  pub fn view_hash(&self, guess: Guess) -> U256 {
    guess.to_hash()
  }

  pub fn view_price(&self, currency: AccountId) -> U128{
    self.fungible_tokens.get(&currency).expect("Currency unavailable")
  }

  pub fn view_staked_clues_per_user(&self, account_id: AccountId) -> Option<Vec<TokenId>> {
    let set = self.staked_tokens_owners.get(&account_id);

    if let Some(x) = set {
      return Some(x.to_vec());
    } else {
      return None;
    }
  }

  pub fn view_staked_det_or_pup_per_user(
    &self,
    account_id: AccountId,
  ) -> Option<Vec<(AccountId, TokenId)>> {
    let set = self.staked_guesses_owner.get(&account_id);

    if let Some(x) = set {
      return Some(x.to_vec());
    } else {
      return None;
    }
  }

  pub fn view_staked_guessing_nfts(&self) -> Vec<(AccountId, String)> {
    self.staked_guesses.to_vec()
  }

  pub fn view_staked_clues(&self) -> Vec<TokenId> {
    self.staked_tokens.to_vec()
  }
}
