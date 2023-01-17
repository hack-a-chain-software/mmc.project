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

  fn unstake_guess_callback(token_id: TokenId, account_id: AccountId);

  fn undo_guess(hash: U256, account_id: AccountId);
}

#[ext_contract(ext_non_fungible_token)]
pub trait NonFungibleToken {
  fn nft_transfer(
    receiver_id: AccountId,
    token_id: String,
    approval_id: Option<String>,
    memo: Option<String>,
  );
}
