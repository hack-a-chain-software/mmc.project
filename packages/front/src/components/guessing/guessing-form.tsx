import { Button, Select } from '..';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';

const items = [
  {
    label: 'foo',
    value: 'baa',
  },
  {
    label: 'baa',
    value: 'foo',
  },
];

export function GuessingForm({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
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
							<Dialog.Panel className="w-full max-w-3xl transform overflow-hidden bg-black shadow-xl transition-all py-[44px] px-[50px] text-white">
                <div
                  className="flex items-center justify-between pb-[45px]"
                >
                  <div className="mr-[12px]]">
                    <span className="uppercase text-xl">
                      Ready to guess?
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

								<div className="pb-[20px] w-full">
                  <div>
                    <span
                      className="text-base uppercase"
                    >
                      Who murdered john norris?
                    </span>
                  </div>

                  <Select
                    value={''}
                    items={items}
                    onChange={() => {}}
                    placeholder="SELECT"
                  />
								</div>

								<div className="pb-[20px]">
                  <div>
                    <span
                      className="text-base uppercase"
                    >
                      What was the weapon?
                    </span>
                  </div>

                  <Select
                    value={''}
                    items={items}
                    onChange={() => {}}
                    placeholder="SELECT"
                  />
								</div>

								<div className="pb-[40px] w-full">
                  <div>
                    <span
                      className="text-base uppercase"
                    >
                      What was the motive?
                    </span>
                  </div>

                  <Select
                    value={''}
                    items={items}
                    onChange={() => {}}
                    placeholder="SELECT"
                  />
								</div>

								<div className="pb-[24px] text-xs">
									<span>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </span>
								</div>

                <div className="pb-[49px] text-xs">
                  <span>
                    If you agree to the above please select “SUBMIT”.
                  </span>
                </div>

								<Button
									disabled={true}
									className="w-[125px] flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto"
								>
									Submit
								</Button>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default GuessingForm;
