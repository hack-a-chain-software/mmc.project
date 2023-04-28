// Near
export const network = import.meta.env.VITE_NEAR_NETWORK || 'testnet';

// Game
export const gameSeason = import.meta.env.VITE_SEASON_ID;
export const firstScene = import.meta.env.VITE_FIRST_SCENE_ID;
export const showClues = import.meta.env.VITE_SHOW_CLUES || false;

// Contracts
export const tokenContract = import.meta.env.VITE_TOKEN_CONTRACT;

export const gameContract = import.meta.env.VITE_GAME_CONTRACT;

export const lockedContract = import.meta.env.VITE_LOCKED_CONTRACT;

export const detectivesContract = import.meta.env.VITE_DETECTIVES_CONTRACT;
export const undercoverPupsContract =
  import.meta.env.VITE_UNDERCOVER_PUPS_CONTRACT;

//api
export const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// currencies
export const mmcToken = import.meta.env.VITE_MMC_TOKEN;
export const usdcToken = import.meta.env.VITE_USDC_TOKEN;
export const usdtToken = import.meta.env.VITE_USDT_TOKEN;
