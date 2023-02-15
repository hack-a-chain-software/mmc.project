import { useGame } from '@/stores/game';
import { Button, Socials } from '@/components';
import { Fragment, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BaseModalPropsInterface } from '@/interfaces/modal';
import { ClueInterface, GameCurrencyInterface } from '@/interfaces';
import { useWallet } from '@/stores/wallet';
import { useModal } from '@/stores/modal';
import { getClueStatus } from '@/helpers/game';

export interface SceneClueModalInterface extends
  BaseModalPropsInterface,
  ClueInterface {
  sceneName: string,
}

export const SceneClueModal = () => {
  const {
    props,
    sceneClue,
    onShowModal,
    onCloseModal,
  } = useModal();

  const {
    name,
    media,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    nft_id,
    isOwner,
    isMinted,
    isStaked,
    sceneName,
    description,
  } = useMemo(() => props.sceneClue as SceneClueModalInterface || {}, [props]);

  const {
    selector,
    accountId,
  } = useWallet();

  const { claimClue } = useGame();

  const onClaim = () => {
    const callback = (
      selectedCurrency: GameCurrencyInterface,
    ) => {
      if (!accountId) {
        return;
      }

      void claimClue(
        nft_id as string,
        selectedCurrency,
        accountId,
        selector as any,
      );
    };

    onShowModal('currency', {
      callback,
      title: 'Mint clue',
      buttonText: 'Mint Now',
    });
  };

  return (
    <Transition appear show={sceneClue} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => onCloseModal('sceneClue')}>
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
                  onClick={() => onCloseModal('sceneClue')}
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
                      {getClueStatus({
                        isMinted,
                        isOwner,
                        isStaked,
                      })}
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
                        disabled={isMinted}
                        onClick={() => onClaim()}
                        className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:bg-transparent disabled:opacity-75 disabled:cursor-not-allowed disabled:text-white"
                      >
                        Mint
                      </Button>

                      <Button
                        disabled={!isOwner || (isOwner && isStaked)}
                        onClick={async () => {
                          await onShowModal('confirmStakeClue', { nft_id });
                        }}
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
  );
};
