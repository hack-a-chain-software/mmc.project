// Near
export const network = import.meta.env.VITE_NEAR_NETWORK || 'testnet';

// Game
export const gameSeason = import.meta.env.VITE_SEASON_ID;

// Contracts
export const tokenContract = import.meta.env.VITE_TOKEN_CONTRACT;
export const cluesContract = import.meta.env.VITE_CLUES_CONTRACT;
export const guessContract = import.meta.env.VITE_GUESS_CONTRACT;
export const lockedContract = import.meta.env.VITE_LOCKED_CONTRACT;
export const detectivesContract = import.meta.env.VITE_DIRECTIVES_CONTRACT;
export const undercoverPupsContract =
  import.meta.env.VITE_UNDERCOVER_PUPS_CONTRACT;
