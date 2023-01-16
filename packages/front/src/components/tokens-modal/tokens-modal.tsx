import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import LockedCard from './locked-card';

const lockedTokens = [
  null,
  null,
  null,
  null,
  null,
];

export const TokensModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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
                <Dialog.Panel className="w-full max-w-6xl h-[650px] overflow-auto transform bg-black shadow-xl transition-all py-[44px] px-[50px] text-white">
                  <div
                    className="flex items-center justify-between pb-[45px]"
                  >
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

                  <div
                    className="grid grid-cols-[repeat(auto-fill,minmax(315px,315px))] gap-7 justify-center"
                  >
                    {lockedTokens.map((_, index) => (
                      <LockedCard
                        key={`locked-token-items-${index}`}
                      />
                    ))}
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

export default TokensModal;
