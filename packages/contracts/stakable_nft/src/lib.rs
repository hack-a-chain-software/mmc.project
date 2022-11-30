use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, UnorderedSet};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise, PromiseOrValue};
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};
use near_contract_standards::non_fungible_token::metadata::{
  NonFungibleTokenMetadataProvider, NFTContractMetadata, TokenMetadata,
};
use near_contract_standards::{
  impl_non_fungible_token_approval, impl_non_fungible_token_core,
  impl_non_fungible_token_enumeration,
};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
  tokens: NonFungibleToken,
  metadata: LazyOption<NFTContractMetadata>,
  staked_tokens: UnorderedSet<TokenId>, // TODO:
}

#[near_bindgen]
impl Contract {
  #[init]
  pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
    assert!(!env::state_exists(), "Already initialized");
    metadata.assert_valid();

    Contract {
      tokens: NonFungibleToken::new(b'a', owner_id, Some(b'b'), Some(b'c'), Some(b'd')),
      metadata: LazyOption::new(b'e', Some(&metadata)),
      staked_tokens: UnorderedSet::new(b'f'),
    }
  }

  #[payable]
  pub fn mint(
    &mut self,
    token_id: TokenId,
    token_owner_id: AccountId,
    token_metadata: Option<TokenMetadata>,
  ) -> Token {
    assert_eq!(
      env::predecessor_account_id(),
      self.tokens.owner_id,
      "Unauthorized"
    );

    self
      .tokens
      .internal_mint(token_id, token_owner_id, token_metadata)
  }

  #[payable]
  pub fn stake(&mut self, token_id: TokenId) {
    let staker_id = env::predecessor_account_id();

    assert_eq!(
      self.tokens.owner_by_id.get(&token_id),
      Some(staker_id.clone()),
      "Unauthorized"
    );

    assert!(!self.staked_tokens.contains(&token_id)); // TODO: re-evaluate necessity

    // TODO: check if staker owns detective/pup NFT

    self.tokens.internal_transfer(
      &staker_id,
      &env::current_account_id(),
      &token_id,
      None,
      None,
    );

    self.staked_tokens.insert(&token_id); // TODO:
  }
}

impl_non_fungible_token_core!(Contract, tokens);
impl_non_fungible_token_approval!(Contract, tokens);
impl_non_fungible_token_enumeration!(Contract, tokens);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
  fn nft_metadata(&self) -> NFTContractMetadata {
    self.metadata.get().unwrap()
  }
}
