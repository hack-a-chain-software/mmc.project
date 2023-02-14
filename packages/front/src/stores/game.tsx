import Big from 'big.js';
import { create } from 'zustand';
import {
	firstScene,
	tokenContract,
	undercoverPupsContract,
} from '@/constants/env';
import { Token, ClueInterface } from '@/interfaces';
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
import { getUTCDate } from '@/helpers';
import { isBefore } from 'date-fns/esm';
import { useUser } from './user';
import { GameStoreInterface } from '@/interfaces/store/game';

export const useGame = create<GameStoreInterface>((set, get) => ({
  clues: null,
	scene: null,
	config: null,
  myClues: null,
	controls: null,
  isLoading: false,

  openScene: async () => {
    const {
      controls,
    } = get();

    await controls?.start({ clipPath: 'circle(0% at 50vw 50vh)' });

    document.body.classList.remove('modal-open');

    set({
      isLoading: true,
    });
  },

  hideScene: async () => {
    const {
      controls,
    } = get();

    document.body.classList.add('modal-open');

    await controls?.start({ clipPath: 'circle(200% at 50vw 50vh)' });

    set({
      isLoading: false,
    });
  },

	initGame: async (controls) => {
    const {
      accountId,
      sendRequest,
    } = useUser.getState();

		const { data } = await sendRequest('/game/config', 'get');

		set({
			controls,
			config: {
        ...data,
        ...data.config,
      },
		});

    const {
      getClues,
      getScene,
    } = get();

    let clues, myClues: ClueInterface[] | null = null;

    if (accountId) {
      clues = await getClues();
      myClues = clues.filter((clue) => clue.isOwner);
    }

    set({
      clues,
      myClues,
    });

    await getScene();

		return data;
	},

  guessingIsOpen: () => {
    const {
      config,
    } = get();

    const {
      accountId,
    } = useUser.getState();

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
    const {
      sendRequest,
    } = useUser.getState();

    try {
      const { data } = await sendRequest('/game/guess/', 'get');

      return data;
    } catch (e) {
      console.warn(e);

      return [];
    }
  },

  claimAllGuessingRewards: async () => {
    const {
      sendRequest,
    } = useUser.getState();

    try {
      const { data } = await sendRequest('/game/rewards/', 'post', {});

      return data;
    } catch (e) {
      console.warn(e);
    }
  },

  moveToScene: async (id) => {
		const {
      controls,
      getScene,
      hideScene,
    } = get();

    if (!controls) {
      return;
    }

		await hideScene();

    set({
      scene: null,
    });

		void await getScene(id);
  },

	getScene: async (id = firstScene) => {
    const {
      sendRequest,
    } = useUser.getState();

    const { data } = await sendRequest(`/game/scene/${id as string}`, 'get');

		set({
			scene: data,
		});

		return data;
	},

	getClues: async () => {
    const {
      sendRequest,
    } = useUser.getState();

    try {
      const { data } = await sendRequest('/game/clues', 'get');

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

		transactions.push(
			getTransaction(accountId, currency.contract, 'ft_transfer_call', {
        amount: currency.token_price,
				memo: null,
				approval_id: null,
				receiver_id: gameContract,
				msg: JSON.stringify({
					type: 'Claim',
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

    const {
      sendRequest,
    } = useUser.getState();

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
      await sendRequest(
        'game/guess',
        'post',
				{
					hash: guessHash,
					random_number: randomNumber,
					...guess,
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
