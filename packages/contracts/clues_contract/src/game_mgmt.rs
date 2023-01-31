use near_sdk::{near_bindgen, AccountId, json_types::U128, env, Timestamp};

use crate::{Contract, ContractExt, errors::UNAUTHORIZED_ERR};

#[near_bindgen]
impl Contract {
  pub fn insert_token_price(&mut self, currency: AccountId, price: U128) {
    self.only_owner();
    self.fungible_tokens.insert(&currency, &price);
  }

  pub fn change_guessing_date(&mut self, new_guesssing_date: Timestamp) {
    self.only_owner();

    assert!(
      new_guesssing_date < self.season_end,
      "{}",
      "The new Guessing date must be before the end of the season"
    );

    self.guessing_start = new_guesssing_date;
  }

  pub fn change_season_end_date(&mut self, new_end_date: Timestamp) {
    self.only_owner();

    assert!(
      new_end_date > self.guessing_start,
      "{}",
      "The new end date must be after the guessing starts"
    );

    self.season_end = new_end_date;
  }
}

#[cfg(test)]
mod tests {

  use std::collections::HashMap;

  use near_sdk::{VMConfig, RuntimeFeesConfig, test_utils::accounts};

  use super::*;
  use crate::tests::*;

  pub const NEW_END_DATE: Timestamp = END + 10_000;
  pub const NEW_GUESS_DATE: Timestamp = GUESS_START + 10_000;

  pub const CLAIM_PRICE: U128 = U128(10);
  pub const NEW_CLAIM_PRICE: U128 = U128(20);
  /*
  TESTS:
  1. Change season end date
  2. Change season end date for a date before the guessing -> Should PANIC!
  3. Change guessing  date
  4. Change guessing  date for a date after the season end -> Should PANIC!
  5. Insert a new price
  6. Test all function calls without the owner calling
  */

  #[test]
  fn test_change_season_end() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
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

    contract.change_season_end_date(NEW_END_DATE);

    assert_eq!(contract.season_end, NEW_END_DATE);
  }

  #[test]
  #[should_panic(expected = "The new end date must be after the guessing starts")]
  fn test_change_season_end_for_date_prior_to_guessing() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
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

    contract.change_season_end_date(GUESS_START - 1);
  }

  #[test]
  fn test_change_guess_start() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
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

    contract.change_guessing_date(NEW_GUESS_DATE);

    assert_eq!(contract.guessing_start, NEW_GUESS_DATE);
  }

  #[test]
  #[should_panic(expected = "The new Guessing date must be before the end of the season")]
  fn test_change_guessing_date_for_after_season_end() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
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

    contract.change_guessing_date(END + 1);
  }

  #[test]
  fn test_insert_price() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
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

    contract.insert_token_price(TOKEN_ACCOUNT.parse().unwrap(), CLAIM_PRICE);
    assert_eq!(
      contract
        .fungible_tokens
        .get(&TOKEN_ACCOUNT.parse().unwrap())
        .unwrap(),
      CLAIM_PRICE
    );
  }

  #[test]
  fn test_update_token_price() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
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

    contract.insert_token_price(TOKEN_ACCOUNT.parse().unwrap(), CLAIM_PRICE);
    assert_eq!(
      contract
        .fungible_tokens
        .get(&TOKEN_ACCOUNT.parse().unwrap())
        .unwrap(),
      CLAIM_PRICE
    );

    contract.insert_token_price(TOKEN_ACCOUNT.parse().unwrap(), NEW_CLAIM_PRICE);
    assert_eq!(
      contract
        .fungible_tokens
        .get(&TOKEN_ACCOUNT.parse().unwrap())
        .unwrap(),
      NEW_CLAIM_PRICE
    );
  }

  #[test]
  #[should_panic(expected = "Unauthorized")]
  fn test_calling_without_owner() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      CONTRACT_ACCOUNT.parse().unwrap(),
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

    contract.change_guessing_date(END + 1);
  }
}
