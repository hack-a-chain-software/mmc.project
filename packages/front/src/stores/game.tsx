import Big from 'big.js';
import create from 'zustand';
import api from '@/services/api';
import {
	firstScene,
	tokenContract,
	undercoverPupsContract,
} from '@/constants/env';
import { GameConfigInterface, SceneInterface, GuessInterface, Token, ClueInterface, GameCurrencyInterface } from '@/interfaces';
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
import { Vesting } from '@/modals/locked-tokens/card';

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
	autenticated: boolean;
	scene: SceneInterface | null;
	config: GameConfigInterface | null;
	controls: AnimationControls | null;
	connected: boolean;
  clues: ClueInterface[] | null;
  toggleAutenticated: () => void,
  guessingIsOpen: () => boolean,
	login: (
    payload: LoginData,
		accountId: string,
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
}>((set, get) => ({
	jwt: '',
  accountId: '',
  clues: null,
	scene: null,
	config: null,
	controls: null,
	connected: false,
  autenticated: false,

	login: async (loginPayload, accountId, controls) => {
    const {
      getScene,
      getClues,
    } = get();

		const { data: {
      jwt = '',
    } } = await api.post<{ jwt: string }>('/auth/login', {
			...loginPayload,
		});

		const { data } = await api.get('/game/config', {
			headers: { Authorization: `Bearer ${jwt as string}` },
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
      autenticated: !!accountId,
		});

    let clues: ClueInterface[] | null = null;

    if (accountId) {
      console.log('');
      console.log('stores/game.tsx: get clues for id:', accountId);
      console.log('');

      clues = await getClues();
    }

    set({
      clues,
    });

    await getScene();

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

  toggleAutenticated: () => {
    set({
      autenticated: false,
    });
  },

  getGuess: async () => {
		const { jwt } = get();

		if (!jwt) {
			return [];
		}

    try {
      const { data } = await api.get('/game/guess/', {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      return data;
    } catch (e) {
      console.warn(e);

      return [];
    }
  },

  claimAllGuessingRewards: async () => {
		const { jwt } = get();

		if (!jwt) {
			return [];
		}

    try {
      const { data } = await api.post('/game/rewards/', {}, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      return data;
    } catch (e) {
      console.warn(e);
    }
  },

  moveToScene: async (id) => {
		const {
      controls,
      connected,
      getScene,
    } = get();

    if (!connected || !controls) {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

		await controls.start({ clipPath: 'circle(0% at 50vw 50vh)' });

    set({
      scene: null,
    });

		void await getScene(id);

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

    try {
      const { data } = await api.get('/game/clues', {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      return data;
    } catch (e) {
      console.warn(e);
      return [];
    }
	},


	claimClue: async (tokenId, currency, accountId, connection) => {
		if (!accountId) {
			return;
		}

		const { getDetectivesById } = get();

		const accountDetectives = await getDetectivesById(accountId, connection);

		if (isEmpty(accountDetectives)) {
			toast.error("You don't have any detectives");

			return;
		}

		const transactions: Transaction[] = [];

		const storage = await getTokenStorage(
      connection,
      gameContract,
      tokenContract,
    );

		if (!storage || storage.total < '0.10') {
			transactions.push(
				getTransaction(
					accountId,
					tokenContract as string,
					'storage_deposit',
					{
						account_id: gameContract,
						registration_only: false,
					},
					'0.25',
				),
			);
		}

		const tokenStorage = await getTokenStorage(
      connection,
      accountId,
      tokenContract,
    );

		if (!tokenStorage || tokenStorage.total < '0.10') {
			transactions.push(
				getTransaction(
					accountId,
					tokenContract,
					'storage_deposit',
					{
						account_id: accountId,
						registration_only: true,
					},
					'0.25',
				),
			);
		}

		transactions.push(
			getTransaction(accountId, detectivesContract, 'nft_transfer_call', {
				token_id: accountDetectives[0].token_id,
				memo: null,
				approval_id: null,
				receiver_id: gameContract,
				msg: JSON.stringify({
          type: 'ProveOwner',
				}),
			}),
		);

    // const amount = await viewFunction(
    //   connection,
    //   gameContract,
    //   'view_price',
    //   {
    //     currency: tokenContract,
    //   },
    // );

		transactions.push(
			getTransaction(accountId, currency.contract, 'ft_transfer_call', {
        amount: currency.token_price,
				memo: null,
				approval_id: null,
				receiver_id: gameContract,
				msg: JSON.stringify({
					type: 'Claim',
					token_id: tokenId,
					// det_or_pup: detectivesContract,
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

		const accountDetectives: Token[] = await getDetectivesById(
      accountId,
      connection,
    );

		if (isEmpty(accountDetectives)) {
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
          type: 'Stake',
          staked_nft_id: tokenId,
				}),
			}),
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
				from_index: null,
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

		const randomNumber = (Math.random() * 7).toFixed(0);

		const guessHash = await viewFunction(connection, gameContract, 'view_hash', {
      guess: {
        account_id: accountId,
        weapon: guess.weapon,
        motive: guess.motive,
        murderer: guess.murdered,
        random_number: `${randomNumber}`,
      },
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
				},
			);

			toast.success('Your guess has been successfully saved!');
		} catch (e) {
			console.warn(e);
			toast.error(
				'Something happens when saving your guess, please refresh your browser.',
			);
		}
	},

	getTicketsById: (accountId, connection) => {
		return viewFunction(
			connection,
			gameContract,
			'view_user_tickets',
			{
				account_id: accountId,
			},
		);
	},

	getStakedNftsById: (accountId, connection) => {
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
		connection,
	) => {
		if (!accountId) {
			return;
		}

		const { getGuessTokenPrice } = get();

		const transactions: Transaction[] = [];

		const storage = await getTokenStorage(
      connection,
      gameContract,
      tokenContract,
    );

		if (!storage || storage.total < '0.10') {
			transactions.push(
				getTransaction(
					accountId,
					tokenContract,
					'storage_deposit',
					{
						account_id: gameContract,
						registration_only: true,
					},
					'0.25',
				),
			);
		}

		const amount = await getGuessTokenPrice(tokenContract, connection);

		transactions.push(
			getTransaction(
				accountId,
				tokenContract,
				'ft_transfer_call',
				{
          amount,
					memo: null,
					approval_id: null,
					receiver_id: gameContract,
					msg: JSON.stringify({
						type: 'Guess',
						det_or_pup: detOrPupContract,
						token_id: detOrPupId,
					}),
				},
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

		const storage = await getTokenStorage(
      connection,
      accountId,
      lockedContract,
    );

		if (!storage || storage.total < '0.10') {
			transactions.push(
				getTransaction(
					accountId,
					lockedContract,
					'storage_deposit',
					{
						account_id: accountId,
						registration_only: true,
					},
					'0.50',
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
            type: 'Guess',
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

		vestings.forEach(({ id }) => {
			transactions.push(
				getTransaction(accountId, lockedContract, 'withdraw_locked_tokens', {
					vesting_id: id,
				}),
			);
		});

		const wallet = await connection.wallet();

		await executeMultipleTransactions(transactions, wallet);
	},
}));
