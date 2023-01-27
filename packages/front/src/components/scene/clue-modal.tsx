import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { ClueInterface } from '@/interfaces';
import { Button, Socials } from '../';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ConfirmPickModal from './confirm-pick-modal';
import ConfirmStakeModal from './confirm-stake-modal';

interface ClueModalInterface {
	isOpen: boolean;
	sceneName: string;
	onClose: () => any;
}

export const ClueModal = ({
  media,
  name,
  description,
	isOpen,
  isOwner,
  isMinted,
  isStaked,
  nft_id,
	onClose,
	sceneName,
}: ClueModalInterface & ClueInterface) => {
	const [showConfirmPickModal, setShowConfirmPickModal] = useState(false);
  const [showConfirmStakeModal, setShowConfirmStakeModal] = useState(false);

	return (
		<>
			<ConfirmPickModal
        nftId={nft_id}
				isOpen={showConfirmPickModal}
				onClose={() => setShowConfirmPickModal(false)}
			/>

			<ConfirmStakeModal
        nftId={nft_id}
				isOpen={showConfirmStakeModal}
				onClose={() => setShowConfirmPickModal(false)}
			/>

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-50" onClose={() => onClose()}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-75" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel
									className="
                    w-max
                    relative
                    transform
                    transition-all
                    flex
                    items-center
                    justify-center
                    space-x-[32px]
                  "
								>
									<div className="w-[250px] h-[250px] border-white mt-1">
										<img src={media} className="h-full w-full" />
									</div>

									<button
										onClick={() => onClose()}
										className="
                      h-10 w-10
                      text-white
                      border border-white
                      absolute right-0 top-0
                      flex items-center justify-center
                      outline-none
                      hover:bg-white hover:text-black
                    "
									>
										<XMarkIcon className="w-12 h-12 text-current" />
									</button>

									<div className="flex flex-col justify-between h-[250px]">
										<div className="">
											<span
												className="
                          uppercase
                          text-white
                          text-lg
                        "
											>
												{isOwner ? 'Founded' : 'Available'}
											</span>
										</div>

										<div>
											<div>
												<span
													className="
                            uppercase
                            text-white
                            text-sm
                            font-[300]
                          "
												>
													Clue: {name}
												</span>
											</div>

											<div className="">
												<span
													className="
                            uppercase
                            text-white
                            text-sm
                            font-[300]
                          "
												>
													Location: {sceneName}
												</span>
											</div>
										</div>

										<div className="max-w-[720px] w-screen">
											<span
												className="
                          uppercase
                          text-white
                          text-sm
                          font-[400]
                        "
											>
												{description}
											</span>
										</div>

										<div className="flex items-center justify-between">
											<div className="mr-[32px] flex space-x-[20px]">
												<Button
                          disabled={!isMinted}
													onClick={() => setShowConfirmPickModal(true)}
													className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:bg-transparent disabled:opacity-75 disabled:cursor-not-allowed disabled:text-white"
												>
													Mint
												</Button>

												<Button
													disabled={isOwner && !isStaked}
                          onClick={() => setShowConfirmStakeModal(true)}
													className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:bg-transparent disabled:opacity-75 disabled:cursor-not-allowed disabled:text-white"
												>
													Stake
												</Button>
											</div>

											<div className="flex space-x-[19px]">
												<div>
													<span className="text-white text-sm uppercase">
														Share the news
													</span>
												</div>

												<Socials />
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default ClueModal;
