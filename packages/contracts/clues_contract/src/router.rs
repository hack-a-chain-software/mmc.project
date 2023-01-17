use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{near_bindgen, AccountId, Promise, env};
use serde::Deserialize;
use near_sdk::json_types::U128;

use crate::{Contract, ContractExt};

#[derive(Deserialize)]
enum NftRoute {
  Claim { account_id: AccountId },
  Stake { account_id: AccountId },
  // Guess { account_id: AccountId },
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

    match route {
      NftRoute::Claim { account_id } => self.claim(token_id, account_id),
      NftRoute::Stake { account_id } => self.stake(token_id, account_id),
      //NftRoute::Stake { account_id } => self.guess(token_id, account_id),
    }
  }

  pub fn ft_on_transfer(&mut self, sender_id: String, amount: U128, msg: String) {
    // let parsed_message: FtTransferCallMsg =
    //   serde_json::from_str(&msg).expect("msg in wrong format");
    assert!(self.assert_fungible_token_is_listed(env::predecessor_account_id()));
  }
}
