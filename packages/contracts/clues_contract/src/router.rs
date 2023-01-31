use std::convert::TryInto;

use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{near_bindgen, AccountId, env};
use serde::{Deserialize, Serialize};
use near_sdk::json_types::U128;

use crate::{Contract, ContractExt};

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde", tag = "type")]
pub enum TransactionType {
  ProveOwner,
  Stake { staked_nft_id: TokenId },
  Guess,
} 

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde", tag = "type")]
pub enum TokenRoute {
  Guess {
    det_or_pup: AccountId,
    token_id: TokenId,
  },
  Claim { token_id: TokenId },
} 


#[near_bindgen]
impl Contract {
  #[allow(unused_variables)]
  pub fn nft_on_transfer(
    &mut self,
    sender_id: String,
    previous_owner_id: String,
    token_id: String,
    msg: String,
  ) -> bool {
    
    println!("{}", "ENTROU NO ON TRANSFER");
    let nft_contract = env::predecessor_account_id();

    println!("{}{}", "previous_owner_id: ", previous_owner_id );

    match serde_json::from_str::<TransactionType>(&msg).expect("Error with the message for nft trasnfer call"){
      TransactionType::ProveOwner => self.prove_ownership(previous_owner_id.parse().unwrap()),
      TransactionType::Stake { staked_nft_id } => {
        self.stake(staked_nft_id, previous_owner_id.parse().unwrap())
      },
      TransactionType::Guess => {
        self.stake_for_guessing(previous_owner_id.parse().unwrap(), token_id, nft_contract)
      },
    }
  }

  #[allow(unused_variables)]
  pub fn ft_on_transfer(&mut self, sender_id: String, amount: U128, msg: String) {
    let currency = env::predecessor_account_id();

    match serde_json::from_str::<TokenRoute>(&msg).expect("Error with the message for FT transfer call") {
      TokenRoute::Guess { det_or_pup,token_id} => 
      {
        self.buy_guessing_ticket(sender_id.try_into().unwrap(), token_id, det_or_pup, amount)
      }
      TokenRoute:: Claim { token_id } => self.claim(
        token_id,
        sender_id.try_into().unwrap(),
        env::predecessor_account_id(),
        amount,
      ),
    };
  }
}




