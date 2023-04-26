use borsh::{BorshSerialize, BorshDeserialize};
use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{
  AccountId, env, json_types::U128, near_bindgen, assert_one_yocto, Timestamp,
  collections::UnorderedSet,
};
use near_bigint::{U256};
use serde::{Deserialize, Serialize};

use crate::{
  Contract, ContractExt,
  errors::{
    ERR_NFT_NOT_STAKED, ERR_UNSUFICIENT_FUNDS_GUESS, ERR_NO_TICKETS, INEXISTENT_ERR,
    ERR_NFT_NOT_USED, ERR_WRONG_TOKEN, ERR_NO_GUESS,
  },
  ext_interface, BASE_GAS, StorageKey, FRACTION_BASE,
};

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize, Clone)]
pub struct Guess {
  account_id: AccountId,
  murderer: String,
  weapon: String,
  motive: String,
  random_number: U128,
}

impl Guess {
  pub fn to_hash(&self) -> U256 {
    let ans_vec = format!(
      "{}{}{}{}{}",
      self.account_id, self.murderer, self.weapon, self.motive, self.random_number.0
    )
    .as_bytes()
    .to_vec();

    let hash = env::keccak256(&ans_vec);

    U256::from_little_endian(&hash)
  }
}

#[near_bindgen]
impl Contract {
  #[payable]
  pub fn save_guess(&mut self, account_id: AccountId, guess_hash: U256) {
    assert_one_yocto();
    self.assert_guessing_is_open();

    let mut tickets = self.guess_ticket.get(&account_id).expect(ERR_NO_TICKETS);

    assert!(tickets > 0, "{}", ERR_NO_TICKETS);
    tickets = tickets - 1;
    self.guess_ticket.insert(&account_id, &tickets);

    let timestamp = env::block_timestamp();

    self.guesses.insert(&guess_hash.clone(), &timestamp);

    let owners = self.guesses_owners.get(&account_id);

    if let Some(mut x) = owners {
      x.insert(&guess_hash);
      self.guesses_owners.insert(&account_id, &x);
    } else {
      let mut set = UnorderedSet::new(StorageKey::GuessSet {
        account: account_id.clone(),
      });
      set.insert(&guess_hash);
      self.guesses_owners.insert(&account_id, &set);
    }
  }

  /// Function used to unstake the NFTs - Not related with claiming rewards
  #[payable]
  pub fn unstake_guess(&mut self, account_id: AccountId, token_id: TokenId, det_or_pup: AccountId) {
    assert_one_yocto();
    self.assert_season_is_over();
    assert!(
      det_or_pup == self.detective_token_address || det_or_pup == self.pups_token_address,
      "{}",
      INEXISTENT_ERR
    );

    //Making sure that the said NFT is staked and belongs to the said Account
    assert!(
      self
        .staked_guesses_owner
        .get(&account_id)
        .expect(ERR_NFT_NOT_USED)
        .contains(&(det_or_pup.clone(), token_id.clone())),
      "{}",
      ERR_NFT_NOT_USED
    );

    ext_interface::ext_non_fungible_token::ext(det_or_pup)
      .with_static_gas(BASE_GAS)
      .with_attached_deposit(1)
      .nft_transfer(account_id.clone(), token_id.clone(), None, None)
      .then(
        ext_interface::ext_self::ext(env::current_account_id())
          .with_static_gas(BASE_GAS)
          .unstake_guess_callback(token_id, account_id),
      );
  }

  pub fn claim_guess_rewards(&mut self, guess: Guess) {
    self.assert_season_is_over();
    let account_id = guess.account_id.clone();
    let hash = guess.to_hash();
    let timestamp = self.guesses.get(&hash).expect(ERR_NO_GUESS);

    let reward = self.calculate_guess_reward(guess, timestamp);

    if reward <= U128(0) {
      ext_interface::token_contract::ext(self.locked_tokens_address.clone())
        .with_static_gas(BASE_GAS)
        .with_attached_deposit(1)
        .ft_transfer(
          account_id.clone().to_string(),
          reward,
          "Guess reward".to_string(),
        )
        .then(
          ext_interface::ext_self::ext(env::current_account_id())
            .with_static_gas(BASE_GAS)
            .undo_guess(hash, account_id),
        );
    } else {
      self.guesses.remove(&hash);

      let mut set = self
        .guesses_owners
        .get(&account_id)
        .expect("Guess already removed from owner");

      set.remove(&hash);

      self.guesses_owners.insert(&account_id, &set);
    }
  }
}

impl Contract {
  pub fn stake_for_guessing(
    &mut self,
    account_id: AccountId,
    token_id: TokenId,
    det_or_pup: AccountId,
  ) -> bool {
    self.assert_pups_or_det_transfer();
    self.insert_nft_on_stake_list(account_id.clone(), token_id, det_or_pup);

    false
  }

  pub fn buy_guessing_ticket(
    &mut self,
    account_id: AccountId,
    token_id: TokenId,
    det_or_pup: AccountId,
    amount: U128,
  ) -> U128 {
    self.assert_season_is_going();

    assert_eq!(
      self.mmc_token_account,
      env::predecessor_account_id(),
      "{}",
      ERR_WRONG_TOKEN
    );
    //validate that user is buying a ticket for a specific NFT
    let staked_nfts = self
      .staked_guesses_owner
      .get(&account_id)
      .expect(ERR_NFT_NOT_STAKED);
    assert!(
      staked_nfts.contains(&(det_or_pup.clone(), token_id.clone())),
      "{}",
      ERR_NFT_NOT_STAKED
    );

    let ticket_price = self.calculate_ticket_cost(token_id, det_or_pup);
    assert!((ticket_price <= amount), "{}", ERR_UNSUFICIENT_FUNDS_GUESS);
    self.increment_ticket(account_id.clone());

    let change = U128(amount.0 - ticket_price.0);

    change
  }

  //TO-DO: validate with client correct logic
  pub fn calculate_ticket_cost(&self, _token_id: TokenId, _det_or_pup: AccountId) -> U128 {
    //let used_tickets: u128 = self.payed_guesses.get(&(det_or_pup, token_id)).unwrap() as u128;

    //U128(self.ticket_price.0 + used_tickets * self.ticket_price.0)
    U128(100)
  }

  pub fn calculate_guess_reward(&self, guess: Guess, timestamp: Timestamp) -> U128 {
    let answer = self
      .answer
      .as_ref()
      .expect("No answer was added yet by the owner of the game");

    let mut count = 0;

    if answer.murderer == guess.murderer {
      count += 1;
    }
    if answer.weapon == guess.weapon {
      count += 1;
    }
    if answer.motive == guess.motive {
      count += 1;
    }

    //get the interval between guessing and end of the season
    let delta_time = self.season_end as u128 - (timestamp as u128); //

    let guessing_duration = (self.season_end - self.guessing_start) as u128;

    //calculate what is the % of time the clue was staked - use FRACTION_BASE to handle decimals
    // only multiply by FRACTION_BASE at the end result, otherwise you'll get 0 as result
    let mut percentage = count * (delta_time * FRACTION_BASE) / guessing_duration;

    percentage = percentage
      * self
        .rewards_guessing
        .expect("No rewards were added by the owner")
        .0;

    //return the maximum amount of rewards times the percentage the user is elegible due to time on stake
    U128(percentage / FRACTION_BASE)
  }

  pub fn insert_nft_on_stake_list(
    &mut self,
    account_id: AccountId,
    token_id: TokenId,
    det_or_pup: AccountId,
  ) {
    self
      .staked_guesses
      .insert(&(det_or_pup.clone(), token_id.clone()));
    let owners = self.staked_guesses_owner.get(&account_id);

    if let Some(mut x) = owners {
      x.insert(&(det_or_pup.clone(), token_id.clone()));
      self.staked_guesses_owner.insert(&account_id, &x);
    } else {
      let mut set = UnorderedSet::new(StorageKey::StakeGuessSet {
        account: account_id.clone(),
      });
      set.insert(&(det_or_pup, token_id));
      self.staked_guesses_owner.insert(&account_id, &set);
    }

    self.increment_ticket(account_id);
  }

  pub fn increment_ticket(&mut self, account_id: AccountId) {
    //after staking, user get's a ticket
    if self.guess_ticket.contains_key(&account_id) {
      //increment ticket value
      let user_ticket = self.guess_ticket.get(&account_id).unwrap();
      self.guess_ticket.insert(&account_id, &(user_ticket + 1));
    } else {
      //give the first ticket
      self.guess_ticket.insert(&account_id, &(1));
    }
  }
}

#[cfg(test)]
mod tests {

  use std::collections::HashMap;

  use near_sdk::{VMConfig, RuntimeFeesConfig, test_utils::accounts, Timestamp};

  use super::*;
  use crate::tests::*;

  #[test]
  fn test_claim_guess_rewards() {
    let context = get_context_predecessor(
      vec![],
      1,
      1_000_000_000_000_000_000_000_000,
      accounts(0),
      accounts(0),
      END + 1000,
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
    //guessing starts at
    let guessing_date: Timestamp = 15_000_000;
    let elegible_rewards = U128(100_000);

    // --------- insert 2 guesses manually
    let guess = Guess {
      account_id: accounts(0),
      murderer: "John".to_string(),
      weapon: "Glock".to_string(),
      motive: "Jealous".to_string(),
      random_number: U128(1),
    };

    let guess2 = Guess {
      account_id: accounts(0),
      murderer: "John".to_string(),
      weapon: "Knife".to_string(),
      motive: "Hunger".to_string(),
      random_number: U128(1),
    };

    let guess3 = Guess {
      account_id: accounts(0),
      murderer: "potato".to_string(),
      weapon: "tomato".to_string(),
      motive: "apple".to_string(),
      random_number: U128(1),
    };

    //get the hash for both guesses
    let guess_hash = contract.view_hash(guess.clone());
    let guess_hash2 = contract.view_hash(guess2.clone());
    let guess_hash3 = contract.view_hash(guess3.clone());

    contract.guesses.insert(&guess_hash, &guessing_date);
    contract.guesses.insert(&guess_hash2, &guessing_date);
    contract.guesses.insert(&guess_hash3, &guessing_date);

    let mut set = UnorderedSet::new(StorageKey::GuessSet {
      account: accounts(0),
    });
    set.insert(&guess_hash);
    set.insert(&guess_hash2);
    set.insert(&guess_hash3);
    contract.guesses_owners.insert(&accounts(0), &set);

    // --------- insert the answer and the rewards

    contract.answer = Some(guess.clone());
    contract.rewards_guessing = Some(elegible_rewards);

    contract.claim_guess_rewards(guess3.clone());

    let rewards_1 = contract.view_guess_reward(guess);
    let rewards_2 = contract.view_guess_reward(guess2);
    let rewards_3 = contract.view_guess_reward(guess3);
    assert_eq!(rewards_1, U128(283_330));
    assert_eq!(rewards_2, U128(94_440));
    assert_eq!(rewards_3, U128(0));
  }
}
