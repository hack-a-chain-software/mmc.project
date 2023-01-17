use std::ptr::null;

use near_contract_standards::non_fungible_token::core::{
  NonFungibleTokenResolver, NonFungibleTokenCore,
};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, LookupSet};
use near_sdk::json_types::U128;
use near_sdk::{
  env, near_bindgen, AccountId, PanicOnDefault, PromiseOrValue, BorshStorageKey, Timestamp, Gas,
};
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};
use near_contract_standards::non_fungible_token::metadata::{
  NonFungibleTokenMetadataProvider, NFTContractMetadata,
};
use near_contract_standards::{impl_non_fungible_token_enumeration, fungible_token};
use near_sdk::collections::UnorderedSet;

mod auth;
mod callback_actions;
mod claim;
mod errors;
mod ext_interface;
mod mint;
mod router;
mod stake;

pub(crate) mod test_utils;

pub const BASE_GAS: Gas = Gas(50_000_000_000_000);

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
  tokens: NonFungibleToken,
  metadata: LazyOption<NFTContractMetadata>,
  fungible_tokens: UnorderedSet<AccountId>,
  /// User balance to PURCHASE NFTs - key is user and value is token address and balance
  user_balance: LookupMap<AccountId, (AccountId, U128)>,

  staked_tokens: LookupMap<TokenId, AccountId>,
  /// NFTs can only be staked ONCE - this is the list of NFTs that were already used
  used_tokens: LookupSet<TokenId>,
  //This two contracts are the Accounts for the NFTs user must use to play
  detective_token_address: AccountId,
  pups_token_address: AccountId,
  ///The reward tokens for the game
  locked_tokens_address: AccountId,
  ///The date that the season ends - used for rewards for staking and guessing
  season_end: Timestamp,
  ///The detective NFTs that are staked for the guess
  staked_det_guessing: LookupMap<TokenId, AccountId>,
  ///The pups NFTs that are staked for the guess
  staked_pup_guessing: LookupMap<TokenId, AccountId>,
  //guess_ticket: LookupMap<AcountId, u32>
  //view_tickets
}

#[derive(BorshDeserialize, BorshSerialize, BorshStorageKey)]
enum StorageKeys {
  NftOwnerById,
  NftTokenMetadata,
  NftEnumeration,
  NftContractMetadata,
  StakedNfts,
  UsedTokens,
  DetectiveGuess,
  PupsGuess,
  FungibleTokens,
  UserBalance,
}

#[near_bindgen]
impl Contract {
  #[init]
  pub fn new(
    owner_id: AccountId,
    metadata: NFTContractMetadata,
    detective_token_address: AccountId,
    pups_token_address: AccountId,
    locked_tokens_address: AccountId,
    season_end: Timestamp,
  ) -> Self {
    assert!(!env::state_exists(), "Already initialized");
    metadata.assert_valid();

    Contract {
      tokens: NonFungibleToken::new(
        StorageKeys::NftOwnerById,
        owner_id,
        Some(StorageKeys::NftTokenMetadata),
        Some(StorageKeys::NftEnumeration),
        None::<u8>,
      ),
      metadata: LazyOption::new(StorageKeys::NftContractMetadata, Some(&metadata)),
      fungible_tokens: UnorderedSet::new(StorageKeys::FungibleTokens),
      user_balance: LookupMap::new(StorageKeys::FungibleTokens),
      staked_tokens: LookupMap::new(StorageKeys::StakedNfts),
      used_tokens: LookupSet::new(StorageKeys::UsedTokens),
      detective_token_address,
      pups_token_address,
      locked_tokens_address,
      season_end,
      staked_det_guessing: LookupMap::new(StorageKeys::DetectiveGuess),
      staked_pup_guessing: LookupMap::new(StorageKeys::PupsGuess),
    }
  }
}

#[near_bindgen]
impl NonFungibleTokenCore for Contract {
  #[payable]
  fn nft_transfer(
    &mut self,
    receiver_id: AccountId,
    token_id: TokenId,
    approval_id: Option<u64>,
    memo: Option<String>,
  ) {
    self.assert_token_unstaked(&token_id);

    self
      .tokens
      .nft_transfer(receiver_id, token_id, approval_id, memo)
  }

  #[payable]
  fn nft_transfer_call(
    &mut self,
    receiver_id: AccountId,
    token_id: TokenId,
    approval_id: Option<u64>,
    memo: Option<String>,
    msg: String,
  ) -> PromiseOrValue<bool> {
    self.assert_token_unstaked(&token_id);

    self
      .tokens
      .nft_transfer_call(receiver_id, token_id, approval_id, memo, msg)
  }

  fn nft_token(&self, token_id: TokenId) -> Option<Token> {
    self.tokens.nft_token(token_id)
  }
}

#[near_bindgen]
impl NonFungibleTokenResolver for Contract {
  #[private]
  fn nft_resolve_transfer(
    &mut self,
    previous_owner_id: AccountId,
    receiver_id: AccountId,
    token_id: TokenId,
    approved_account_ids: Option<std::collections::HashMap<AccountId, u64>>,
  ) -> bool {
    self.tokens.nft_resolve_transfer(
      previous_owner_id,
      receiver_id,
      token_id,
      approved_account_ids,
    )
  }
}

impl_non_fungible_token_enumeration!(Contract, tokens);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
  fn nft_metadata(&self) -> NFTContractMetadata {
    self.metadata.get().unwrap()
  }
}

#[cfg(test)]
mod tests {
  // TODO: test nft_transfer
  // TODO: test nft_transfer_call
  // See: https://docs.near.org/develop/relevant-contracts/nft#transferring-an-nft for test reference
}
