//view user tickets
//view staked NFTs?
// view necessary price for ticket
// View staked nfts
// View staked nfts user

use std::vec;
use std::io::Error;
use near_bigint::U256;
use near_sdk::collections::Vector;
use crate::{*, guess::Guess, Contract, ContractExt};

#[near_bindgen]
impl Contract {
  pub fn view_hash(&self, guess: Guess) -> U256 {
    guess.to_hash()
  }

  pub fn view_guess_was_inserted(&self, hash: U256) -> bool {
    self.guesses.contains_key(&hash)
  }

  pub fn view_price(&self, currency: AccountId) -> U128 {
    self
      .fungible_tokens
      .get(&currency)
      .expect("Currency unavailable")
  }

  pub fn view_staked_clues_per_user(&self, account_id: AccountId) -> Option<Vec<TokenId>> {
    let set = self.staked_tokens_owners.get(&account_id);

    if let Some(x) = set {
      return Some(x.to_vec());
    } else {
      return None;
    }
  }

  pub fn view_if_clue_is_staked(&self, token_id: TokenId) -> bool {
    self.contains_staked_token(&token_id)
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

  pub fn view_staked_clues(&self) -> Vec<String> {
    self.staked_tokens.keys_as_vector().to_vec()
  }

  pub fn view_staking_timestamp_clue(&self, token_id: TokenId) -> Timestamp {
    self
      .staked_tokens
      .get(&token_id)
      .expect("That token is not staked")
  }

  pub fn view_staked_guesses_contain(&self, tuple: (AccountId, TokenId)) -> bool {
    self.staked_guesses.contains(&tuple)
  }

  pub fn view_user_tickets(&self, account_id: AccountId) -> Option<u32> {
    self.guess_ticket.get(&account_id)
  }

  pub fn view_guessing_date(&self) -> Timestamp {
    self.guessing_start
  }

  pub fn view_season_end_date(&self) -> Timestamp {
    self.season_end
  }

  pub fn view_ticket_price(&self, token_id: TokenId, account_id: AccountId) {
    //self.calculate_ticket_cost(, det_or_pup)
  }

  pub fn view_available_clue_rewards(&self, token_id: TokenId) -> U128 {
    self.calculate_reward(token_id)
  }

  //pub view_available_nfts_for_mint{}
}
