pub const DUPLICATE_TOKEN_ERR: &'static str = "A token with the specified ID already exists";
pub const INEXISTENT_ERR: &'static str = "Token does not exist";
pub const STAKED_TOKEN_ERR: &'static str = "Token is staked";
pub const UNAUTHORIZED_ERR: &'static str = "Unauthorized user";
pub const UNAVAILABLE_ERR: &'static str = "Token was already claimed";
pub const _NFT_OWNER_ERR: &'static str = "Only the owner of this NFT can unstake it";
pub const _REWARD_CLAIMED_ERR: &'static str = "The reward was already claimed";
pub const SEASON_END_ERR: &'static str =
  "The season is over - it is not possible to claim clues or guess";
pub const GUESSING_NOT_OPEN: &'static str = "The Guessing is not open yet";
pub const UNACC_TOKEN_ERR: &'static str = "This token is unaccepted";
pub const NO_PROOF_ERR: &'static str = "This user does not hold any detective NFTs - please use the prove_ownership function before claiming ";
pub const EXPIRED_TIME_ERR: &'static str =
  "The verification time for this NFT has expired, please call prove_ownership again";
pub const NOT_A_DET_ERROR: &'static str =
  "This function only works if the transfered NFT is a Detective NFT";
pub const _ERR_NFT_USED: &'static str =
  "This NFT was already used for the free guess - please purchase a ticket";
pub const ERR_NFT_NOT_STAKED: &'static str =
  "This NFT was not used for guessing yet - please stake ir before trying to purchase more tickets";
pub const ERR_CLUE_NOT_STAKED: &'static str = "This CLUE was not staked";
pub const ERR_NFT_NOT_USED: &'static str =
  "This NFT was not used for guessing -> the season is now over ";
pub const _SEASON_NOT_END_ANS_ERR: &'static str =
  "The season is still going, cannot input THE answer to the mistery";
pub const ERR_UNSUFICIENT_FUNDS: &'static str =
  "Unsuficient funds were transfered to purchase the clue";
pub const ERR_UNSUFICIENT_FUNDS_GUESS: &'static str =
  "Unsuficient funds were transfered to purchase the Guess ticket";
pub const ERR_NO_TICKETS: &'static str = "There are no tickets available to  Guess";
pub const ERR_NO_GUESS: &'static str = "There are no guesses associated with this account or hash";
pub const _ERR_SEASON_NOT_END_UNSTAKE: &'static str =
  "You can only unstake your NFT by the end of the season";
pub const ERR_SEASON_NOT_OPEN: &'static str = "The season is not open yet to play";
pub const ERR_WRONG_TOKEN: &'static str = "You can only buy guessing tickets with $SOLVE";
