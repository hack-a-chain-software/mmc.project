use std::convert::TryInto;

use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{near_bindgen, AccountId, env};
use serde::Deserialize;
use near_sdk::json_types::U128;

use crate::{Contract, ContractExt, claim};

#[derive(Deserialize)]
enum NftRoute {
  ProveOwner { account_id: AccountId },
  Stake { account_id: AccountId },
  Guess { account_id: AccountId },
}
#[derive(Deserialize)]
enum TokenRoute {
  Guess,
  Claim,
}
#[derive(Deserialize)]
struct FtOnTransferMsg {
  route: TokenRoute,
  det_or_pup: AccountId,
  token_id: TokenId,
}

#[near_bindgen]
impl Contract {
  #[allow(unused_variables)]
  pub fn nft_on_transfer(
    &mut self,
    receiver_id: AccountId,
    token_id: TokenId,
    msg: String,
    approval_id: Option<u64>,
    memo: Option<String>,
  ) -> bool {
    let route = serde_json::from_str::<NftRoute>(&msg).unwrap();
    let nft_contract = env::predecessor_account_id();

    match route {
      NftRoute::ProveOwner { account_id } => self.prove_ownership(account_id),
      NftRoute::Stake { account_id } => self.stake(token_id, account_id),
      NftRoute::Guess { account_id } => self.stake_for_guessing(account_id, token_id, nft_contract),
    }
  }

  #[allow(unused_variables)]
  pub fn ft_on_transfer(&mut self, sender_id: String, amount: U128, msg: String) {
    let parsed_message = serde_json::from_str::<FtOnTransferMsg>(&msg).unwrap();

    let route = parsed_message.route;
    let det_or_pup = parsed_message.det_or_pup;
    let token_id = parsed_message.token_id;
    let currency = env::predecessor_account_id();

    match route {
      TokenRoute::Guess => {
        self.buy_guessing_ticket(sender_id.try_into().unwrap(), token_id, det_or_pup, amount)
      }
      TokenRoute::Claim => self.claim(
        token_id,
        sender_id.try_into().unwrap(),
        env::predecessor_account_id(),
        amount,
      ),
    };
  }
}
