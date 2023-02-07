
import {
  Token,
  ClueInterface,
  GuessInterface,
  SceneInterface,
  GameConfigInterface,
  GameCurrencyInterface,
} from '@/interfaces';
import { AnimationControls } from 'framer-motion';
import { WalletSelector } from '@near-wallet-selector/core';

export interface LoginData {
	accountId: string;
	seasonId: string;
	signedMessage: {
		message: string;
		signature: string;
		publicKey: string;
	};
}

export interface GuessDto {
  murdered: string;
  weapon: string;
  motive: string;
}

export interface GameStoreInterface {
	scene: SceneInterface | null;
	config: GameConfigInterface | null;
	controls: AnimationControls | null;
  clues: ClueInterface[] | null;
  guessingIsOpen: () => boolean,
	initGame: (
		controls: AnimationControls
  ) => Promise<GameConfigInterface>;
	getScene: (id?: string) => Promise<SceneInterface>;
	getClues: () => Promise<ClueInterface[]>;
  getGuess: () => Promise<GuessInterface[]>,
  claimAllGuessingRewards: () => Promise<void>,
	claimClue: (
		tokenid: string,
    currency: GameCurrencyInterface,
		accountId: string | null,
		connection: WalletSelector
	) => Promise<void>;
	stakeClue: (
		tokenid: string,
		accountId: string | null,
		connection: WalletSelector
	) => Promise<void>;
	getDetectivesById: (
		accountId: string | null,
		connection: WalletSelector
	) => Promise<Token[]>;
	getPupsById: (
		accountId: string | null,
		connection: WalletSelector
	) => Promise<Token[]>;
	sendGuess: (
		gues: GuessDto,
		accountId: string | null,
		connection: WalletSelector
	) => Promise<void>;
	getTicketsById: (
		accountId: string | null,
		connection: WalletSelector
	) => Promise<any>;
	getStakedNftsById: (
		accountId: string | null,
		connection: WalletSelector
	) => Promise<string[][]>;
	buyTicketsWithTokens: (
		tokenId: string,
		tokenContract: string,
    currency: GameCurrencyInterface,
		accountId: string | null,
		connection: WalletSelector
	) => Promise<any>;
	getGuessTokenPrice: (
		accountId: string | null,
		connection: WalletSelector
	) => Promise<string>;
	stakeNft: (
		tokens: Selected[],
		accountId: string | null,
		connection: WalletSelector
	) => Promise<void>;
	buyFastPass: (
		vesting: string,
		amount: string,
		passCost: string,
		accountId: string | null,
		connection: WalletSelector
	) => Promise<void>;
	withdrawLockedTokens: (
		vestings: Vesting[],
		accountId: string | null,
		connection: WalletSelector
	) => Promise<void>;
  moveToScene: (id: string) => Promise<void>;
}