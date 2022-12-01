use near_sdk::{near_bindgen, env, AccountId};
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;

use crate::{Contract, ContractExt};

impl Contract {
  pub fn is_token_owner(&self, account_id: &AccountId, token_id: &TokenId) -> bool {
    self
      .tokens
      .owner_by_id
      .get(&token_id)
      .map(|id| &id == account_id)
      .unwrap_or(false)
  }

  pub fn is_token_staked(&self, token_id: &TokenId) -> bool {
    self.staked_tokens.contains_key(&token_id)
  }

  pub fn assert_token_available(&self, token_id: &TokenId) {
    let is_owned_by_contract = self.is_token_owner(&env::current_account_id(), token_id);
    let is_staked = self.is_token_staked(token_id);

    assert!(
      is_owned_by_contract && !is_staked,
      "Token was already picked"
    );
  }

  pub fn assert_owner(&self, account_id: &AccountId) {
    assert_eq!(account_id, &self.tokens.owner_id, "Unauthorized");
  }
}

#[near_bindgen]
impl Contract {
  #[payable]
  pub fn mint(&mut self, token_id: TokenId, token_metadata: Option<TokenMetadata>) -> Token {
    self.assert_owner(&env::predecessor_account_id());

    assert!(
      !self.tokens.owner_by_id.contains_key(&token_id),
      "A token with the specified ID already exists"
    );

    self
      .tokens
      .internal_mint(token_id, env::current_account_id(), token_metadata)
  }

  #[payable]
  pub fn pick(&mut self, token_id: TokenId) {
    self.assert_token_available(&token_id);

    self.tokens.internal_transfer(
      &env::current_account_id(),
      &env::predecessor_account_id(),
      &token_id,
      None,
      None,
    );
  }
}

#[allow(unused_imports)]
#[cfg(test)]
mod tests {
  use near_sdk::{test_utils::VMContextBuilder, AccountId, testing_env};
  use rstest::{rstest, fixture};

  use super::*;

  // TODO: test assert available: owned, staked, available.
  // TODO: test assert owner: unauthorized, authorized.
  // TODO: test mint: unauthorized, duplicate pk, success.
  // TODO: test pick: unavailable (2), available.
}
