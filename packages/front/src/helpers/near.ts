import Big from 'big.js';
import { Nft } from '@/components';
import { AttachedGas } from '@/constants';
import { utils, providers } from 'near-api-js';
import type { CodeResult } from 'near-api-js/lib/providers/provider';
import { Vesting } from '@/components/tokens-modal/locked-card';
import { cluesContract, lockedContract, tokenContract } from '@/constants/env';

export interface Transaction {
  signerId: string;
  receiverId: string;
  actions: Action[];
}

export interface Action {
  type: string;
  params: Params;
}

export interface Params {
  methodName: string;
  args: any;
  gas: string;
  deposit: string;
}

const refreshPage = (transactions: string) => {
  const newUrl = `${window.location.origin}${window.location.pathname}?transactionHashes=${transactions}`;

  window.location.href = newUrl;
};

export const executeMultipleTransactions = async (
  transactions: Transaction[],
  wallet: any,
) => {
  try {
    const result = await wallet.signAndSendTransactions({ transactions });

    refreshPage(result.map(({ transaction }) => transaction.hash).join(',') as string);
  } catch (e) {
    console.warn(e);
  }
};

export const getTransaction = (
  signerId: string,
  receiverId: string,
  method: string,
  args: any,
  amount?: string,
): Transaction => {
  return {
    signerId,
    receiverId,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: method,
          args,
          gas: AttachedGas,
          deposit: amount ? utils.format.parseNearAmount(amount)! : '1',
        },
      },
    ],
  };
};

export const viewFunction = async (
  selector,
  contractId,
  methodName,
  args = {},
) => {
  const { network } = selector.options;

  const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

  const serializedArgs = window.btoa(JSON.stringify(args));

  const res = await provider.query<CodeResult>({
    request_type: 'call_function',
    account_id: contractId,
    method_name: methodName,
    args_base64: serializedArgs,
    finality: 'optimistic',
  });

  return (
    res &&
    res.result.length > 0 &&
    JSON.parse(Buffer.from(res.result).toString())
  );
};

export const getTokenStorage = async (connection, account, token) => {
  try {
    return await viewFunction(connection, token, 'storage_balance_of', {
      account_id: account,
    });
  } catch (e) {
    return;
  }
};

export const stakeNft = async (
  selector: any,
  accountId: string,
  items: Nft[],
) => {
  const wallet = await selector.wallet();

  const transactions: Transaction[] = [];

  const stakingStorage = await getTokenStorage(
    selector,
    accountId,
    cluesContract,
  );

  if (
    !stakingStorage ||
    new Big(stakingStorage?.available).lte('100000000000000000000000')
  ) {
    transactions.push(
      getTransaction(
        accountId,
        cluesContract as string,
        'storage_deposit',
        {
          account_id: accountId,
          registration_only: false,
        },
        '0.25',
      ),
    );
  }

  items.forEach(({ token_id, contract }) => {
    transactions.push(
      getTransaction(accountId, contract as string, 'nft_transfer_call', {
        token_id,
        memo: null,
        approval_id: null,
        receiver_id: cluesContract,
        msg: JSON.stringify({
          token_id,
          route: '?',
          det_or_pup: contract,
        }),
      }),
    );
  });

  await executeMultipleTransactions(transactions, wallet);
};

export const withdraw = async (
  selector: any,
  accountId: string,
  vestings: Vesting[],
) => {
  const transactions: Transaction[] = [];

  const storage = await getTokenStorage(
    selector,
    accountId,
    tokenContract,
  );

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
      getTransaction(
        accountId,
        lockedContract as string,
        'withdraw_locked_tokens',
        {
          vesting_id: vesting,
        },
      ),
    );
  });

  const wallet = await selector.wallet();

  await executeMultipleTransactions(transactions, wallet);
};

export const buyFastPass = async (
  vesting: string,
  amount: string,
  passCost: string,
  accountId: string,
  selector: any,
) => {
  const transactions: Transaction[] = [];

  const storage = await getTokenStorage(
    selector,
    accountId,
    tokenContract,
  );

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
    getTransaction(
      accountId,
      tokenContract as string,
      'ft_transfer_call',
      {
        amount: new Big(amount).times(passCost).div('10000').toFixed(0),
        receiver_id: lockedContract,
        memo: null,
        msg: JSON.stringify({
          type: 'BuyFastPass',
          account_id: accountId,
          vesting_index: vesting,
        }),
      },
    ),
  );

  const wallet = await selector.wallet();

  await executeMultipleTransactions(transactions, wallet);
};
