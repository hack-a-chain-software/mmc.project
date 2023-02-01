import { Button } from '..';
import { useState, Fragment, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import StakeCard from './stake-card';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { useGame } from '@/stores/game';

export interface Nft {
  token_id: string;
  owner_id: string;
  metadata: Partial<Metadata>;
  contract: string;
}

export interface Metadata {
  title: string;
  description: string;
  media: string;
}

export interface Selected extends Nft {
  contract: string;
}

export const StakeModal = ({
  isOpen,
  onClose,
  onStake,
  fetchTokens,
  isMulti = true,
  buttonText = 'Stake',
}: {
  isOpen: boolean;
  isMulti?: boolean;
  buttonText?: string;
  onClose: () => void;
  onStake: (selected: Nft[]) => Promise<void>,
  fetchTokens: () => Promise<Nft[]>
}) => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [selected, setSelected] = useState<Selected[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { accountId } = useGame();

  useEffect(() => {
    if (!accountId || !isOpen) {
      return;
    }

    void (async () => {

      const tokens = await fetchTokens();

      setIsLoading(false);

      setNfts(tokens);
    })();
  }, [accountId, isOpen]);

  const onSelect = (newValue: { token_id: string, contract: string } & Nft) => {
    if (!isMulti) {
      setSelected([newValue]);

      return;
    }

    const hasEqualValue = selected.findIndex(
      item => isEqual(item, newValue),
    ) !== -1;

    if (hasEqualValue) {
      setSelected(selected.filter(item => !isEqual(item, newValue)));

      return;
    }

    setSelected([...selected, newValue]);
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
          <div className="fixed inset-0 bg-black bg-opacity-30" />
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
              <Dialog.Panel className="w-full max-w-[639px] min-h-[443px] transform overflow-hidden bg-white rounded-md transition-all py-4 px-8 text-white space-y-4">
                <div
                  className="flex items-center justify-between"
                >
                  <div className="mr-[12px]]">
                    <span className="uppercase text-xl text-black">
                      Select NFT's
                    </span>
                  </div>

                  <button
                    onClick={() => onClose()}
                    className="
                      h-10 w-10
                      text-black
                      border border-black
                      flex items-center justify-center
                      outline-none
                      hover:bg-black hover:text-white
                    "
                  >
                    <XMarkIcon className="w-12 h-12 text-current" />
                  </button>
                </div>

                {!isLoading && !isEmpty(nfts) && (
                  <div
                    className="grid grid-cols-[repeat(auto-fill,minmax(173px,173px))] gap-7 justify-center max-h-[300px] overflow-auto min-h-[300px]"
                  >
                    {nfts.map(({ token_id, metadata, contract }) => (
                      <StakeCard
                        id={`${token_id}`}
                        image={metadata.media}
                        title={metadata.title}
                        isSelected={selected.findIndex(item => (
                          item.contract === contract
                          && item.token_id === token_id
                        )) !== -1}
                        onSelect={() => onSelect({
                          contract,
                          token_id: token_id,
                        })}
                        key={`stake-modal-nft-${token_id}`}
                      />
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div
                    className="flex items-center justify-center h-[300px] w-full"
                  >
                    <svg className="animate-spin h-8 w-8 border border-l-black rounded-full" viewBox="0 0 24 24"/>
                  </div>
                )}

                {!isLoading && isEmpty(nfts) && (
                  <div
                    className="flex items-center justify-center bg-blue h-[300px]"
                  >
                    <span
                      className="text-black"
                    >
                      You don't have NFT's to stake
                    </span>
                  </div>
                )}

                {!isLoading && !isEmpty(nfts) && (
                  <div
                    className="flex justify-between items-center w-full pt-2.5"
                  >
                    <Button
                      onClick={() => onClose()}
                      className="w-[125px] min-h-[30px] h-[30px] text-xs flex justify-center bg-transparent hover:bg-purple-0 hover:text-white border-purple-0 text-purple-0"
                    >
                      Cancel
                    </Button>

                    <Button
                      disabled={isEmpty(selected)}
                      onClick={() => void onStake(selected)}
                      className="min-w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:cursor-not-allowed hover:opacity-80 hover:bg-purple-0 hover:text-white"
                    >
                      {buttonText}
                    </Button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StakeModal;
