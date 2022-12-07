use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{near_bindgen, AccountId};
use serde::Deserialize;

use crate::{Contract, ContractExt};

#[derive(Deserialize)]
enum NftRoute {
  Claim { account_id: AccountId },
  Stake { account_id: AccountId },
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
    }
  }
}
