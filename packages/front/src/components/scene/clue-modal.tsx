import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useWalletSelector } from "@/utils/context/wallet";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ClueInterface } from '@/utils/interfaces';
import { Button, Socials } from '../';

interface ClueModalInterface {
  isOpen: boolean,
  sceneName: string,
  onClose: () => any,
}

export const ClueModal = ({
  name,
  about,
  owner,
  isOpen,
  onClose,
  sceneName,
}: ClueModalInterface & ClueInterface) => {
  return (
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
                  w-full
                  transform
                  overflow-hidden
                  transition-all
                  flex
                  items-start
                  justify-center
                  space-x-[32px]
                "
              >
                <div
                  className="w-[250px] h-[250px] border-white mt-1"
                >
                  <img
                    src="./images/clue-ramen.png"
                  />
                </div>

                <div
                  className="flex flex-col"
                >
                  <div
                  	className="mb-[32px]"
                  >
                    <span
                      className="
                        uppercase
                        text-white
                        text-xl
                      "
                    >
                      {!!owner ? 'Founded' : 'Available'}
                    </span>
                  </div>

                  <div>
                    <span
                      className="
                        uppercase
                        text-white
                        text-xl
                        font-[300]
                      "
                    >
                      Clue: {name}
                    </span>
                  </div>

                  <div
                    className="mb-[32px]"
                  >
                    <span
                      className="
                        uppercase
                        text-white
                        text-xl
                        font-[300]
                      "
                    >
                      Location: {sceneName}
                    </span>
                  </div>

                  <div
                    className="max-w-[720px] w-screen mb-[18px]"
                  >
                    <span
                      className="
                        uppercase
                        text-white
                        text-xl
                        font-[300]
                      "
                    >
                      {about}
                    </span>
                  </div>

                  <div
                    className="flex items-center"
                  >
                    <div
                      className="mr-[32px]"
                    >
                      <Button
                        className="px-[24px]"
                      >
                        Mint
                      </Button>
                    </div>

                    <Socials/>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ClueModal;
