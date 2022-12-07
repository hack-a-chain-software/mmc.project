use near_contract_standards::non_fungible_token::core::{
  NonFungibleTokenResolver, NonFungibleTokenCore,
};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, PromiseOrValue, BorshStorageKey};
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};
use near_contract_standards::non_fungible_token::metadata::{
  NonFungibleTokenMetadataProvider, NFTContractMetadata,
};
use near_contract_standards::impl_non_fungible_token_enumeration;

mod auth;
mod claim;
mod errors;
mod mint;
mod router;
mod stake;

pub(crate) mod test_utils;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
  tokens: NonFungibleToken,
  metadata: LazyOption<NFTContractMetadata>,
  staked_tokens: LookupMap<TokenId, AccountId>,

  detective_token_address: AccountId, // TODO: validate how to differ between detectives and pups
}

#[derive(BorshDeserialize, BorshSerialize, BorshStorageKey)]
enum StorageKeys {
  NftOwnerById,
  NftTokenMetadata,
  NftEnumeration,
  NftContractMetadata,
  StakedNfts,
}

#[near_bindgen]
impl Contract {
  #[init]
  pub fn new(
    owner_id: AccountId,
    metadata: NFTContractMetadata,
    detective_token_address: AccountId,
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
      staked_tokens: LookupMap::new(StorageKeys::StakedNfts),
      detective_token_address,
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
}
