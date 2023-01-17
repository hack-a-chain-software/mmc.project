use near_sdk::ext_contract;
use near_sdk::json_types::U128;
use crate::*;

#[ext_contract(token_contract)]
trait FungibleToken {
  fn ft_transfer(receiver_id: String, amount: U128, memo: String);
}

#[ext_contract(ext_self)]
trait Unstake {
  fn undo_transfer(token_id: TokenId, user_id: AccountId);
}
