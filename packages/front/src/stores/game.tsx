import Big from 'big.js';
import create from 'zustand';
import api from '@/services/api';
import {
	firstScene,
	tokenContract,
	undercoverPupsContract,
} from '@/constants/env';
import { GameConfigInterface, SceneInterface, GuessInterface, Token, ClueInterface } from '@/interfaces';
import { WalletSelector } from '@near-wallet-selector/core';
import {
	gameContract,
	detectivesContract,
	lockedContract,
} from '@/constants/env';
import {
	getTransaction,
	Transaction,
	viewFunction,
	executeMultipleTransactions,
	getTokenStorage,
} from '@/helpers/near';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-hot-toast';
import { AnimationControls } from 'framer-motion';
import { getUTCDate } from '@/helpers';
import { isBefore } from 'date-fns/esm';
import { Selected } from '@/modals';

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

export const useGame = create<{
	jwt: string;
	accountId: string;
	scene: SceneInterface | null;
	config: GameConfigInterface | null;
	controls: AnimationControls | null;
	connected: boolean;
  guessingIsOpen: () => boolean,
	init: (
		jwt: string,
		accountId: string,
		controls: AnimationControls
	) => Promise<GameConfigInterface>;
	login: (payload: LoginData) => Promise<{ jwt: string }>;
	getScene: (id?: string) => Promise<SceneInterface>;
	getClues: () => Promise<ClueInterface[]>;
  getGuess: () => Promise<GuessInterface[]>,
  claimAllGuessingRewards: () => Promise<void>,
	claimClue: (
		tokenid: string,
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
	) => Promise<Token[]>;
	buyTicketsWithTokens: (
		tokenId: string,
		tokenContract: string,
		currencyContract: string,
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
		vestings: string[],
		accountId: string | null,
		connection: WalletSelector
	) => Promise<void>;
}>((set, get) => ({
	jwt: '',
	accountId: '',
	scene: null,
	config: null,
	controls: null,
	connected: false,

	init: async (jwt, accountId, controls) => {
		const { data } = await api.get('/game/config', {
			headers: { Authorization: `Bearer ${jwt}` },
		});

		set({
			jwt,
			controls,
			accountId,
			config: {
        ...data,
        ...data.config,
      },
			connected: true,
		});

		return data;
	},

	login: async (payload: LoginData) => {
		console.log('login', payload);

		const { data } = await api.post<{ jwt: string }>('/auth/login', {
			...payload,
		});

		return data;
	},

  guessingIsOpen: () => {
    const {
      config,
      accountId,
    } = get();

    if (!accountId || !config) {
      return false;
    }

    const now = getUTCDate() as Date;

    const openAt = getUTCDate(
      new Date(config.guess_open_at as string).getMilliseconds(),
    ) as Date;

    return isBefore(openAt, now);
  },

  getGuess: async () => {
		const { jwt } = get();

		if (!jwt) {
			return [];
		}

		const { data } = await api.get('/game/guess/', {
			headers: { Authorization: `Bearer ${jwt}` },
		});

		return data;
  },

  claimAllGuessingRewards: async () => {
		const { jwt } = get();

		if (!jwt) {
			return [];
		}

		const { data } = await api.post('/game/rewards/', {
			headers: { Authorization: `Bearer ${jwt}` },
		});

		return data;
  },

	getScene: async (id = firstScene) => {
		const { jwt } = get();

		if (!jwt) {
			return;
		}

		const { data } = await api.get(`/game/scene/${id}`, {
			headers: { Authorization: `Bearer ${jwt}` },
		});

		set({
			scene: data,
		});

		return data;
	},

	getClues: async () => {
		const { jwt } = get();

		if (!jwt) {
			return;
		}

		const { data } = await api.get('/game/clues', {
			headers: { Authorization: `Bearer ${jwt}` },
		});

		console.log(data);

		return data;
	},

	claimClue: async (tokenId, accountId, connection) => {
		if (!accountId) {
			return;
		}

		const { getDetectivesById } = get();

		const accountDetectives = getDetectivesById(accountId, connection);

		if (!isEmpty(accountDetectives)) {
			toast.error("You don't have any detectives");

			return;
		}

		const transactions: Transaction[] = [];

		transactions.push(
			getTransaction(accountId, detectivesContract, 'nft_transfer_call', {
				token_id: accountDetectives[0].token_id,
				memo: null,
				approval_id: null,
				receiver_id: gameContract,
				msg: JSON.stringify({
					ProveOwner: {
						account_id: accountId,
					},
				}),
			}),
		);

		transactions.push(
			getTransaction(accountId, tokenContract, 'ft_transfer_call', {
				memo: null,
				approval_id: null,
				receiver_id: gameContract,
				msg: JSON.stringify({
					route: 'Claim',
					det_or_pup: detectivesContract,
					token_id: tokenId,
				}),
			}),
		);

		const wallet = await connection.wallet();

		await executeMultipleTransactions(transactions, wallet);
	},

	stakeClue: async (tokenId, accountId, connection) => {
		if (!accountId) {
			return;
		}

		const { getDetectivesById } = get();

		const accountDetectives = getDetectivesById(accountId, connection);

		if (!isEmpty(accountDetectives)) {
			toast.error("You don't have any detectives");

			return;
		}

		const transactions: Transaction[] = [];

		transactions.push(
			getTransaction(accountId, detectivesContract, 'nft_transfer_call', {
				token_id: accountDetectives[0].nft_id,
				memo: null,
				approval_id: null,
				receiver_id: gameContract,
				msg: JSON.stringify({
					Stake: {
						staked_nft_id: tokenId,
					},
				}),
			})
		);

		const wallet = await connection.wallet();

		await executeMultipleTransactions(transactions, wallet);
	},

	getDetectivesById: (accountId, connection) => {
		if (!accountId) {
			return new Promise((res) => res([]));
		}

		return viewFunction(
			connection,
			detectivesContract,
			'nft_tokens_for_owner',
			{
				account_id: accountId,
				from_index: '0',
				limit: 10,
			},
		);
	},

	getPupsById: (accountId, connection) => {
		if (!accountId) {
			return new Promise((res) => res([]));
		}

		return viewFunction(
			connection,
			undercoverPupsContract,
			'nft_tokens_for_owner',
			{
				account_id: accountId,
				from_index: '0',
				limit: 10,
			},
		);
	},

	sendGuess: async (guess, accountId, connection) => {
		if (!guess.weapon || !guess.motive || !guess.murdered) {
			toast.error('You must fill in all the answers.');

			return;
		}

		const { jwt } = get();

		const randomNumber = Math.random() * 12;

		const guessHash = viewFunction(connection, gameContract, 'view_hash', {
			account_id: accountId,

			weapon: guess.weapon,
			motive: guess.motive,
			murderer: guess.murdered,

			random_number: randomNumber,
		});

		try {
			await api.post(
				'game/guess',
				{
					hash: guessHash,
					random_number: randomNumber,
					...guess,
				},
				{
					headers: { Authorization: `Bearer ${jwt}` },
				}
			);

			toast.success('Your guess has been successfully saved!');
		} catch (e) {
			console.warn(e);
			toast.error(
				'Something happens when saving your guess, please refresh your browser.'
			);
		}
	},

	getTicketsById: (accountId, connection) => {
		return new Promise((resolve) => resolve('1'));

		return viewFunction(
			connection,
			gameContract,
			'tickets_available_per_user',
			{
				account_id: accountId,
			},
		);
	},

	getStakedNftsById: (accountId, connection) => {
		return new Promise((resolve) => resolve([{ nft_id: '1', owner_id: '1' }]));

		return viewFunction(
			connection,
			gameContract,
			'view_staked_det_or_pup_per_user',
			{
				account_id: accountId,
			},
		);
	},

	buyTicketsWithTokens: async (
		detOrPupId,
		detOrPupContract,
		currencyContract,
		accountId,
		connection
	) => {
		if (!accountId) {
			return;
		}

		const { getGuessTokenPrice } = get();

		const transactions: Transaction[] = [];

		const amount = await getGuessTokenPrice(currencyContract, connection);

		transactions.push(
			getTransaction(
				accountId,
				tokenContract,
				'ft_transfer_call',
				{
					memo: null,
					approval_id: null,
					receiver_id: gameContract,
					msg: JSON.stringify({
						route: 'Guess',
						det_or_pup: detOrPupContract,
						token_id: detOrPupId,
					}),
				},
				amount,
			),
		);

		const wallet = await connection.wallet();

		await executeMultipleTransactions(transactions, wallet);
	},

	getGuessTokenPrice: (accountId, connection) => {
		return viewFunction(connection, gameContract, 'view_price', {
			currency: accountId,
		});
	},

	stakeNft: async (tokens, accountId, connection) => {
		if (!accountId) {
			return;
		}

		const transactions: Transaction[] = [];

		const stakingStorage = await getTokenStorage(
			connection,
			accountId,
			gameContract
		);

		if (
			!stakingStorage ||
			new Big(stakingStorage?.available).lte('100000000000000000000000')
		) {
			transactions.push(
				getTransaction(
					accountId,
					gameContract as string,
					'storage_deposit',
					{
						account_id: accountId,
						registration_only: false,
					},
					'0.25',
				),
			);
		}

		tokens.forEach(({ token_id, contract }) => {
			transactions.push(
				getTransaction(accountId, contract as string, 'nft_transfer_call', {
					token_id,
					memo: null,
					approval_id: null,
					receiver_id: gameContract,
					msg: JSON.stringify({
						ProveOwner: {
							account_id: accountId,
						},
					}),
				}),
			);
		});

		const wallet = await connection.wallet();

		await executeMultipleTransactions(transactions, wallet);
	},

	buyFastPass: async (vesting, amount, passCost, accountId, selector) => {
		if (!accountId) {
			return;
		}

		const transactions: Transaction[] = [];

		const storage = await getTokenStorage(selector, accountId, tokenContract);

		if (!storage || storage.total < '0.10') {
			transactions.push(
				getTransaction(
					accountId,
					tokenContract as string,
					'storage_deposit',
					{
						account_id: accountId,
						registration_only: false,
					},
					'0.25',
				),
			);
		}

		transactions.push(
			getTransaction(accountId, tokenContract as string, 'ft_transfer_call', {
				amount: new Big(amount).times(passCost).div('10000').toFixed(0),
				receiver_id: lockedContract,
				memo: null,
				msg: JSON.stringify({
					type: 'BuyFastPass',
					account_id: accountId,
					vesting_index: vesting,
				}),
			}),
		);

		const wallet = await selector.wallet();

		await executeMultipleTransactions(transactions, wallet);
	},

	withdrawLockedTokens: async (vestings, accountId, connection) => {
		if (!accountId) {
			return;
		}

		const transactions: Transaction[] = [];

		const storage = await getTokenStorage(connection, accountId, tokenContract);

		if (!storage || storage.total < '0.10') {
			transactions.push(
				getTransaction(
					accountId,
					tokenContract as string,
					'storage_deposit',
					{
						account_id: accountId,
						registration_only: false,
					},
					'0.25',
				),
			);
		}

		vestings.forEach((vesting) => {
			transactions.push(
				getTransaction(accountId, lockedContract, 'withdraw_locked_tokens', {
					vesting_id: vesting,
				}),
			);
		});

		const wallet = await connection.wallet();

		await executeMultipleTransactions(transactions, wallet);
	},
}));
