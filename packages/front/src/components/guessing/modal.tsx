import { GuessingForm } from './form';
import { Button, Nft, StakeModal } from '..';
import { useState, Fragment, useMemo, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { useWalletSelector } from '@/context/wallet';
import { twMerge } from 'tailwind-merge';
import isEmpty from 'lodash/isEmpty';
import { useGame } from '@/stores/game';
import {
	detectivesContract,
	tokenContract,
	undercoverPupsContract,
} from '@/constants/env';
import { GameConfigInterface } from '@/interfaces';

export function GuessingModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const { selector } = useWalletSelector();

	const {
		config,
		stakeNft,
		accountId,
		getPupsById,
		getTicketsById,
		getStakedNftsById,
		getDetectivesById,
		buyTicketsWithTokens,
	} = useGame();

	const [ticketsAmount, setTicketsAmount] = useState(0);

	const [showStakeModal, setShowStakeModal] = useState(false);
	const [showStakedModal, setShowStakedModal] = useState(false);

	const [showGuessingForm, setShowGuessingForm] = useState(false);
	const [hasStakedGuessingNfts, sethasStakedGuessingNfts] = useState(false);

	useEffect(() => {
		if (!accountId) {
			return;
		}

		void (async () => {
			const tickets = await getTicketsById(accountId, selector);

			setTicketsAmount(tickets as number);

			const totalGuess = await getStakedNftsById(accountId, selector);

			sethasStakedGuessingNfts(!isEmpty(totalGuess));
		})();
	}, [accountId]);

	const hasTickets = useMemo(() => {
		return ticketsAmount > 0;
	}, [ticketsAmount]);

	return (
		<>
			<GuessingForm
				config={config as GameConfigInterface}
				isOpen={showGuessingForm}
				onClose={() => setShowGuessingForm(false)}
			/>

			<StakeModal
				isOpen={showStakeModal}
				onClose={() => setShowStakeModal(false)}
				onStake={async (selected) =>
					void (await stakeNft(selected, accountId, selector))
				}
				fetchTokens={async () => {
					if (!accountId) {
						return [];
					}

					const nfts: Nft[] = [];

					const detectives = await getDetectivesById(accountId, selector);

					nfts.push(
						...(detectives.map((nft) => ({
							...nft,
							contract: detectivesContract,
						})) as unknown as Nft[])
					);

					const undercoverPupsTokens = await getPupsById(accountId, selector);

					nfts.push(
						...(undercoverPupsTokens.map((nft) => ({
							...nft,
							contract: undercoverPupsContract,
						})) as unknown as Nft[])
					);

					return nfts;
				}}
			/>

			<StakeModal
				isMulti={false}
				isOpen={showStakedModal}
				buttonText={'Buy Ticket'}
				onClose={() => setShowStakedModal(false)}
				onStake={async (selected) => {
					const {
						// eslint-disable-next-line @typescript-eslint/naming-convention
						token_id,
						contract,
					} = selected[0];

					void (await buyTicketsWithTokens(
						token_id,
						contract,
						tokenContract,
						accountId,
						selector
					));
				}}
				// TODO: GET STAKED NFTS BY ID
				// fetchTokens={async () => {
				//   const nfts: Nft[] = [];

				//   const detectives = await getStakedNftsById(
				//     accountId,
				//     selector,
				//   );

				//   nfts.push(detectives as Nft);

				//   return nfts;
				// }}
				fetchTokens={async () => {
					if (!accountId) {
						return [];
					}

					const nfts: Nft[] = [];

					const detectives = await getDetectivesById(accountId, selector);

					nfts.push(
						...(detectives.map((nft) => ({
							...nft,
							contract: detectivesContract,
						})) as unknown as Nft[])
					);

					const undercoverPupsTokens = await getPupsById(accountId, selector);

					nfts.push(
						...(undercoverPupsTokens.map((nft) => ({
							...nft,
							contract: undercoverPupsContract,
						})) as unknown as Nft[])
					);

					return nfts;
				}}
			/>

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
								<Dialog.Panel className="w-full max-w-3xl transform overflow-hidden bg-black shadow-xl transition-all py-[44px] px-[50px] text-white space-y-4">
									<div className="flex items-center justify-between">
										<div className="mr-[12px]]">
											<span className="uppercase text-xl">Ready to guess?</span>
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
										<span>
											You need to burn tickets for every guess you want to risk
										</span>
									</div>

									<div>
										<span>
											Stake your NFT's and receive tickets to be able to guess
											before the season ends.
										</span>
									</div>

									<div>
										<span className="text-sm text-[#F124AD]">
											After the first skate of your NFT, you can use MMC Tokens
											to buy more tickets and guess more often!
										</span>
									</div>

									<div className="pb-2.5">
										<span>Redeem tickets:</span>
									</div>

									<div className="flex items-center space-x-[10px]">
										<Button
											onClick={() => setShowStakeModal(true)}
											className="w-full text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto bg-transparent"
										>
											With Stake
										</Button>

										<Button
											disabled={!hasStakedGuessingNfts}
											onClick={() => setShowStakedModal(true)}
											className="w-full text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto bg-transparent"
										>
											With MMC Tokens
										</Button>
									</div>

									<div>
										<span>
											With your tickets in hand, just guess and hope for the
											rewards
										</span>
									</div>

									<div>
										<Button
											disabled={!hasTickets}
											onClick={() => setShowGuessingForm(true)}
											className="w-full text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto disabled:bg-transparent"
										>
											Guess Now!
										</Button>
									</div>

									<div
										className={twMerge(
											'',
											hasTickets ? 'text-white' : 'text-[#DB2B1F]'
										)}
									>
										<span children={`Tickets Available: ${ticketsAmount}`} />
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

export default GuessingModal;
