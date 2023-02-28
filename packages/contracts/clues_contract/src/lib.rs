use near_bigint::U256;
use near_contract_standards::non_fungible_token::core::{
  NonFungibleTokenResolver, NonFungibleTokenCore,
};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::U128;
use near_sdk::{
  env, near_bindgen, AccountId, PanicOnDefault, PromiseOrValue, BorshStorageKey, Timestamp, Gas,
};
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};
use near_contract_standards::non_fungible_token::metadata::{
  NonFungibleTokenMetadataProvider, NFTContractMetadata,
};
use near_contract_standards::{impl_non_fungible_token_enumeration};

mod auth;
mod callback_actions;
mod claim;
mod errors;
mod ext_interface;
mod game_mgmt;
mod guess;
mod mint;
mod router;
mod stake;
mod view;

pub const BASE_GAS: Gas = Gas(50_000_000_000_000);

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
  owner: AccountId,
  tokens: NonFungibleToken,
  metadata: LazyOption<NFTContractMetadata>,
  /// List of the fungible tokens that can be used to purchase an NFT and the price on that token
  fungible_tokens: LookupMap<AccountId, U128>,
  /// The game native token contract address
  mmc_token_account: AccountId,
  /// Contract traeasury
  treasury: LookupMap<AccountId, U128>,
  /// Clue NFTs that were staked and the timestamp from when they were staked
  staked_tokens: UnorderedMap<TokenId, Timestamp>,
  /// List with all the owners of the staked clues
  staked_tokens_owners: LookupMap<AccountId, UnorderedSet<TokenId>>,
  /// Detective NFTs address - these NFTs are required to guess and stake clues
  detective_token_address: AccountId,
  /// Pups NFTs address - these NFTs are required to guess
  pups_token_address: AccountId,
  /// Used to proove that a user is the owner of an NFT - expires with time
  proof_of_ownership: LookupMap<AccountId, Timestamp>,
  /// The reward tokens for the game
  locked_tokens_address: AccountId,
  /// The date that the users are allowed to start guessing
  season_begin: Timestamp,
  /// The date that the season ends - used for rewards for staking and guessing
  season_end: Timestamp,
  /// The date that users can start guessing
  guessing_start: Timestamp,
  /// The detective or pup NFTs that are staked for the guess - Map key is user account, has a vec of NFTs (An
  /// NFT is a tuple made of the contract account and the token id
  staked_guesses_owner: LookupMap<AccountId, UnorderedSet<(AccountId, TokenId)>>, //
  staked_guesses: UnorderedSet<(AccountId, TokenId)>,
  /// The initial price for a guessing ticket
  ticket_price: U128,
  guess_ticket: LookupMap<AccountId, u32>, //view_tickets
  /// List of guesses - The key is the Guess hash and the value is the time of the guess
  guesses: LookupMap<U256, Timestamp>,
  /// Guesses per user - The key is the user account, the value is an unord. set of the guess hash
  guesses_owners: LookupMap<AccountId, UnorderedSet<U256>>,
}

#[derive(BorshDeserialize, BorshSerialize, BorshStorageKey)]
enum StorageKeys {
  NftOwnerById,
  NftTokenMetadata,
  NftEnumeration,
  NftContractMetadata,
  StakedNfts,
  StakedNftsOwners,
  StakedGuesses,
  StakedGuessesOwner,
  FungibleTokens,
  Treasury,
  GuessTicket,
  PayedGuesses,
  ProofOwnership,
  Guesses,
  GuessesOwner,
}

#[derive(BorshStorageKey, BorshDeserialize, BorshSerialize)]
enum StorageKey {
  TokenIdSet { account: AccountId },
  StakeGuessSet { account: AccountId },
  GuessSet { account: AccountId },
}

#[near_bindgen]
impl Contract {
  #[init]
  pub fn new(
    owner_id: AccountId,
    metadata: NFTContractMetadata,
    mmc_token_account: AccountId,
    detective_token_address: AccountId,
    pups_token_address: AccountId,
    locked_tokens_address: AccountId,
    season_begin: Timestamp,
    season_end: Timestamp,
    guessing_start: Timestamp,
    ticket_price: U128,
  ) -> Self {
    assert!(!env::state_exists(), "Already initialized");
    metadata.assert_valid();

    Contract {
      owner: owner_id.clone(),
      tokens: NonFungibleToken::new(
        StorageKeys::NftOwnerById,
        owner_id,
        Some(StorageKeys::NftTokenMetadata),
        Some(StorageKeys::NftEnumeration),
        None::<u8>,
      ),
      metadata: LazyOption::new(StorageKeys::NftContractMetadata, Some(&metadata)),
      mmc_token_account,
      fungible_tokens: LookupMap::new(StorageKeys::FungibleTokens),
      treasury: LookupMap::new(StorageKeys::Treasury),
      staked_tokens: UnorderedMap::new(StorageKeys::StakedNfts),
      staked_tokens_owners: LookupMap::new(StorageKeys::StakedNftsOwners),
      detective_token_address,
      pups_token_address,
      proof_of_ownership: LookupMap::new(StorageKeys::ProofOwnership),
      locked_tokens_address,
      season_begin,
      season_end,
      guessing_start,
      staked_guesses_owner: LookupMap::new(StorageKeys::StakedGuessesOwner),
      staked_guesses: UnorderedSet::new(StorageKeys::StakedGuesses),
      ticket_price,
      guess_ticket: LookupMap::new(StorageKeys::GuessTicket),
      guesses: LookupMap::new(StorageKeys::Guesses),
      guesses_owners: LookupMap::new(StorageKeys::GuessesOwner),
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
    //user can only transfer NFTs that are not staked
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

  use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
  use near_sdk::{VMConfig, RuntimeFeesConfig};
  pub use near_sdk::{testing_env, Balance, MockedBlockchain, VMContext, Gas};
  use std::collections::HashMap;
  use std::convert::TryInto;

  use super::*;

  pub const CONTRACT_ACCOUNT: &str = "contract.testnet";
  pub const OWNER_ACCOUNT: &str = "owner.testnet";
  pub const TOKEN_ACCOUNT: &str = "token.testnet";
  pub const LOCKED_TOKEN_ACCOUNT: &str = "token.testnet";
  pub const DET_ACCOUNT: &str = "det.testnet";
  pub const PUP_ACCOUNT: &str = "pup.testnet";

  pub const BEGIN: Timestamp = 10;
  pub const END: Timestamp = 100_000_000;
  pub const GUESS_START: Timestamp = 10_000_000;

  pub const TICKET_PRICE: U128 = U128(10);

  pub fn get_context(
    input: Vec<u8>,
    attached_deposit: u128,
    account_balance: u128,
    signer_id: AccountId,
    block_timestamp: u64,
    prepaid_gas: Gas,
  ) -> VMContext {
    VMContext {
      current_account_id: CONTRACT_ACCOUNT.parse().unwrap(),
      signer_account_id: signer_id.clone(),
      signer_account_pk: vec![0; 33].try_into().unwrap(),
      predecessor_account_id: signer_id.clone(),
      input,
      block_index: 0,
      block_timestamp,
      account_balance,
      account_locked_balance: 0,
      storage_usage: 0,
      attached_deposit,
      prepaid_gas,
      random_seed: [0; 32],
      view_config: None,
      output_data_receivers: vec![],
      epoch_height: 19,
    }
  }

  pub fn sample_token_metadata() -> TokenMetadata {
    TokenMetadata {
      title: Some("Olympus Mons".into()),
      description: Some("The tallest mountain in the charted solar system".into()),
      media: None,
      media_hash: None,
      copies: Some(1u64),
      issued_at: None,
      expires_at: None,
      starts_at: None,
      updated_at: None,
      extra: None,
      reference: None,
      reference_hash: None,
    }
  }

  pub fn get_context_predecessor(
    input: Vec<u8>,
    attached_deposit: u128,
    account_balance: u128,
    signer_id: AccountId,
    predecessor_account_id: AccountId,
    block_timestamp: u64,
    prepaid_gas: Gas,
  ) -> VMContext {
    VMContext {
      current_account_id: CONTRACT_ACCOUNT.parse().unwrap(),
      signer_account_id: signer_id.clone(),
      signer_account_pk: vec![0; 33].try_into().unwrap(),
      predecessor_account_id,
      input,
      block_index: 0,
      block_timestamp,
      account_balance,
      account_locked_balance: 0,
      storage_usage: 0,
      attached_deposit,
      prepaid_gas,
      random_seed: [0; 32],
      view_config: None,
      output_data_receivers: vec![],
      epoch_height: 19,
    }
  }

  pub fn contract_metadata() -> NFTContractMetadata {
    NFTContractMetadata {
      name: "Test".to_string(),
      spec: "nft-1.0.0".to_string(),
      symbol: "T".to_string(),
      reference: None,
      reference_hash: None,
      base_uri: None,
      icon: None,
    }
  }

  pub fn init_contract() -> Contract {
    Contract {
      owner: OWNER_ACCOUNT.parse().unwrap(),
      tokens: NonFungibleToken::new(
        StorageKeys::NftOwnerById,
        OWNER_ACCOUNT.parse().unwrap(),
        Some(StorageKeys::NftTokenMetadata),
        Some(StorageKeys::NftEnumeration),
        None::<u8>,
      ),
      metadata: LazyOption::new(StorageKeys::NftContractMetadata, Some(&contract_metadata())),
      mmc_token_account: TOKEN_ACCOUNT.parse().unwrap(),
      fungible_tokens: LookupMap::new(StorageKeys::FungibleTokens),
      treasury: LookupMap::new(StorageKeys::Treasury),
      staked_tokens: UnorderedMap::new(StorageKeys::StakedNfts),
      staked_tokens_owners: LookupMap::new(StorageKeys::StakedNftsOwners),
      detective_token_address: DET_ACCOUNT.parse().unwrap(),
      pups_token_address: PUP_ACCOUNT.parse().unwrap(),
      proof_of_ownership: LookupMap::new(StorageKeys::ProofOwnership),
      locked_tokens_address: LOCKED_TOKEN_ACCOUNT.parse().unwrap(),
      season_begin: BEGIN,
      season_end: END,
      guessing_start: GUESS_START,
      staked_guesses_owner: LookupMap::new(StorageKeys::StakedGuessesOwner),
      staked_guesses: UnorderedSet::new(StorageKeys::StakedGuesses),
      ticket_price: TICKET_PRICE,
      guess_ticket: LookupMap::new(StorageKeys::GuessTicket),
      guesses: LookupMap::new(StorageKeys::Guesses),
      guesses_owners: LookupMap::new(StorageKeys::GuessesOwner),
    }
  }

  #[test]
  fn test_new() {
    let context = get_context(
      vec![],
      0,
      1_000_000_000_000_000_000_000_000,
      OWNER_ACCOUNT.parse().unwrap(),
      0,
      Gas(300u64 * 10u64.pow(12)),
    );
    testing_env!(
      context,
      VMConfig::test(),
      RuntimeFeesConfig::test(),
      HashMap::default(),
      Vec::default()
    );

    let contract = Contract::new(
      OWNER_ACCOUNT.parse().unwrap(),
      contract_metadata(),
      TOKEN_ACCOUNT.parse().unwrap(),
      DET_ACCOUNT.parse().unwrap(),
      PUP_ACCOUNT.parse().unwrap(),
      LOCKED_TOKEN_ACCOUNT.parse().unwrap(),
      BEGIN,
      END,
      GUESS_START,
      TICKET_PRICE,
    );
    assert_eq!(contract.nft_token("1".to_string()), None);
  }

  #[test]
  #[should_panic(expected = "The contract is not initialized")]
  fn test_default() {
    let context = get_context(
      vec![],
      0,
      0,
      OWNER_ACCOUNT.parse().unwrap(),
      0,
      Gas(300u64 * 10u64.pow(12)),
    );
    testing_env!(context);
    let _contract = Contract::default();
  }
}

//
