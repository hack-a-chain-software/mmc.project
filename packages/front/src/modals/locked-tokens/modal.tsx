import { BaseModalPropsInterface } from '@/interfaces/modal';
import { ModalTemplate } from '../modal-template';
import { useEffect, useMemo, useState } from 'react';
import { viewFunction } from '@/helpers/near';
import { getPages } from '@/helpers';
import { Button } from '@/components';
import isEmpty from 'lodash/isEmpty';
import { LockedTokensCard, ContractData, Token } from './card';
import { lockedContract, tokenContract } from '@/constants/env';
import { useUser } from '@/stores/user';
import { useWallet } from '@/stores/wallet';
import { useModal } from '@/stores/modal';

const ITEMS_PER_PAGE = 10;

export interface Vesting {
	id?: string;
	beneficiary: string;
	locked_value: string;
	start_timestamp: string;
	vesting_duration: string;
	fast_pass: boolean;
	withdrawn_tokens: string;
	available_to_withdraw: string;
}

export type LockedTokensModalInterface = Partial<BaseModalPropsInterface>;

export const LockedTokensModal = () => {
  const {
    onCloseModal,
    lockedTokens: isOpen,
  } = useModal();

	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(0);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [isSlastPage, setIsLastPage] = useState(false);
	const [programs, setPrograms] = useState<Vesting[]>([]);
	const { selector } = useWallet();
	const [contractData, setContractData] = useState<ContractData>([]);
	const [baseTokenMetadata, setBaseTokenMetadata] = useState<Token>();
	const [baseTokenBalance, setBaseTokenBalance] = useState('');

  const {
    autenticated,
    accountId,
  } = useUser();

  const isLoading = useMemo(() => {
    return !autenticated || !isOpen || !accountId;
  }, [autenticated, isOpen, accountId]);

	const getNextPage = () => {
		const next = page + 1;

		if (isEmpty(programs)) {
			return 0;
		}

		return next;
	};

	const loadMore = async (indexOf: number) => {
		const items: Vesting[] = await viewFunction(
			selector,
			lockedContract,
			'view_vesting_paginated',
			{
				account_id: accountId,
				initial_id: `${indexOf * ITEMS_PER_PAGE}`,
				size: `${ITEMS_PER_PAGE}`,
			},
		);

		setPrograms([
      ...programs,
      ...items.map((item, i) => ({ ...item, id: String(i) })),
    ]);

    setPage(indexOf);

    setIsLoadingPrograms(false);

    if (indexOf >= totalPages) {
      setIsLastPage(true);
    }
	};

	useEffect(() => {
		if (isLoading) {
			return;
		}

		void (async () => {
			const totalPrograms = await viewFunction(
				selector,
				lockedContract,
				'view_vesting_vector_len',
				{
					account_id: accountId,
				},
			);

			const res = getPages(totalPrograms, ITEMS_PER_PAGE);

			setTotalPages(res as number);

			const lockedContractData = await viewFunction(
				selector,
				lockedContract,
				'view_contract_data',
				{
					account_id: accountId,
				},
			);

			setContractData(lockedContractData as ContractData);

			const token = await viewFunction(selector, tokenContract, 'ft_metadata');

			setBaseTokenMetadata(token as Token);

			const balance = await viewFunction(
				selector,
				tokenContract,
				'ft_balance_of',
				{
					account_id: accountId,
				},
			);

			setBaseTokenBalance(balance as string);

			void (await loadMore(0));
		})();
	}, [accountId, isLoading]);

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={() => onCloseModal('lockedTokens')}
      isLoading={isLoadingPrograms || isLoading}
      title="My Locked Tokens"
      className="w-full max-w-6xl h-[650px] overflow-auto transform bg-black shadow-xl transition-all flex flex-col py-[44px] px-[50px] text-white"
    >
      <div>
        {(!isEmpty(programs)) &&
            <div className="grid grid-cols-[repeat(auto-fill,minmax(315px,315px))] gap-7 justify-center flex-grow h-[calc(100%-85px)]">
              {programs.map((program, index) => (
                <LockedTokensCard
                  key={`locked-token-items-${index}`}
                  contractData={contractData}
                  token={baseTokenMetadata as Token}
                  baseTokenBalance={baseTokenBalance}
                  {...program}
                />
              ))}
          </div>
        }
      </div>

      {!isEmpty(programs) || !isSlastPage && (
        <div
          className="w-full flex justify-center pt-8"
        >
          <Button
            disabled={isLoading}
            onClick={async () => {
              const nextPage = getNextPage();

              void await loadMore(nextPage);
            }}
          >
            Load More
          </Button>
        </div>
      )}

      {isEmpty(programs) && (
        <div
          className="w-full h-[500px] flex items-center justify-center"
        >
          <span>
            You have no Locked Tokens
          </span>
        </div>
      )}
    </ModalTemplate>
  );
};
