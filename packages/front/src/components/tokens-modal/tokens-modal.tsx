import { Fragment, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import LockedCard from './locked-card';
import { useWalletSelector } from '@/context/wallet';
import { viewFunction } from '@/helpers/near';
import { getPages } from '@/helpers';
import { Button } from '../button';
import isEmpty from 'lodash/isEmpty';
import { ContractData, Token } from './locked-card';
import { lockedContract, tokenContract } from '@/constants/env';

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

export const TokensModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlastPage, setIsLastPage] = useState(false);
	const [programs, setPrograms] = useState<Vesting[]>([]);
	const { selector, accountId } = useWalletSelector();
	const [contractData, setContractData] = useState<ContractData>([]);
	const [baseTokenMetadata, setBaseTokenMetadata] = useState<Token>();
	const [baseTokenBalance, setBaseTokenBalance] = useState('');

	const getNextPage = () => {
		const next = page + 1;

		if (isEmpty(programs)) {
			return 0;
		}

		return next;
	};

	const loadMore = async (indexOf: number) => {
    setIsLoading(true);

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

    setIsLoading(false);

    if (indexOf + 1 > totalPages) {
      setIsLastPage(true);
    }
	};

	useEffect(() => {
		if (!accountId) {
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
	}, [accountId]);

	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-[999999]"
					onClose={() => onClose()}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-6xl h-[650px] overflow-auto transform bg-black shadow-xl transition-all flex flex-col py-[44px] px-[50px] text-white">
									<div className="flex items-center justify-between pb-[45px]">
										<div className="mr-[12px]]">
											<span className="uppercase text-xl">
												My Locked Tokens
											</span>
										</div>

										<button
											onClick={() => onClose()}
											className="
                        h-10 w-10
                        text-white
                        border border-white
                        flex items-center justify-center
                        outline-none
                        hover:bg-white hover:text-black
                      "
										>
											<XMarkIcon className="w-12 h-12 text-current" />
										</button>
									</div>

                  <div>
                    {(!isEmpty(programs)) &&
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(315px,315px))] gap-7 justify-center flex-grow h-[calc(100%-85px)]">
                          {programs.map((program, index) => (
                            <LockedCard
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

                  {!isEmpty(programs) && !isSlastPage && (
                    <div
                      className="w-full flex justify-center pt-8"
                    >
                      <Button
                        disabled={isLoading}
                        onClick={async () => {
                          const nextPage = getNextPage();

                          void await loadMore(nextPage as number)
                        }}
                      >
                        Load More
                      </Button>
                    </div>
                  )}

                  {isEmpty(programs) && (
                    <div
                      className="w-full h-[calc(100%-85px)] flex items-center justify-center"
                    >
                      <span>
                        You have no Locked Tokens
                      </span>
                    </div>
                  )}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default TokensModal;
