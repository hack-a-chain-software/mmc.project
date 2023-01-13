import { Fragment, useState } from 'react';
import { Button } from './button';
import { twMerge } from 'tailwind-merge';
import ConfirmPickModal from './scene/confirm-pick-modal';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition, Tab } from '@headlessui/react';

const tabs = ["My Clues", "All Clues"];

const myClues = [
  {
    minted: true,
    staked: false,
    image: '/images/mini-clues/footprint.png',
  },
  {
    staked: true,
    minted: false,
    image: '/images/mini-clues/notepad.png',
  },
  {
    staked: true,
    minted: false,
    image: '/images/mini-clues/file-folder.png',
  },
];

const allClues = [
  {
    found: false,
    notFound: true,
    revealed: false,
    image: '/images/mini-clues/ramen.png',
  },
  {
    found: true,
    notFound: false,
    revealed: false,
    image: '/images/mini-clues/pastry-wrapper.png',
  },
  {
    found: false,
    revealed: true,
    notFound: false,
    image: '/images/mini-clues/fsm-fresh-$2.99.png',
  },
  {
    found: false,
    notFound: true,
    revealed: false,
    image: '/images/mini-clues/file-folder.png',
  },
];

export function CluesModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
  const [showConfirmStakeModal, setShowConfirmStakeModal] = useState(false);

	return (
    <>
      <ConfirmPickModal
        isOpen={showConfirmStakeModal}
        onClose={() => setShowConfirmStakeModal(false)}
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
                <Dialog.Panel className="w-full max-w-4xl h-[540px] overflow-auto transform bg-black shadow-xl transition-all py-[44px] px-[50px] text-white">
                  <button
                    onClick={() => onClose()}
                    className="
                      h-10 w-10
                      text-white
                      border border-white
                      absolute right-[25px] top-[22px]
                      flex items-center justify-center
                      outline-none
                      hover:bg-white hover:text-black
                    "
                  >
                    <XMarkIcon className="w-12 h-12 text-current" />
                  </button>

                  <Tab.Group as="div" className="flex flex-col items-center space-y-[32px]">
                    <Tab.List className="flex space-x-[32px] rounded-xl p-1 max-w-md w-screen items-center justify-center">
                      {tabs.map((tab) => (
                        <Tab
                          key={tab}
                          className={({ selected }) =>
                            twMerge(
                              'w-[150px] min-h-[40px] tracking-[0px] rounded-[50px] font-[400] text-sm border border-white outline-none',
                              selected
                                ? 'bg-purple-0'
                                : 'bg-transparent',
                            )
                          }
                          children={tab}
                        />
                      ))}
                    </Tab.List>

                    <Tab.Panels className="mt-2 relative w-full">
                      <div
                        className="w-full h-[2px] bg-[#A522FB] mb-[32px]"
                      />

                      <Tab.Panel>
                        <div
                          className="flex space-x-[60px] px-[12px]"
                        >
                          {myClues.map(({ image, minted, staked}, index) => (
                            <div
                              key={`myclue-${index}`}
                              className="space-y-[18px] flex flex-col items-center "
                            >
                              <div
                                className="w-[150px] h-[150px] rounded-[15px] flex items-center justify-center"
                              >
                                <img
                                  src={image}
                                  className="max-w-full max-h-full"
                                />
                              </div>

                              <div>
                                <span
                                  className={
                                    twMerge(
                                      'text-base font-[300] text-white uppercase',
                                      minted ? 'opacity-1' : 'opacity-[0.35]',
                                    )
                                  }
                                >
                                  Minted
                                </span>
                              </div>

                              <div>
                                <span
                                  className={
                                    twMerge(
                                      'text-base font-[300] text-white uppercase',
                                      staked ? 'opacity-1' : 'opacity-[0.35]',
                                    )
                                  }
                                >
                                  Staked
                                </span>
                              </div>

                              {
                                !staked && (
                                  <div>
                                    <Button
                                      onClick={() => setShowConfirmStakeModal(true)}
                                      className="w-[100px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:bg-transparent disabled:opacity-75 disabled:pointer-events-none"
                                    >
                                      Stake
                                    </Button>
                                  </div>
                                )
                              }
                            </div>
                          ))}
                        </div>
                      </Tab.Panel>

                      <Tab.Panel>
                        <div
                          className="flex space-x-[60px] px-[12px]"
                        >
                          {allClues.map(({ image, found, notFound, revealed}, index) => (
                            <div
                              key={`allclues-${index}`}
                              className="space-y-[18px] flex flex-col items-center "
                            >
                              <div
                                className="w-[150px] h-[150px] rounded-[15px] flex items-center justify-center"
                              >
                                <img
                                  src={image}
                                  className="max-w-full max-h-full"
                                />
                              </div>

                              <div>
                                <span
                                  className={
                                    twMerge(
                                      'text-base font-[300] text-white uppercase',
                                      notFound ? 'opacity-1' : 'opacity-[0.35]',
                                    )
                                  }
                                >
                                  Not found
                                </span>
                              </div>

                              <div>
                                <span
                                  className={
                                    twMerge(
                                      'text-base font-[300] text-white uppercase',
                                      found ? 'opacity-1' : 'opacity-[0.35]',
                                    )
                                  }
                                >
                                  Found
                                </span>
                              </div>

                              <div>
                                <span
                                  className={
                                    twMerge(
                                      'text-base font-[300] text-white uppercase',
                                      revealed ? 'opacity-1' : 'opacity-[0.35]',
                                    )
                                  }
                                >
                                  Revealed
                                </span>
                              </div>

                              {
                                revealed && (
                                  <div>
                                    <span
                                      className={
                                        twMerge(
                                          'text-xs font-[300] text-white uppercase',
                                          revealed ? 'opacity-1' : 'opacity-[0.35]',
                                        )
                                      }
                                    >
                                      mateu...tnet
                                    </span>
                                  </div>
                                )
                              }
                            </div>
                          ))}
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
	);
}

export default CluesModal;
