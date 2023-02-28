use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{AccountId, env, json_types::U128};

use crate::{
  Contract,
  errors::{UNAVAILABLE_ERR, ERR_UNSUFICIENT_FUNDS},
};

// deposit NFT  -> timer  - return to owner
// Ft transfer call, com valor e é isso - ft on transfer return is the value returned
//

pub const INTERVAL: u64 = 120_000_000_000; // 120 seconds (9 zeroes )

impl Contract {
  fn assert_token_available(&self, token_id: &TokenId) {
    let is_owned_by_contract = self.is_token_owner(&env::current_account_id(), token_id);

    assert!(is_owned_by_contract, "{}", UNAVAILABLE_ERR);
  }

  /// This function is used to buy an NFT - there are multiple tokens that can be used
  /// to purchase the NFT
  pub fn claim(
    &mut self,
    token_id: TokenId,
    account_id: AccountId,
    currency: AccountId,
    amount: U128,
  ) -> U128 {
    self.assert_token_available(&token_id);
    self.assert_fungible_token_is_listed(currency.clone()); //verify if the currency is accepted
    self.assert_season_is_going();

    //assert that the user has a detective
    self.assert_ownership(account_id.clone());

    //value
    let price = self.fungible_tokens.get(&currency).unwrap();
    assert!(amount >= price, "{}", ERR_UNSUFICIENT_FUNDS);

    self.tokens.internal_transfer(
      &env::current_account_id(),
      &account_id,
      &token_id,
      None,
      None,
    );

    let balance = self.treasury.get(&currency).unwrap_or(U128(0));
    self.treasury.insert(&currency, &U128(balance.0 + price.0));

    // amout is always >= price - due to assert - return the change to the user
    U128(amount.0 - price.0)
  }

  /// Function used to prove that a certain user has a detective NFT
  /// User must call this function and the claim function in a batch transaction
  /// First executes this function, then the claim (claim comes from FT trasnfer call)
  pub fn prove_ownership(&mut self, account_id: AccountId) -> bool {
    self.assert_detective_transfer();

    let available_time = env::block_timestamp() + INTERVAL;
    self.proof_of_ownership.insert(&account_id, &available_time);
    true // signals to return token back to owner
  }
}

#[cfg(test)]
mod tests {
  use std::{collections::HashMap};

  use near_sdk::{testing_env, VMConfig, RuntimeFeesConfig, test_utils::accounts};

  use super::*;
  use crate::tests::*;

  pub const CLAIM_PRICE: U128 = U128(10);

  #[test]
  fn test_claim_normal_flow_with_change() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      (BEGIN + 1),
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

    //insert the price of the claim
    contract
      .fungible_tokens
      .insert(&(TOKEN_ACCOUNT.parse().unwrap()), &CLAIM_PRICE);

    //insert proof of ownership
    contract.proof_of_ownership.insert(&accounts(0), &12);

    let token_id = "1";
    //generating an NFT to be claimed
    contract.tokens.internal_mint(
      token_id.to_string(),
      env::current_account_id(),
      Some(sample_token_metadata()),
    );

    //claiming the NFT with double the amount of tokens needed
    let change = contract.claim(
      token_id.to_string(),
      accounts(0),
      TOKEN_ACCOUNT.parse().unwrap(),
      U128(CLAIM_PRICE.0 * 2),
    );

    //assert the change was correct
    assert_eq!(change, CLAIM_PRICE);
    //assert that a balance was created on the treasury
    assert_eq!(
      contract
        .treasury
        .get(&TOKEN_ACCOUNT.parse().unwrap())
        .unwrap(),
      CLAIM_PRICE
    );
    //assert that the NFT was transfered to the actual owner
    assert_eq!(
      contract
        .tokens
        .owner_by_id
        .get(&token_id.to_string())
        .unwrap(),
      accounts(0)
    );
  }

  ///This test is done to verify that the if let Some is working in the case that
  /// there is already a balance on the treasury
  #[test]
  fn test_claim_normal_flow_verify_balance_increase() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      BEGIN + 1,
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
    let initial_balance = U128(10);

    //manually insert the price of the claim
    contract
      .fungible_tokens
      .insert(&(TOKEN_ACCOUNT.parse().unwrap()), &CLAIM_PRICE);

    //manually insert proof of ownership
    contract.proof_of_ownership.insert(&accounts(0), &12);

    let token_id = "1";
    //generating an NFT to be claimed
    contract.tokens.internal_mint(
      token_id.to_string(),
      env::current_account_id(),
      Some(sample_token_metadata()),
    );

    contract
      .treasury
      .insert(&TOKEN_ACCOUNT.parse().unwrap(), &initial_balance);

    //claiming the NFT with double the amount of tokens needed
    let change = contract.claim(
      token_id.to_string(),
      accounts(0),
      TOKEN_ACCOUNT.parse().unwrap(),
      U128(CLAIM_PRICE.0 * 2),
    );

    //assert the change was correct
    assert_eq!(change, CLAIM_PRICE);
    //assert that the balance increased
    assert_eq!(
      contract
        .treasury
        .get(&TOKEN_ACCOUNT.parse().unwrap())
        .unwrap(),
      U128(CLAIM_PRICE.0 + initial_balance.0)
    );
    //assert that the NFT was transfered to the actual owner
    assert_eq!(
      contract
        .tokens
        .owner_by_id
        .get(&token_id.to_string())
        .unwrap(),
      accounts(0)
    );
  }

  #[test]
  #[should_panic(
    expected = "The verification time for this NFT has expired, please call prove_ownership again"
  )]
  fn test_claim_expired_proof() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      3000, // block timestamp is past the proof time (10)
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

    //insert the price of the claim
    contract
      .fungible_tokens
      .insert(&(TOKEN_ACCOUNT.parse().unwrap()), &CLAIM_PRICE);

    //insert proof of ownership - with timestamp = 10 -> should be impossible to withdral
    contract.proof_of_ownership.insert(&accounts(0), &10);

    let token_id = "1";
    //generating an NFT to be claimed
    contract.tokens.internal_mint(
      token_id.to_string(),
      env::current_account_id(),
      Some(sample_token_metadata()),
    );

    //claiming the NFT with double the amount of tokens needed
    contract.claim(
      token_id.to_string(),
      accounts(0),
      TOKEN_ACCOUNT.parse().unwrap(),
      U128(CLAIM_PRICE.0 * 2),
    );
  }

  #[test]
  #[should_panic(expected = "Unsuficient funds were transfered to purchase the clue")]
  fn test_unsuficient_funds() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      BEGIN + 1,
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

    //insert the price of the claim
    contract
      .fungible_tokens
      .insert(&(TOKEN_ACCOUNT.parse().unwrap()), &CLAIM_PRICE);

    //insert proof of ownership - with timestamp = 10 -> should be impossible to withdral
    contract.proof_of_ownership.insert(&accounts(0), &12);

    let token_id = "1";
    //generating an NFT to be claimed
    contract.tokens.internal_mint(
      token_id.to_string(),
      env::current_account_id(),
      Some(sample_token_metadata()),
    );

    //claiming the NFT with double the amount of tokens needed
    contract.claim(
      token_id.to_string(),
      accounts(0),
      TOKEN_ACCOUNT.parse().unwrap(),
      U128(CLAIM_PRICE.0 / 2),
    );
  }

  #[test]
  #[should_panic(expected = "Token was already claimed")]
  fn test_claim_already_claimed_nft() {
    let context = get_context(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      BEGIN + 1,
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

    //insert the price of the claim
    contract
      .fungible_tokens
      .insert(&(TOKEN_ACCOUNT.parse().unwrap()), &CLAIM_PRICE);

    contract.proof_of_ownership.insert(&accounts(0), &12);

    let token_id = "1";
    //generating an NFT to be claimed
    contract.tokens.internal_mint(
      token_id.to_string(),
      env::current_account_id(),
      Some(sample_token_metadata()),
    );

    //claiming the NFT with double the amount of tokens needed
    contract.claim(
      token_id.to_string(),
      accounts(0),
      TOKEN_ACCOUNT.parse().unwrap(),
      U128(CLAIM_PRICE.0),
    );

    contract.claim(
      token_id.to_string(),
      accounts(0),
      TOKEN_ACCOUNT.parse().unwrap(),
      U128(CLAIM_PRICE.0),
    );
  }

  #[test]
  fn test_claim_using_proof_of_ownership() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      DET_ACCOUNT.parse().unwrap(),
      BEGIN + 1,
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

    //insert the price of the claim
    contract
      .fungible_tokens
      .insert(&(TOKEN_ACCOUNT.parse().unwrap()), &CLAIM_PRICE);

    //insert proof of ownership using the proof function
    contract.prove_ownership(accounts(0));

    let token_id = "1";
    //generating an NFT to be claimed
    contract.tokens.internal_mint(
      token_id.to_string(),
      env::current_account_id(),
      Some(sample_token_metadata()),
    );

    //claiming the NFT with double the amount of tokens needed
    let change = contract.claim(
      token_id.to_string(),
      accounts(0),
      TOKEN_ACCOUNT.parse().unwrap(),
      U128(CLAIM_PRICE.0 * 2),
    );

    //assert the change was correct
    assert_eq!(change, CLAIM_PRICE);
    //assert that a balance was created on the treasury
    assert_eq!(
      contract
        .treasury
        .get(&TOKEN_ACCOUNT.parse().unwrap())
        .unwrap(),
      CLAIM_PRICE
    );
    //assert that the NFT was transfered to the actual owner
    assert_eq!(
      contract
        .tokens
        .owner_by_id
        .get(&token_id.to_string())
        .unwrap(),
      accounts(0)
    );
  }

  #[test]
  fn test_proof_of_ownership() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      DET_ACCOUNT.parse().unwrap(),
      BEGIN + 1,
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

    //insert the price of the claim
    contract
      .fungible_tokens
      .insert(&(TOKEN_ACCOUNT.parse().unwrap()), &CLAIM_PRICE);

    //insert proof of ownership using the proof function
    contract.prove_ownership(accounts(0));

    //assert the change was correct
    assert!(contract.proof_of_ownership.contains_key(&accounts(0)));
  }

  #[test]
  #[should_panic(expected = "This function only works if the transfered NFT is a Detective NFT")]
  fn test_proof_of_ownership_wrong_contract_transfering_nft() {
    let context = get_context_predecessor(
      vec![],
      7090000000000000000000,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      PUP_ACCOUNT.parse().unwrap(),
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

    //insert the price of the claim
    contract
      .fungible_tokens
      .insert(&(TOKEN_ACCOUNT.parse().unwrap()), &CLAIM_PRICE);

    //insert proof of ownership using the proof function
    contract.prove_ownership(accounts(0));

    //assert the change was correct
    assert!(contract.proof_of_ownership.contains_key(&accounts(0)));
  }
}
