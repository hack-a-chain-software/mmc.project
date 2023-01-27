import { Fragment } from 'react';
import { Button } from '../';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';

export default function ConfirmPickModal({
	isOpen,
	onClose,
  nftId,
}: {
  nftId: string;
	isOpen: boolean;
	onClose: () => void;
}) {
	const mint = () => {
		//
	};

	return (
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
					<div className="fixed inset-0 bg-black bg-opacity-40" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-xl transform overflow-hidden bg-black shadow-xl transition-all pt-[50px] p-[25px] text-white">
								<button
									onClick={() => onClose()}
									className="
                    h-10 w-10
                    text-white
                    border border-white
                    absolute right-[10px] top-[10px]
                    flex items-center justify-center
                    outline-none
                    hover:bg-white hover:text-black
                  "
								>
									<XMarkIcon className="w-12 h-12 text-current" />
								</button>

								<div className="pb-[24px]">
									<span className="uppercase text-sm">
										By stakink this clue:
									</span>
								</div>

								<div className="pb-[24px] text-sm">
									<span>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua.
									</span>
								</div>

								<div className="pb-[27px] text-sm">
									<span>To agree to these terms please select “OK”.</span>
								</div>

								<Button
									disabled={true}
									className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto"
								>
									Ok
								</Button>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
